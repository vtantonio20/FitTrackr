from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Muscle, Workout

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'

CORS(app)

with app.app_context():
    db.init_app(app)
    db.create_all()


    @app.route("/workouts")
    def get_workouts():
        include_all = request.args.get('include-all', default='false')
        include_all = include_all.lower() == 'true'
        
        if include_all:
            workouts = Workout.query.all()
            return {"workouts": [w.to_dict() for w in workouts]}

        active_workout = Workout.query.filter_by(is_active=True).first()
        inactive_workouts = Workout.query.filter(Workout.is_active == False).all()

        if active_workout:
            active_workout_data = active_workout.to_dict()
        else:
            active_workout_data = None


        response_data ={
            "active_workout": active_workout_data,
            "inactive_workouts": [w.to_dict() for w in inactive_workouts]
        }
        return response_data
    
    @app.route("/create-workout", methods=["POST"])
    def create_workout():
        data = request.get_json()

        name = data.get('name', "N/A")
        date = data.get('date', "N/A")
        target_muscles_names = data.get('target_muscles', [])
        is_active = data.get('is_active', False)

        # find the muscle and query for it
        target_muscles  = []
        for muscle_name in target_muscles_names:
            muscle = Muscle.query.filter_by(name=muscle_name).first()
            if not muscle:
                muscle = Muscle(name=muscle_name)
                db.session.add(muscle)
            target_muscles.append(muscle)
        
        print(target_muscles)
        workout = Workout(name, date, target_muscles, is_active)
        
        db.session.add(workout)
        db.session.commit()

        return {"success": True, "workout": workout.to_dict()}
    
    if __name__ == "__main__":
        app.run(host="0.0.0.0", port=8080, debug=True)
