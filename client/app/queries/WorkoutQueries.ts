import { useMutation, useQuery, useQueryClient } from "react-query"
import { useMemo, useState } from "react";
import { doCreateExercise, doCreateWorkout, doDeleteExercise, doDeleteWorkout, doFetchActiveWorkout, doFetchWorkout, doFetchWorkouts, doUpdateExercise, doUpdateWorkout } from "../api";
import { Muscle } from "./SuggestionQueries";

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
  uid: string;
  targetMuscles?: Muscle[]
  exercises?: WorkoutExercise[]
}

interface PostWorkout {
  name: string;
  date: Date;
  is_active: boolean;
  id?: number;
  uid: string;
  target_muscle_ids?: string[]
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

export const useActiveWorkoutData = (uid:string) => {
  const queryClient = useQueryClient();
  const { data, error, isLoading, refetch } = useQuery(
    ['active-workout', uid],
    () => {
      if (uid) {
        return doFetchActiveWorkout(uid);
      } else {
        return Promise.resolve(null);
      }
    },
    { enabled: !!uid }
  );

  const activeWorkout:Workout | undefined = useMemo(() => {
    if (!data) return undefined;
    return {
      name: data.name,
      date: new Date(data.date),
      isActive: data.is_active,
      id: data.id,
      targetMuscles: data.target_muscles.map((muscle: Muscle) => muscle),
      uid:data.uid
    };
  }, [data]);

  const deleteActiveWorkoutMutation = useMutation((activeWorkout:Workout | undefined) => {
    if (activeWorkout === undefined) {
      return Promise.reject("No workout ID provided");
    }
    return doDeleteWorkout(activeWorkout.id)
  });

  const deleteActiveWorkout = () => {
    deleteActiveWorkoutMutation.mutate((activeWorkout), {
      onSuccess(){
        queryClient.invalidateQueries('workout');
        refetch();
      }
    })
  }
  return {
    activeWorkout,
    error,
    isLoading,
    refetch,
    deleteActiveWorkout
  }
}

export const useWorkoutsData = (uid:string, startDateIn?:Date, endDateIn?:Date) => {
  const [startDate, setStartDate] = useState(startDateIn)
  const [endDate, setEndDate] = useState(endDateIn)

  const { data, error, isLoading, refetch } = useQuery(
    ['workouts', uid, startDate, endDate ],
    () => {
      if (uid) {
        return doFetchWorkouts(uid, startDate, endDate);
      } else{
        return Promise.resolve(null);
      }
    },
    { enabled: !!uid }
  )

  const workouts:Workout[] = useMemo(() => {
    if (!data) return undefined;
    return data.map((workoutData:any):Workout => ({
      name: workoutData.name,
      date: new Date(workoutData.date),
      isActive: workoutData.is_active,
      id: workoutData.id,
      uid:workoutData.uid
    }))
  }, [data]);

  const changeTimeFrame = (startDateIn:Date, endDateIn:Date) => {
    setStartDate(startDateIn);
    setEndDate(endDateIn);
    refetch();
  }

  return {
    workouts,
    error,
    isLoading,
    refetch,
    changeTimeFrame
  }
}

export const useWorkoutData = (workoutId:any) => {
  const queryClient = useQueryClient();
  
  const { data, error, isLoading, refetch } = useQuery(
    ['workout', workoutId],
    () => {
      if (workoutId) {
        return doFetchWorkout(workoutId);
      } else {
        return Promise.resolve(null);  
      }
    },
    // Ensures the query is only ran whenever workoutId is passed in
    { enabled: !!workoutId }
  );

  // Workout GET request data
  const workout:Workout | undefined = useMemo(() => {
    if (!data) return undefined;
    return {
      name: data.name,
      date: new Date(data.date),  
      isActive: data.is_active,
      id: data.id,
      uid: data.uid,
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
    if (workoutId !== undefined) {
      return Promise.reject("Cannot create while using another workout");
    }
    return doCreateWorkout(data);
  })

  const createWorkout = ((name:string, date:Date, isActive:boolean, targetMuscleIds:string[], uid:string, onSuccess:(msg?:string) => void) => {
    const newWorkout:PostWorkout = {
      name:name,
      date:date,
      is_active:isActive,
      target_muscle_ids:targetMuscleIds,
      uid:uid
    }

    createWorkoutMutation.mutate(newWorkout, {
      onSuccess(data) {
        if (data["invalid"] === "Active Found") {
          onSuccess("Cannot create workout, you can only have one active workout.");
          return;
        }
        queryClient.invalidateQueries('active-workout');
        queryClient.invalidateQueries('workouts');
        onSuccess();
        refetch();
      }
    });
  })

  // Update Workout
  const updateWorkoutMutation = useMutation((data:PostWorkout | any) => {
    if (workoutId === undefined) {
      return Promise.reject("No workout ID provided");
    }
    return doUpdateWorkout(workoutId, data);
  })

  const toggleActivation = (onSuccess:(msg?:string) => void) => {
    if (!workout) return undefined;

    const newWorkout = {
      is_active:!workout.isActive,
    }
    updateWorkoutMutation.mutate(newWorkout, {
      onSuccess(data) {
        if (data["invalid"] === "Active Found") {
          onSuccess("Cannot create workout, you can only have one active workout.");
          return;
        }
        queryClient.invalidateQueries('active-workout');
        queryClient.invalidateQueries('workouts');
        onSuccess();
        refetch();
      }
    })
  }

  const updateWorkout = ((name:string, date:Date, isActive:boolean, targetMuscleIds:string[], uid:string, onSuccess:(msg?:string) => void) => {
    const updatedWorkout:PostWorkout = {
      name:name,
      date:date,
      is_active:isActive,
      target_muscle_ids:targetMuscleIds,
      uid:uid
    }
    
    updateWorkoutMutation.mutate(updatedWorkout, {
      onSuccess(data) {
        if (data["invalid"] === "Active Found") {
          onSuccess("Cannot create workout, you can only have one active workout.");
          return;
        }
        queryClient.invalidateQueries('active-workout');
        queryClient.invalidateQueries('workouts');
        onSuccess();
        refetch();
      }
    });
  })
  
  const deleteWorkoutMutation = useMutation((workoutId:any) => {
    if (workoutId === undefined) {
      return Promise.reject("No workout ID provided");
    }
    return doDeleteWorkout(workoutId)
  });

  const deleteWorkout = (onSuccess:() => void) => {
      deleteWorkoutMutation.mutate(workoutId, {
        onSuccess(){
          queryClient.invalidateQueries('active-workout');
          queryClient.invalidateQueries('workouts');
          onSuccess();
        }
      })
  }

  // EXERCISE CRUD OPERATIONS
  // Create Workout Exercise
  const createExerciseMutation = useMutation((data: PostWorkoutExercise) => {
    if (workoutId === undefined) {
      return Promise.reject("No workout ID provided");
    }
    return doCreateExercise(workoutId, data)
  });

  const createExercise = (name:string, setsData:WorkoutSet[], onSuccess:() => void)  => {
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
    if (workoutId === undefined) {
      return Promise.reject("No workout ID provided");
    }
    return doUpdateExercise(data.id, data)
  });
  
  const updateExercise = (exerciseId:any, name: string, setsData:WorkoutSet[], onSuccess:() => void) => {
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
    if (workoutId === undefined) {
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

  return {
    workout,
    error,
    isLoading,
    createWorkout,
    updateWorkout,
    toggleActivation,
    deleteWorkout,
    createExercise,
    updateExercise,
    deleteExercise
  }
}


// export const useWorkoutsData = () => {
//   const queryClient = useQueryClient();

//   const { data, error, isLoading, refetch } = useQuery('workouts', doFetchWorkouts)

//   const activeWorkout:Workout | undefined = useMemo(() => {
//     if (!data) return undefined;
//     const activeWorkoutData = data.active_workout;
//     if (activeWorkoutData === null) return undefined;
//     return {
//       name: activeWorkoutData.name,
//       date: new Date(activeWorkoutData.date),
//       isActive: activeWorkoutData.is_active,
//       id: activeWorkoutData.id,
//       targetMuscles: activeWorkoutData.target_muscles.map((muscle: Muscle) => muscle),
//     };
//   }, [data]);

//   const inactiveWorkouts:Workout[] = useMemo(() => {
//     if (!data) return undefined;
//     const inactiveWorkoutData = data.inactive_workouts;
//     return inactiveWorkoutData
//       ? inactiveWorkoutData.map((inactiveWorkoutData:any):Workout => ({
//           name: inactiveWorkoutData.name,
//           date: new Date(inactiveWorkoutData.date),
//           isActive: inactiveWorkoutData.is_active,
//           id: inactiveWorkoutData.id
//         }))
//       : [];
//   }, [data]);

//   const deleteActiveWorkoutMutation = useMutation((activeWorkout:Workout | undefined) => {
//     if (activeWorkout === undefined) {
//       return Promise.reject("No workout ID provided");
//     }
//     return doDeleteWorkout(activeWorkout.id)
//   });

//   const deleteActiveWorkout = () => {
//     deleteActiveWorkoutMutation.mutate((activeWorkout), {
//       onSuccess(){
//         queryClient.invalidateQueries('workout');
//         refetch();
//       }
//     })
//   }


//   return {
//     activeWorkout,
//     inactiveWorkouts,
//     error,
//     isLoading,
//     refetch,
//     deleteActiveWorkout
//   }
// }