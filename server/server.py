from flask import Flask, request, jsonify
from flask_cors import CORS

from models import Muscle, Exercise, Workout

app = Flask(__name__)
CORS(app)

workouts = []
with app.app_context():

    @app.route("/")
    def get_workouts():
        return jsonify([{
            'name': w.name,
            'date': w.date,
            'targetMuscles': [{'targetMuscle': t} for t in w.target_muscles],
            'isActive': w.isActive
       } for w in workouts])
    
    @app.route("/create-workout", methods=["POST"])
    def create_workout():
        data = request.get_json()

        name = data.get('name', "N/A")
        date = data.get('date', "")
        target_muscles = data.get('targetMuscles', [])
        isActive = data.get('isActiveWorkout', False)
        workout = Workout(name, date, target_muscles, isActive)
        workouts.append(workout)
        return {"success": "Workout created successfully"}
    
    if __name__ == "__main__":
        app.run(host="0.0.0.0", port=8080, debug=True)
