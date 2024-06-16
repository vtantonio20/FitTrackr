import { useQuery } from "react-query"
import { useMemo } from "react";
import { fetchWorkoutData, fetchWorkoutsData } from "../api";
import { useMuscleSvg } from "../hooks/useMuscleSvg";

interface WorkoutSet {
  id:number;
  rep:number;
  weight:number;
}

interface WorkoutExercise {
  name:string;
  id:number;
  sets:WorkoutSet[];
}

interface Workout {
  name: string;
  date: Date;
  isActive: boolean;
  id: number;
  targetMusclesNames?: string[]
  exercises?: WorkoutExercise[]
}

export const useWorkoutsData = () => {
  const { data, error, isLoading, refetch } = useQuery('workouts', fetchWorkoutsData)

  const activeWorkout:Workout | undefined = useMemo(() => {
    if (!data) return undefined;
    const activeWorkoutData = data.active_workout;
    return {
      name: activeWorkoutData.name,
      date: new Date(activeWorkoutData.date),
      isActive: activeWorkoutData.is_active,
      id: activeWorkoutData.id,
      targetMusclesNames: activeWorkoutData.target_muscles.map((muscle: string) => muscle),
    };
  }, [data.active_workout]);

  const activeMuscleMapSvg = useMuscleSvg(activeWorkout?.targetMusclesNames || []);

  const inactiveWorkouts:Workout[] = useMemo(() => {
    if (!data) return undefined;
    const inactiveWorkoutData = data.inactive_workouts;
    return inactiveWorkoutData.inactiveWorkouts
      ? inactiveWorkoutData.inactiveWorkouts.map((inactiveWorkoutData:any):Workout => ({
          name: inactiveWorkoutData.name,
          date: new Date(inactiveWorkoutData.date),
          isActive: inactiveWorkoutData.is_active,
          id: inactiveWorkoutData.id
        }))
      : [];
  }, [data.inactive_workouts]);


  return {
    activeWorkout,
    activeMuscleMapSvg,
    inactiveWorkouts,
    error,
    isLoading,
    refetch
  }
}

export const useWorkoutData = (workoutId:any) => {
  const { data, error, isLoading, refetch } = useQuery('workout', () => fetchWorkoutData(workoutId))  
  const workoutData:Workout | undefined = useMemo(() => {
    if (!data) return undefined;
    return {
      name: data.name,
      date: new Date(data.date),  
      isActive: data.is_active,
      id: data.id,
      targetMusclesNames: data.target_muscles.map((muscle: string) => muscle),
      exercises: data.workout_exercises.map((exercise: any):WorkoutExercise => ({
        id: exercise.id,
        name: exercise.name,
        sets: exercise.sets.map((s: any):WorkoutSet => ({
          id: s.id,
          rep: s.rep_num,
          weight: s.weight
        }))
      }))      
    };
  }, [data]);
  return {
    workoutData,
    error,
    isLoading,
    refetch
  }
}

