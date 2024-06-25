import React,{ FunctionComponent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { View, Text, TextInput, TouchableOpacity, Pressable, } from 'react-native';
import { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { Svg, Path } from 'react-native-svg'
import styles from "../../style"
import { useMuscleSuggestionData } from '../../queries/SuggestionQueries';
import { useInactiveWorkoutData } from '../../queries/WorkoutQueries';



const Account: FunctionComponent = () => {
  const a = useInactiveWorkoutData();
  console.log(a.inactiveWorkouts);

  const handleTestPress = () => {
    a.changeTimeFrame(new Date(new Date().getDay() -100), new Date())
  }
  return (
    <>
      <Pressable onPress={handleTestPress}><Text>Press</Text></Pressable>
    </>


  );
}

export default Account;
