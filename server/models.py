from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship

db = SQLAlchemy()

# Association db.table for many-to-many relationship
workout_muscle = db.Table('workout_muscle', db.Model.metadata,
    db.Column('workout_id', db.Integer, db.ForeignKey('workout.id'), primary_key=True),
    db.Column('muscle_id', db.Integer, db.ForeignKey('muscle.id'), primary_key=True)
)

class Muscle(db.Model):
    __tablename__ = 'muscle'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    def __init__(self, name):
        self.name=name

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name
        }

class Workout(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    date = db.Column(db.String(80), nullable=False)
    is_active = db.Column(db.Boolean, default=False)
    target_muscles = relationship('Muscle', secondary=workout_muscle, backref=db.backref('workouts', lazy='dynamic'))

    def __init__(self, name, date, target_muscles, is_active=False):
        self.name = name
        self.date = date
        self.is_active = is_active
        self.target_muscles = target_muscles or []

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "date": self.date,
            "is_active": self.is_active,
            "target_muscles": [muscle.to_dict() for muscle in self.target_muscles]
        }
