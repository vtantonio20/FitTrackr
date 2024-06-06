import { Stack, useRouter } from 'expo-router';
import React, { useContext, useEffect } from 'react'
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import colors from '../../colors';
import { WorkoutContext } from '../../contexts/workoutContext';
import styles from "../../style";
import { dateToDDMMYY, dateToWD, dateToWDDDMMYY } from '../../utilities';
import { MaterialIcons, Feather, Entypo , AntDesign, FontAwesome} from '@expo/vector-icons'; 
import { useMuscleSvg } from '../../hooks/useMuscleSvg';
import MuscleMap from '../../assets/svgs/muscleMap.svg'
import { Bubble } from '../../components/bubbleButton';
import { AddExercise, Exercise } from '../../components/exercise';
import { useSelectionModal } from '../../hooks/useSelectionModal';

const Log = () => {
  const { inActiveWorkout, workoutName, workoutDate, targetMuscles } = useContext(WorkoutContext);
  const router = useRouter();
  useEffect(() => {
    if (typeof(inActiveWorkout) === undefined || !inActiveWorkout )
      console.log('Inactive workout')  
    //router.push('/screens/tabs/_navigator')
  }, [])

  const muscleMapSvg = useMuscleSvg(targetMuscles)

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
            <Text style={[styles.h4, styles.lighterFont]}>{workoutDate && dateToDDMMYY(workoutDate)}</Text>
          </View>
          {/*<Exercise name='squats' sets='4' reps=''/>*/} 
          <AddExercise/>
          <View style={styles.widgetHeader}>
            <TouchableOpacity style={form.imageContainer}>
              <MuscleMap width={150} height={150}  {...muscleMapSvg} />
            </TouchableOpacity>
          </View>



        </View>
      </ScrollView>
    </>
  )
}


const form = StyleSheet.create({
  container: {
    paddingVertical:7,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7,
    borderColor: colors.primary,
    borderWidth: 1,
    padding:14,
  },
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
    color: colors.white,
  },
  formTextArea: {
    color: colors.lighter,
    height: 36,
    paddingHorizontal: 7,
    borderColor: colors.primary,
    borderWidth:1,
    borderRadius: 7,
  },
  widget: {
    padding:7,
    borderColor: colors.primary,
    borderWidth:1,
    borderRadius: 7,
    marginBottom:14
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