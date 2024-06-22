from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import MetaData, Table, create_engine, inspect
from models import Exercise, ExerciseSet, MuscleGroup, db, Muscle, Workout, WorkoutExercise
import json
from datetime import datetime, timedelta

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'

CORS(app)

with app.app_context():

    ##########################
    # Suggestions Routes
    ##########################
    @app.route("/suggestions/muscles")
    def get_muscles():
        muscles =Muscle.query.all()
        return { "muscles": [m.to_dict() for m in muscles] }

    @app.route('/suggestions/exercise/<int:muscle_id>')
    def get_exercises_by_muscle(muscle_id):
        exercises = Exercise.query.filter(Exercise.target_muscles.any(id=muscle_id)).all()
        return [{
            "name": e.name,
            "id": e.id
        } for e in exercises]

    @app.route('/suggestions/exercises')
    def get_exercises():
        filtered_muscle_names = [name.strip() for name in request.args.getlist('name')]
        exercises = Exercise.query.all()
        if not filtered_muscle_names:
            return {"exercises": [e.to_dict() for e in exercises]}

        # this will be a map that will have muscle names as key with a list of exercises
        muscle_to_exercise_map = {}
        
        # if create the keys of the map
        for filtered_muscle_name in filtered_muscle_names:
            if filtered_muscle_name not in muscle_to_exercise_map:
                muscle_to_exercise_map[filtered_muscle_name] = []

        # add the exercise to the correct key in the map
        for exercise in exercises:
            for muscle_name in muscle_to_exercise_map.keys():   
                if muscle_name in exercise.get_target_muscle_names():
                    muscle_to_exercise_map[muscle_name].append(exercise)

        response_data = []
        for muscle_name in muscle_to_exercise_map:
            muscle_id = Muscle.query.filter_by(name=muscle_name).first().id
            response_data.append({
                "name": muscle_name,
                "id": muscle_id,
                "exercises": [{
                    "name":e.name,
                    "id":e.id
                } for e in muscle_to_exercise_map[muscle_name]]
            })
        return response_data
    
    ##########################
    # Workout Routes
    ##########################
    def find_next_sunday():
        today = datetime.today()
        # Calculate how many days to add to get to the next Sunday
        days_to_add = (6 - today.weekday() + 7) % 7
        next_sunday = today + timedelta(days=days_to_add)
        return next_sunday
    
    @app.route("/workouts")
    def get_workouts():
        # default will be to get workouts in the past 7 days
        # Convert seven_days_ago to string in the same format as the stored date
        this_past_sunday_str = (find_next_sunday() - timedelta(days=7)).strftime('%Y-%m-%dT%H:%M:%S.%fZ')
        this_sunday_str = (find_next_sunday()).strftime('%Y-%m-%dT%H:%M:%S.%fZ')
        active_workout = Workout.query.filter_by(is_active=True).first()
        inactive_workouts = Workout.query.filter(
            Workout.is_active == False,
            Workout.date >= this_past_sunday_str,
            Workout.date < this_sunday_str
        ).all()

        if active_workout:
            active_workout_data = active_workout.to_dict()
        else:
            active_workout_data = None

        return jsonify({
            "active_workout": active_workout_data,
            "inactive_workouts": [w.to_dict_condensed() for w in inactive_workouts]
        }), 200
    
    @app.route('/workout/<int:workout_id>')
    def get_workout(workout_id):
        workout = Workout.query.filter_by(id=workout_id).first_or_404()
        return workout.to_dict()
    
    @app.route("/create-workout", methods=["POST"])
    def create_workout():
        data = request.get_json()

        # ensure the date is not null
        date_str = data.get('date', "")
        if not date_str:
            return jsonify({"error": "Cannot create workout, you must have a date."}), 409
        try:
            date = datetime.fromisoformat(date_str.replace('Z', ''))
        except ValueError:
            return jsonify({"error": "Invalid date format"}), 400

        # get the values from request
        name = data.get('name', "")
        target_muscles_names = data.get('target_muscles', [])
        is_active = data.get('is_active', False)

        # check if there is already a active workout if wanting to make an active
        if is_active and Workout.query.filter_by(is_active=True).count() != 0:
            return jsonify({"error": "Cannot create workout, you can only have one active workout."}), 409
        
        # find the muscles and query for them
        target_muscles  = []
        for muscle_name in target_muscles_names:
            muscle = Muscle.query.filter_by(name=muscle_name).first()
            if not muscle:
                return jsonify({"error": "Attempted to add a new muscle not in the database"}), 400
            target_muscles.append(muscle)
        
        # create the workout
        workout = Workout(name, date, target_muscles, is_active)
        db.session.add(workout)
        db.session.flush()

        # if there was not a name make auto name
        if name == "":
            workout.name = f'Workout {workout.id}'

        db.session.commit()

        return jsonify({"success": True, "workout": workout.to_dict()}), 201
    
    # @app.route("/edit-workout/toggle-activation/<int:workout_id>", methods=['PATCH'])
    # def edit_workout():    
    #     return ""
    
    @app.route("/edit-workout/<int:workout_id>", methods=['PATCH'])
    def edit_workout(workout_id):
        data = request.get_json()
        workout = Workout.query.filter_by(id = workout_id).first_or_404()

        name_in = data.get('name')
        date_in = data.get('date')
        active_in = data.get('is_active')

        if (name_in):
            workout.name = name_in
        
        if (date_in):
            workout.date = date_in
        
        if (active_in):
            workout.is_active = active_in
        
        db.session.commit()
        return jsonify(workout.to_dict()), 200

    @app.route('/delete-workout/<int:workout_id>', methods=['DELETE'])
    def delete_workout(workout_id):
        workout = Workout.query.filter_by(id = workout_id).first_or_404()
        for workout_exercise in workout.workout_exercises:
            delete_workout_exercise(workout_exercise.id)

        db.session.delete(workout)
        db.session.commit()
        return jsonify("Succesfully Deleted Workout"), 200

    ##########################
    # Exercise Routes
    ##########################
    @app.route('/workout/exercise/<int:exercise_id>')
    def get_workout_exercise(exercise_id):
        workout_exercise = WorkoutExercise.query.filter_by(id=exercise_id).first_or_404()
        return workout_exercise.to_dict()
    
    @app.route("/create-exercise/<int:workout_id>", methods=['PATCH'])
    def create_exercise(workout_id):
        data = request.get_json()
        workout = Workout.query.filter_by(id=workout_id).first_or_404()

        name = data.get('name', 'N/A')
        sets_data = data.get('sets', [])
        
        db_exercise_sets = []
        for set_data in sets_data:
            rep_num = set_data.get('rep_num')
            weight = set_data.get('weight')
            db_set = ExerciseSet(rep_num, weight)
            db_exercise_sets.append(db_set)

        db_workout_exercise = WorkoutExercise(name, db_exercise_sets)
        workout.add_exercise(db_workout_exercise)
        db.session.commit()    
        return jsonify(workout.to_dict()), 200
    
    @app.route("/edit-exercise/<int:exercise_id>", methods=['PATCH'])
    def edit_exercise(exercise_id):
        data = request.get_json()
        workout_exercise = WorkoutExercise.query.filter_by(id=exercise_id).first_or_404()

        name_in = data.get('name')
        sets_in = data.get('sets')

        if (name_in):
            workout_exercise.name = name_in
        
        if (sets_in):
            # delete the old set data
            sets_data = workout_exercise.sets
            for set_data in sets_data:
                db.session.delete(set_data)
            
            db.session.flush()

            # add the new set data
            for set_in in sets_in:
                rep_num = set_in.get('rep_num')
                weight = set_in.get('weight')
                db_set = ExerciseSet(rep_num, weight)
                db_set.workout_exercise_id = workout_exercise.id  # Assign workout_exercise_id here
                workout_exercise.sets.append(db_set)

        db.session.commit()
        return jsonify(workout_exercise.to_dict()), 200
    
    @app.route('/workout/delete-exercise/<int:exercise_id>', methods=['DELETE'])
    def delete_workout_exercise(exercise_id):
        workout_exercise = WorkoutExercise.query.filter_by(id = exercise_id).first_or_404()

        sets = ExerciseSet.query.filter_by(workout_exercise_id=exercise_id).all()
        for s in sets:
            db.session.delete(s)
        
        db.session.flush()

        db.session.delete(workout_exercise)
        db.session.commit()
        return jsonify("Succesfully Deleted Exercise"), 200
    
    ##########################
    # Initializing the database
    ##########################
    def init_db():
        file_path = './instance/static_data.json'
        with open(file_path, 'r') as file:
            data = json.load(file)
            if isinstance(data, dict):
                if not MuscleGroup.query.all():
                    muscle_groups_data = data.get('muscle_groups')
                    for group in muscle_groups_data:
                        name = group.get("name")
                        db_group = MuscleGroup(name)
                        db.session.add(db_group)
                        db.session.flush()
                        
                        muscle_name_data = group.get('muscle_names')
                        for muscle_name in muscle_name_data:
                            muscle = Muscle(muscle_name, db_group)
                            db.session.add(muscle)
                    db.session.commit()

                if not Exercise.query.all():
                    exercise_data = data.get('exercises')
                    for exercise in exercise_data:
                        name = exercise.get("name")
                        target_muscles  = []
                        for muscle_name in exercise.get('muscle_names'):
                            muscle = Muscle.query.filter_by(name=muscle_name).first()
                            if muscle:
                                target_muscles.append(muscle)
                        db_exercise = Exercise(name, target_muscles)
                        db.session.add(db_exercise)
                        db.session.commit()
                
    
    db.init_app(app)
    db.create_all()
    
    init_db()

    if __name__ == "__main__":
        app.run(host="0.0.0.0", port=8080, debug=True)
