import React, {FunctionComponent} from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View, StyleSheet, Platform } from 'react-native'
import { Svg, Path } from 'react-native-svg'
const Setting: FunctionComponent = (props) => {

  const { register, setValue, handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: {
      workoutName: '',
      workoutDate: '',
    }
  });
  const onSubmit = (data:any) => {
    console.log(data);
  };

  const onChange = (arg:any) => {
    return {
      value: arg.nativeEvent.text,
    };
  };

  console.log('errors', errors);

  return (

    <View>
    </View>
  )
}

export default Setting;