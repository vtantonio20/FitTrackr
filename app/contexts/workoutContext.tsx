import { createContext, useContext } from 'react'

export type Set = {
  setNum: number;
  reps: string;
  weight: string;
}

export interface Exercise {
  exerciseName: string,
  sets: Set[];
}
interface WorkoutProps {
  inActiveWorkout: boolean
  workoutName: string;
  workoutDate: Date;
  targetMuscles: string[];
  exercises: Exercise[];
  setInActiveWorkout: (value:boolean) => void;
  setWorkout: (value: string) => void;
  setWorkoutDate: (value: Date) => void;  //TODO change to date
  setTargetMuscles: (values: string[]) => void;
  setExercises: (value: Exercise[]) => void;
}
export const WorkoutContext = createContext<WorkoutProps>({
  inActiveWorkout: false,
  workoutName: '',
  workoutDate: new Date(),
  targetMuscles: [],
  exercises: [],
  setInActiveWorkout: () => {},
  setWorkout: () => { },
  setWorkoutDate: () => { },
  setTargetMuscles: () => { },
  setExercises: () => { },
});

export const inActiveWorkout = createContext<{ active: boolean }>({
  active: false
})
