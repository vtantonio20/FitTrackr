import { useMutation, useQuery } from "react-query"
import { useMemo } from "react";
import { addExerciseToWorkout, fetchWorkoutData, fetchWorkoutsData, updateExerciseOnWorkout } from "../api";
// import { useMuscleSvg } from "../hooks/useMuscleSvg";



export interface WorkoutSet {
  id:number;
  rep:number;
  weight:number;
}

export interface WorkoutExercise {
  name:string;
  id:number;
  sets:WorkoutSet[];
}

export interface Workout {
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
  }, [data]);

  const inactiveWorkouts:Workout[] = useMemo(() => {
    if (!data) return undefined;
    const inactiveWorkoutData = data.inactive_workouts;
    return inactiveWorkoutData
      ? inactiveWorkoutData.map((inactiveWorkoutData:any):Workout => ({
          name: inactiveWorkoutData.name,
          date: new Date(inactiveWorkoutData.date),
          isActive: inactiveWorkoutData.is_active,
          id: inactiveWorkoutData.id
        }))
      : [];
  }, [data]);

  return {
    activeWorkout,
    inactiveWorkouts,
    error,
    isLoading,
    refetch
  }
}

export const useWorkoutData = (workoutId:any) => {
  const { data, error, isLoading, refetch } = useQuery('workout', () => fetchWorkoutData(workoutId))  
  const workout:Workout | undefined = useMemo(() => {
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

  interface PostWorkoutSet {
    rep_num:number;
    weight:number;
    id:number | undefined;
  }
  
  interface PostWorkoutExercise {
    name:string;
    sets:PostWorkoutSet[];
    id:number | undefined;
  }
  
  // Submit Mutation Logic
  const createExerciseMutation = useMutation((data: PostWorkoutExercise) => {
    if (workoutId == null) {
      return Promise.reject("No workout ID provided");
    }
    return addExerciseToWorkout(workoutId, data)
  });

  const addNewExercise = (name:string, setsData:WorkoutSet[], onSuccess:() => void)  => {
    const newExerciseData:PostWorkoutExercise = {
      name: name,
      id: undefined,
      sets: setsData.map((setData:any):PostWorkoutSet => ({
        id: undefined,
        rep_num: setData.rep,
        weight: setData.weight
      }))
    }

    createExerciseMutation.mutate(newExerciseData, {
      onSuccess() {
        onSuccess();
        refetch();
      },
    });
  }
  

  // Submit Mutation Logic
  interface UpdateProps { data: PostWorkoutExercise, exerciseId: any }
  const updateExerciseMutation = useMutation((props: UpdateProps) => {
    if (workoutId == null) {
      return Promise.reject("No workout ID provided");
    }
    return updateExerciseOnWorkout(props.exerciseId, props.data)
  });
  
  const updateExistingExercise = (exerciseId:any, name: string, setsData:WorkoutSet[], onSuccess:() => void) => {
    const newExerciseData:PostWorkoutExercise = {
      name: name,
      id: exerciseId,
      sets: setsData.map((setData:any):PostWorkoutSet => ({
        id: setData.id,
        rep_num: setData.rep,
        weight: setData.weight
      }))
    }
    console.log(JSON.stringify(newExerciseData))

    updateExerciseMutation.mutate({exerciseId:exerciseId, data:newExerciseData}, {
      onSuccess() {
        onSuccess();
        refetch();
      },
    });
  }


  // const muscleMapSvg = useMuscleSvg(workout ? (workout.targetMusclesNames ? workout.targetMusclesNames : []) : []);

  return {
    workout,
    error,
    isLoading,
    refetch,
    addNewExercise,
    updateExistingExercise
  }
}


export const useWorkoutExerciseData = (workoutId:any, exerciseId:any) => {
}