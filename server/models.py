from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Table, DateTime
from sqlalchemy.orm import relationship

db = SQLAlchemy()

# Association table for many-to-many relationship
workout_muscle = Table('workout_muscle', db.Model.metadata,
    Column('workout_id', Integer, ForeignKey('workout.id'), primary_key=True),
    Column('muscle_id', Integer, ForeignKey('muscle.id'), primary_key=True)
)

exercise_muscle = Table('exercise_muscle', db.Model.metadata,
    Column('exercise_id', Integer, ForeignKey('exercise.id'), primary_key=True),
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

    def to_dict(self, isJustName=False):
        if isJustName:
            return {"id": self.id, "name": self.name }
        else:
            return {"id": self.id, "name": self.name, "group": self.group.to_dict() }

class Exercise(db.Model):
    __table__name = "exercise"
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    target_muscles = relationship('Muscle', secondary=exercise_muscle, backref=db.backref('exercises', lazy='dynamic'))

    def __init__(self, name, target_muscles):
        self.name = name
        self.target_muscles = target_muscles or []

    def get_target_muscle_names(self):
        target_muscle_names = []
        for muscle in self.target_muscles:
            target_muscle_names.append(muscle.name)
        return target_muscle_names
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "target_muscles": [muscle.to_dict(isJustName=True) for muscle in self.target_muscles],
        }


# The user defomed exercise set mapped to each workout exercise
class ExerciseSet(db.Model):
    __table__name = "exercise_set"
    id = Column(Integer, primary_key=True)
    rep_num = Column(Integer, nullable=False)
    weight = Column(Integer)
    workout_exercise_id = Column(Integer, ForeignKey('workout_exercise.id'), nullable=False)
    
    def __init__(self, rep_num, weight):
        self.rep_num = rep_num
        self.weight = weight

    def to_dict(self):
        return {
            "id": self.id, 
            "rep_num": self.rep_num, 
            "weight": self.weight
        }

class WorkoutExercise(db.Model):
    __tablename__ = 'workout_exercise'
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    sets = relationship('ExerciseSet', backref=db.backref('parent_workout_exercise', lazy=True))
    workout_id = Column(Integer, ForeignKey('workout.id'), nullable=False)

    def __init__(self, name, sets=[]):
        self.name = name
        self.sets = sets

    def add_workout_set(self, exercise_set):
        self.sets.append(exercise_set)

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
    date = Column(DateTime, nullable=False)
    is_active = Column(Boolean, default=False)
    target_muscles = relationship('Muscle', secondary=workout_muscle, backref=db.backref('workouts', lazy='dynamic'))
    workout_exercises = relationship('WorkoutExercise', backref=db.backref('parent_workout', lazy=True))

    def __init__(self, name, date, target_muscles, is_active=False):
        self.name = name
        self.date = date
        self.is_active = is_active
        self.target_muscles = target_muscles or []

    def add_exercise(self, workout_exercise):
        self.workout_exercises.append(workout_exercise)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "date": self.date.isoformat() + 'Z',
            "is_active": self.is_active,
            "target_muscles": [muscle.to_dict() for muscle in self.target_muscles],
            "workout_exercises": [e.to_dict() for e in self.workout_exercises]
        }

    def to_dict_condensed(self):
        if self.is_active:
            return {
                "id": self.id,
                "name": self.name,
                "date": self.date.isoformat() + 'Z',
                "is_active": self.is_active,
                "target_muscles": [muscle.name for muscle in self.target_muscles],
                "workout_exercises": [e.to_dict() for e in self.workout_exercises]
            }
        else:
            return {
                "id": self.id,
                "name": self.name,
                "date": self.date.isoformat() + 'Z',
                "is_active": self.is_active,
            }
    