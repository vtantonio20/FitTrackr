from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Table
from sqlalchemy.orm import relationship

db = SQLAlchemy()

# Association table for many-to-many relationship
workout_muscle = Table('workout_muscle', db.Model.metadata,
    Column('workout_id', Integer, ForeignKey('workout.id'), primary_key=True),
    Column('muscle_id', Integer, ForeignKey('muscle.id'), primary_key=True)
)

class MuscleGroup(db.Model):
    __tablename__ = 'muscle_group'
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)

    def __init__(self, name):
        self.name=name

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
        }
    
class Muscle(db.Model):
    __tablename__ = 'muscle'
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False, unique=True)    
    group_id = Column(Integer, ForeignKey('muscle_group.id'), nullable=False)
    group = relationship('MuscleGroup', backref=db.backref('muscles', lazy=True))

    def __init__(self, name, group):
        self.name=name
        self.group = group

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "group": self.group.to_dict()
        }

class ExerciseSet(db.Model):
    __table__name = "exercise_set"
    id = Column(Integer, primary_key=True)
    rep_num = Column(Integer, nullable=False)
    weight = Column(Integer)
    exercise_id = Column(Integer, ForeignKey('exercise.id'), nullable=False)
    
    def __init__(self, rep_num, weight):
        self.rep_num = rep_num
        self.weight = weight

    def to_dict(self):
        return {
            "id": self.id, 
            "rep_num": self.rep_num, 
            "weight": self.weight
        }

class Exercise(db.Model):
    __tablename__ = 'exercise'
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    sets = relationship('ExerciseSet', backref=db.backref('parent_exercise', lazy=True))
    workout_id = Column(Integer, ForeignKey('workout.id'), nullable=False)

    def __init__(self, name):
        self.name = name

    # def add_set(self, number, weight):
    #     self.sets.append(ExerciseSet(number=number, weight=weight))

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "sets": [(s.to_dict() if s is not None else []) for s in self.sets] 
        }
        

class Workout(db.Model):
    __tablename__ = "workout"
    id = Column(Integer, primary_key=True)
    name = Column(String(80), nullable=False)
    date = Column(String(80), nullable=False)
    is_active = Column(Boolean, default=False)
    target_muscles = relationship('Muscle', secondary=workout_muscle, backref=db.backref('workouts', lazy='dynamic'))
    exercises = relationship('Exercise', backref=db.backref('parent_workout', lazy=True))

    def __init__(self, name, date, target_muscles, is_active=False, exercises=[]):
        self.name = name
        self.date = date
        self.is_active = is_active
        self.target_muscles = target_muscles or []

    def add_exercise(self, exercise):
        self.exercises.append(exercise)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "date": self.date,
            "is_active": self.is_active,
            "target_muscles": [muscle.to_dict() for muscle in self.target_muscles],
            "exercises": [e.to_dict() for e in self.exercises]
        }

    def to_dict_condensed(self):
        if self.is_active:
            return {
                "id": self.id,
                "name": self.name,
                "date": self.date,
                "is_active": self.is_active,
                "target_muscles": [muscle.name for muscle in self.target_muscles],
                "exercises": [e.to_dict() for e in self.exercises]

            }
        else:
            return {
                "id": self.id,
                "name": self.name,
                "date": self.date,
                "is_active": self.is_active,
            }
    