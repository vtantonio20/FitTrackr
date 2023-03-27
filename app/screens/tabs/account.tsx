/*import React,{ FunctionComponent } from 'react';
import { useForm } from 'react-hook-form';
import { View, Text, TextInput, } from 'react-native';
import { Svg, Path } from 'react-native-svg'


const Account: FunctionComponent = () => {

  return (
    <>

    </>


  );
}

export default Account;

*/
import React, { FunctionComponent, useState, useContext, useEffect } from 'react'
import { Stack, useNavigation, useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, TextInput, FlatList, StyleSheet, ScrollView, TextStyle, StyleProp } from 'react-native';
import colors from '../../colors';
import styles from "../../style";
import { MUSCLES } from '../../utilities';
import { WorkoutContext } from '../../contexts/workoutContext';
import { Bubble } from '../../components/bubbleButton';
import { DatePicker } from '../../components/datePicker';
import { Controller, useForm } from 'react-hook-form';


export const Workout: FunctionComponent = () => {
  const navigation = useNavigation();
  const { setInActiveWorkout, setWorkout, setWorkoutDate, setTargetMuscles } = useContext(WorkoutContext);

  const [inputDate, setInputDate] = useState<Date>();
  useEffect(() => {
    console.log(inputDate)
  }, [inputDate])



  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      workoutName: '',
      date: new Date(),
      targetMuscles: ''
    }
  });
  const onSubmitForm = (data: any) => console.log(data);
  

  const onSubmit = (data: any) => {
    console.log(data);

  }

  return (
    <>
      <Stack.Screen
        options={{
          headerBackVisible: true,
          title: 'New Workout'
        }}
      />

      <ScrollView style={[styles.modalContainer]}>
        <View style={styles.containerWrapper}>
          <View style={styles.widgetHeader}>
            <Text style={styles.h3}>Set Details</Text>
          </View>
          
          <View style={form.element}>
            <Text style={form.elementHeader}>Workout Name: </Text>
            {errors.workoutName && <Text style={[styles.p, {color:colors.red}]}>This is required.</Text>}

            <Controller
              control={control}
              rules={{required:true}}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={form.formTextArea}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="workoutName"
            />
          </View>


          <View style={form.element}>
            <Text style={form.elementHeader}>Workout Date: </Text>
            <DatePicker parentDate={setInputDate} editable={true}  />


          </View>
          
          <View style={form.element}>
            <Text style={form.elementHeader}>Target Muscles: <Text style={styles.p}>(optional)</Text></Text>
            <TextInput
              style={form.formTextArea}
              
            />
            <FlatList 
              horizontal={true}
              data={MUSCLES}
              renderItem={({ item }) => <Bubble textStyle={styles.p} name={item.name} />}
              keyExtractor={item => item.id}
            />          
          </View>


          
          {/*Submit Button */}
          <TouchableOpacity style={form.submitContainer} onPress={handleSubmit(onSubmitForm)}>
            <Text style={[styles.h3, {lineHeight:28}]}>Start Logging</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

    </>
  )
}
const form = StyleSheet.create({
  submitContainer: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 50,
    paddingVertical: 14,
  },
  element: {
    paddingBottom:7
  },
  elementHeader: {
    ...styles.h4,
    paddingBottom: 7,
    color: colors.white
  },
  formTextArea: {
    color: colors.lighter,
    height: 36,
    paddingHorizontal: 7,
    borderColor: colors.primary,
    borderWidth:1,
    borderRadius: 7,
  },
})
export default Workout;