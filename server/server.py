from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import MetaData, Table, create_engine, inspect
from models import ExerciseSet, MuscleGroup, db, Muscle, Workout, Exercise

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'

CORS(app)

with app.app_context():
        
    @app.route("/temp-e")
    def temp_e():
        active_workout = Workout.query.filter_by(is_active=True).first()
        e = Exercise(name="Ass Boned")
        sets = []
        sets.append(ExerciseSet(1,100))
        sets.append(ExerciseSet(2,145))
        sets.append(ExerciseSet(3,145))

        e.sets = sets
        active_workout.add_exercise(e)
        db.session.add(e)
        db.session.commit()
        return "success"

    @app.route("/temp-delete")
    def temp_delete():
        active_workout = Workout.query.filter_by(is_active=True).first()
        if active_workout:
            db.session.delete(active_workout)
            db.session.commit()
            return "success"
        return "not success"
    
    @app.route("/muscles")
    def get_muscles():
        muscles =Muscle.query.all()
        return { "muscles": [m.to_dict() for m in muscles] }
    
    @app.route('/exercises')
    def get_exercises():
        exercises = Exercise.query.all()
        return {"exercises": [e.to_dict() for e in exercises]}
    
    @app.route('/workout/<int:workout_id>')
    def get_workout(workout_id):
        workout = Workout.query.filter_by(id=workout_id).first_or_404()
        return workout.to_dict()
    
    @app.route("/workouts")
    def get_workouts():
        # include_all = request.args.get('include-all', default='false')
        # include_all = include_all.lower() == 'true'
        
        # if include_all:
        #     workouts = Workout.query.all()
        #     return {"workouts": [w.to_dict() for w in workouts]}

        active_workout = Workout.query.filter_by(is_active=True).first()
        inactive_workouts = Workout.query.filter(Workout.is_active == False).all()

        if active_workout:
            active_workout_data = active_workout.to_dict_condensed()
        else:
            active_workout_data = None


        return jsonify({
            "active_workout": active_workout_data,
            "inactive_workouts": [w.to_dict_condensed() for w in inactive_workouts]
        }), 200
    
    @app.route("/create-workout", methods=["POST"])
    def create_workout():
        data = request.get_json()

        name = data.get('name', "N/A")
        date = data.get('date', "N/A")
        target_muscles_names = data.get('target_muscles', [])
        is_active = data.get('is_active', False)

        # check if there is already a active workout if wanting to make an active
        if is_active and Workout.query.filter_by(is_active=True).count() != 0:
            return jsonify({"error": "Cannot create workout, you can only have one active workout."}), 409
        
        # find the muscle and query for it
        target_muscles  = []
        for muscle_name in target_muscles_names:
            muscle = Muscle.query.filter_by(name=muscle_name).first()
            if not muscle:
                return jsonify({"error": "Attempted to add a new muscle not in the database"}), 400
            target_muscles.append(muscle)
        workout = Workout(name, date, target_muscles, is_active)

        db.session.add(workout)
        db.session.flush()

        #wait to get the workout id
        if name == "":
            workout.name = f'Workout {workout.id}'

        db.session.commit()

        return jsonify({"success": True, "workout": workout.to_dict()}), 201
    
    def init_db():
        muscle_groups = {
            "Legs": ["Quadriceps", "Hamstrings", "Calves", "Ass", "Abductors", "Knees", "Foot"],
            "Core": ["Lower_Core", "Abs", "Lower_Back", "Obliques"],
            "Back": ["Scapula", "Upper_Back", "Traps", "Lats"],
            "Arms": ["Shoulders", "Triceps", "Biceps", "Forearms", "Hands"],
            "Chest": ["Pectorals"],
            "Head": ["Neck", "Face"]
        }

        if not MuscleGroup.query.all():
            for group_name, muscle_names in muscle_groups.items():
                group = MuscleGroup(name=group_name)
                db.session.add(group)
                db.session.flush()

                for muscle_name in muscle_names:
                    muscle = Muscle(name=muscle_name, group=group)
                    db.session.add(muscle)
            db.session.commit()
    
    db.init_app(app)
    db.create_all()
    
    init_db()

    if __name__ == "__main__":
        app.run(host="0.0.0.0", port=8080, debug=True)
