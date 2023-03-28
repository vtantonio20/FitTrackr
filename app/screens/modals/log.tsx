import { Stack, useRouter } from 'expo-router';
import React, { useContext } from 'react'
import { ScrollView, View, Text, StyleSheet} from 'react-native';
import colors from '../../colors';
import { WorkoutContext } from '../../contexts/workoutContext';
import styles from "../../style";
import { dateToDDMMYY, dateToWD, dateToWDDDMMYY } from '../../utilities';
const Log = () => {
  const router = useRouter();
  const { inActiveWorkout, workoutName, workoutDate, targetMuscles } = useContext(WorkoutContext);
  
//  if (!inActiveWorkout)
//    router.back();
  return (
    <>
      <Stack.Screen
        options={{
          headerBackVisible: true,
          title: workoutName
        }}
      />
      <ScrollView style={[styles.modalContainer]}>
        <View style={styles.containerWrapper}>
          <View style={styles.widgetHeader}>
            <Text style={styles.h3}>{workoutDate && dateToWD(workoutDate)}'s Session</Text>
            <Text style={styles.p}>{workoutDate && dateToDDMMYY(workoutDate)}</Text>
          </View>
          <View style={form.element}>
            
          </View>


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
  suggestion: {
    backgroundColor: colors.primary,
    borderRadius: 7,
    paddingHorizontal: 7,
    margin: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  }
})
export default Log;