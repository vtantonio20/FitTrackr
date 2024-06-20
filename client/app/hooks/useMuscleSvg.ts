import { useMemo } from "react";
import colors from "../colors";
import { Muscle } from "../queries/SuggestionQueries";

export const useMuscleSvg = (targetMuscles:Muscle[], color?:string) => {
  const muscleSvgProps = (targetMuscles:Muscle[]) => {
    const dynamicProps: { [key: string]: string } = {};
    dynamicProps['Border'] = '#2B2B2B'
    dynamicProps['FillAll'] = colors.white
    for (const key of targetMuscles) {
      dynamicProps[key.name] = color? color : colors.red;
    }
    return dynamicProps;
  };

  const muscleMapSvg = useMemo(() => muscleSvgProps(targetMuscles), [targetMuscles]);
  return muscleMapSvg;

}