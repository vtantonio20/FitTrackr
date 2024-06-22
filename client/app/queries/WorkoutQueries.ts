import { useMutation, useQuery, useQueryClient } from "react-query"
import { useMemo } from "react";
import { doCreateExercise, doCreateWorkout, doDeleteExercise, doDeleteWorkout, doFetchWorkout, doFetchWorkouts, doUpdateExercise } from "../api";
import { Muscle } from "./SuggestionQueries";
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
  targetMuscles?: Muscle[]
  exercises?: WorkoutExercise[]
}

interface PostWorkout {
  name: string;
  date: Date;
  isActive: boolean;
  id?: number;
  targetMuscles?: Muscle[]
  exercises?: WorkoutExercise[]
}

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

export const useWorkoutsData = () => {
  const { data, error, isLoading, refetch } = useQuery('workouts', doFetchWorkouts)

  const activeWorkout:Workout | undefined = useMemo(() => {
    if (!data) return undefined;
    const activeWorkoutData = data.active_workout;
    if (activeWorkoutData === null) return undefined;
    return {
      name: activeWorkoutData.name,
      date: new Date(activeWorkoutData.date),
      isActive: activeWorkoutData.is_active,
      id: activeWorkoutData.id,
      targetMuscles: activeWorkoutData.target_muscles.map((muscle: Muscle) => muscle),
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
  const queryClient = useQueryClient();

  const { data, error, isLoading, refetch } = useQuery('workout', () => doFetchWorkout(workoutId))  
  const workout:Workout | undefined = useMemo(() => {
    if (!data) return undefined;
    return {
      name: data.name,
      date: new Date(data.date),  
      isActive: data.is_active,
      id: data.id,
      targetMuscles: data.target_muscles.map((muscle: Muscle) => muscle),
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
  
  // Create Workout
  const createWorkoutMutation = useMutation((data:PostWorkout) => {
    return doCreateWorkout(data);
  })

  // Create Workout Exercise
  const createExerciseMutation = useMutation((data: PostWorkoutExercise) => {
    if (workoutId == null) {
      return Promise.reject("No workout ID provided");
    }
    return doCreateExercise(workoutId, data)
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
  
  // Update Workout Exercise
  const updateExerciseMutation = useMutation((data: PostWorkoutExercise) => {
    if (workoutId == null) {
      return Promise.reject("No workout ID provided");
    }
    return doUpdateExercise(data.id, data)
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

    updateExerciseMutation.mutate(newExerciseData, {
      onSuccess() {
        onSuccess();
        refetch();
      },
    });
  }

  const deleteExerciseMutation = useMutation((exerciseId: any) => {
    if (workoutId == null) {
      return Promise.reject("No workout ID provided");
    }
    return doDeleteExercise(exerciseId)
  });

  const deleteExercise = (exerciseId:any, onSuccess:() => void) => {
    deleteExerciseMutation.mutate(exerciseId, {
      onSuccess() {
        onSuccess();
        refetch();
      },
    })
  }
  
  const deleteWorkoutMutation = useMutation((workoutId:any) => {
    if (workoutId == null) {
      return Promise.reject("No workout ID provided");
    }
    return doDeleteWorkout(workoutId)
  });

  const deleteWorkout = (onSuccess:() => void) => {
      deleteWorkoutMutation.mutate(workoutId, {
        onSuccess(){
          queryClient.invalidateQueries('workouts');
          onSuccess();
        }
      })
  }

  return {
    workout,
    error,
    isLoading,
    addNewExercise,
    updateExistingExercise,
    deleteExercise,
    deleteWorkout
  }
}