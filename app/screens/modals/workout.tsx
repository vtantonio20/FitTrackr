import React, { FunctionComponent, useState, useContext } from 'react'
import { Stack, useNavigation, useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, TextInput, FlatList, StyleSheet, ScrollView, TextStyle, StyleProp } from 'react-native';
import colors from '../../colors';
import styles from "../../style";
import { MUSCLES } from '../../utilities';
import { WorkoutContext } from '../../contexts/workoutContext';
import { Bubble } from '../../components/bubbleButton';
import { DatePicker } from '../../components/datePicker';


export const Workout: FunctionComponent = () => {
  const navigation = useNavigation();
  const { setInActiveWorkout, setWorkout, setWorkoutDate, setTargetMuscles } = useContext(WorkoutContext);

  const onSubmit = () => {
    setInActiveWorkout(true);
    setWorkoutDate('03/24/23');
    setTargetMuscles(['biceps', 'triceps']);
    setWorkout('new workout');
    navigation.goBack()
  };
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
            <TextInput style={form.formTextArea}/>
          </View>


          <View style={form.element}>
            <Text style={form.elementHeader}>Workout Date: </Text>
            <DatePicker editable={true} />
          </View>
          
          <View style={form.element}>
            <Text style={form.elementHeader}>Target Muscles: <Text style={styles.p}>(optional)</Text></Text>
            <TextInput style={form.formTextArea}/>
            <FlatList 
              horizontal={true}
              data={MUSCLES}
              renderItem={({ item }) => <Bubble textStyle={styles.p} name={item.name} />}
              keyExtractor={item => item.id}
            />          
          </View>


          
          {/*Submit Button */}
          <TouchableOpacity style={form.submitContainer} onPress={()=> onSubmit()}>
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