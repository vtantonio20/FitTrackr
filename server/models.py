class Muscle():
    def __init__(self, name):
        self.name=name
    
class Exercise():
    def __init__(self, name, muscles):
        self.name = name
        self.muscles = muscles

class Workout():
    def __init__(self, name, date, target_muscles, isActive=False):
        self.name = name
        self.date = date
        self.target_muscles = target_muscles,
        self.isActive = isActive