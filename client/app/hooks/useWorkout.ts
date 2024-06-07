// import { useState, useEffect, useCallback } from 'react';
// import { useMuscleSvg } from './useMuscleSvg';

// const useWorkout = (initialWorkout:any = {}) => {
//   const [workout, setWorkout] = useState(initialWorkout);
//   const [workoutName, setWorkoutName] = useState(workout.workoutName);
//   const [workoutDate, setWorkoutDate] = useState(workout.workoutDate);
//   const [targetMuscles, setTargetMuscles] = useState(workout.targetMuscles);
//   const [isActive, setIsActive] = useState(workout.isActive);
//   const id = workout.id;
//   useEffect(() => {
//     console.log(JSON.stringify(workout))
//     if (workout) {
//       const { workoutName, workoutDate, targetMuscles, isActive } = workout;
//       setWorkoutName(workoutName || '');
//       setWorkoutDate(workoutDate || '');
//       setTargetMuscles(targetMuscles || []);
//       setIsActive(isActive || false);
//     }
//   }, [workout]);
  
//   const updateWorkout = useCallback((newWorkout: any) => {
//     setWorkout(newWorkout);
//   }, []);
  
//   return {
//     workoutName, 
//     workoutDate, 
//     targetMuscles, 
//     isActive, 
//     muscleMapSvg: useMuscleSvg(targetMuscles),
//     id,
//     updateWorkout
//   };
// };

// export default useWorkout;

import { useState, useEffect } from 'react';
import { useMuscleSvg } from './useMuscleSvg';

const useWorkout = (workout:any) => {
  const [workoutName, setWorkoutName] = useState(workout.workoutName);
  const [workoutDate, setWorkoutDate] = useState(workout.workoutDate);
  const [targetMuscles, setTargetMuscles] = useState(workout.targetMuscles);
  const [isActive, setIsActive] = useState(workout.isActive);
  const id = workout.id;

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
    muscleMapSvg: useMuscleSvg(targetMuscles),
    id,
  };
};

export default useWorkout;