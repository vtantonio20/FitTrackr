import { createContext, useContext } from 'react'


interface WorkoutProps {
  inActiveWorkout: boolean
  workoutName: string;
  workoutDate: string;
  targetMuscles: string[];
  setInActiveWorkout: (value:boolean) => void;
  setWorkout: (value: string) => void;
  setWorkoutDate: (value: string) => void;  //TODO change to date
  setTargetMuscles: (values: string[]) => void;
}
export const WorkoutContext = createContext<WorkoutProps>({
  inActiveWorkout: false,
  workoutName: '',
  workoutDate: '',
  targetMuscles: [],
  setInActiveWorkout: () => {},
  setWorkout: () => { },
  setWorkoutDate: () => { },
  setTargetMuscles: () => {},
});

export const inActiveWorkout = createContext<{ active: boolean }>({
  active: false
})
