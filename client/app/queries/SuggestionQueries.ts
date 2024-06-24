import { useQuery } from "react-query";
import { doFetchExerciseSuggestions, doFetchMuscleMap } from "../api";
import { useMemo, useState } from "react";

export interface MuscleGroup {
  id: number;
  name: string;
  muscles: Muscle[];
}
export interface Muscle {
  id: number;
  name: string;
}

export interface Exercise {
  id: number;
  name: string;
  targetMuscles?: Muscle[];
}

export const useMuscleSuggestionData = () => {
  const { data, error, isLoading } = useQuery('muscles', doFetchMuscleMap);

  // A map of muscle group names to list of muscles per group name
  const muscleGroups:MuscleGroup[] | undefined = useMemo(() => {
    if (!data) return undefined;
    return data.map((muscleGroup:MuscleGroup):MuscleGroup => {
      return {
        name: muscleGroup.name,
        id: muscleGroup.id,
        muscles: muscleGroup.muscles
      }
    })
  }, [data]);
  
  return {
    muscleGroups,
    error,
    isLoading
  }
}

export const useExerciseSuggestionsFromMuscle = (muscleIn:Muscle) => {
  const [muscle, setMuscle] = useState(muscleIn);
  const { data, error, isLoading, refetch } = useQuery(
    ['exercise', muscle.id], 
    () => doFetchExerciseSuggestions(muscle.id),
    {enabled: !!muscle.id}
  );
  
  const exerciseData:Exercise[] | undefined = useMemo(() => {
    if (!data) return undefined;
    return data.map((exercise:Exercise):Exercise => {
      return {
        name:exercise.name,
        id:exercise.id
      }
    })
  }, [data])
  
  const changeMuscle  = (newMuscle: Muscle) => {
    setMuscle(newMuscle);
    refetch();
  };
  

  return {
    exerciseData,
    error,
    isLoading,
    muscle,
    changeMuscle
  }
}