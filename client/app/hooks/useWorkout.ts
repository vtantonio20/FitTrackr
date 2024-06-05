import { useState, useEffect } from 'react';
import { useMuscleSvg } from './useMuscleSvg';

const useWorkout = (workout:any) => {
  const [workoutName, setWorkoutName] = useState(workout.workoutName);
  const [workoutDate, setWorkoutDate] = useState(workout.workoutDate);
  const [targetMuscles, setTargetMuscles] = useState(workout.targetMuscles);
  const [isActive, setIsActive] = useState(workout.isActive);

  useEffect(() => {
    if (workout) {
      const { workoutName, workoutDate, targetMuscles, isActive } = workout;
      setWorkoutName(workoutName || '');
      setWorkoutDate(workoutDate || '');
      setTargetMuscles(targetMuscles || []);
      setIsActive(isActive || false);
    }
  }, [workout]);

  return {
    workoutName, 
    workoutDate, 
    targetMuscles, 
    isActive, 
    muscleMapSvg: useMuscleSvg(targetMuscles)
  };
};

export default useWorkout;