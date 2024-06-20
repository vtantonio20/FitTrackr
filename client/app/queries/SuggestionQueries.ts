import { useQuery } from "react-query";
import { fetchExerciseData, fetchExerciseSuggestionsFromMuscle, fetchMuscleMapData } from "../api";
import { useMemo, useState } from "react";
import { err } from "react-native-svg";

export interface MuscleGroup {
  id: number;
  name: string;
}
export interface Muscle {
  id: number;
  name: string;
  group?: MuscleGroup;
}
export interface Exercise {
  id: number;
  name: string;
  targetMuscles?: Muscle[];
}

export const useMuscleSuggestionData = () => {
  const { data, error, isLoading } = useQuery('muscles', fetchMuscleMapData);

  const buildMuscleMapFromJson = (jsonData: any) => {
    if (!jsonData) return {}

    const musclesData = jsonData.muscles;
    const map: Record<string, string[]> = {};
    
    if (!musclesData) {
      return map;
    }
    
    musclesData.forEach((m: Muscle) => {
      const groupName = m.group ? m.group.name : 'None';
      const muscleName = m.name;

      // If the group name does not exist, create it and add muscle name to group
      if (!map[groupName]) {
        map[groupName] = [];
      }
      map[groupName].push(muscleName);

    });

    return map;
  };

  // A map of muscle group names to list of muscles per group name
  const muscleMap = useMemo(() => buildMuscleMapFromJson(data), [data]);
  
  return {
    muscleMap,
    error,
    isLoading
  }
}

export const useExerciseSuggestionsFromMuscle = (muscleIn:Muscle) => {
  const [muscle, setMuscle] = useState(muscleIn);
  const { data, error, isLoading, refetch } = useQuery(
    ['exercise', muscle.id], 
    () => fetchExerciseSuggestionsFromMuscle(muscle.id),
    {enabled: !!muscle.id}
  );
  
  const exerciseData:Exercise[] | undefined = useMemo(() => {
    if (!data) return undefined;
    return data.map((exercise:Exercise) => {
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

// export const useExerciseSuggestionDataFromMuscle = () => {
//   const [selectedTargetMuscleName, setSelectedTargetMuscleName] = useState();

// }
// export const useExerciseSuggestionData = (workoutTargetMuscles:string[]) => {
//   const { data, error, isLoading } = useQuery(['exercises', workoutTargetMuscles], () => fetchExerciseData(workoutTargetMuscles));
  
//   const buildExerciseMapFromJson = (jsonData: any) => {
//     const map: Record<string, string[]> = {};
//     if (!jsonData) return map;
  
//     return;
//     jsonData.forEach((muscleToExercise:any) => {
//       const muscleName = muscleToExercise.name;
//       // If the muslce name does not exist, create it and add muscle name to map
//       if (!map[muscleName]) {
//         map[muscleName] = [];
//       }

//       muscleToExercise.exercises.forEach((exercise:any) => {
//         map[muscleName].push(exercise.name)
//       })
//     })
//     return map;
//   }

//   const exerciseMap = useMemo(() => buildExerciseMapFromJson(data), [data])

//   return {
//     exerciseMap,
//     error,
//     isLoading
//   }
// }

