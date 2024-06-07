import { useEffect, useState } from "react";
import colors from "../colors";

export const useMuscleSvg = (targetMuscles:string[]) => {
  const [muscleMapSvg, setMuscleMapSvg] = useState({});

  const muscleSvgProps = (targetMuscles:string[]) => {
    const dynamicProps: { [key: string]: string } = {};
    dynamicProps['Border'] = '#2B2B2B'
    dynamicProps['FillAll'] = colors.white
    for (const key of targetMuscles) {
      dynamicProps[key] = colors.red;
    }
    return dynamicProps;
  };
  useEffect(() => {
    if (targetMuscles) {
      const temp = muscleSvgProps(targetMuscles);
      setMuscleMapSvg(temp);
    }
  }, [targetMuscles])
  return muscleMapSvg;

}