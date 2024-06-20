import { Muscle } from "./SuggestionQueries";

export const convertMusclesToMuscleNames = (muscles:Muscle[]) => {
  const muscleNames = muscles.map((muscle:Muscle) => muscle.name)
  return muscleNames;
}