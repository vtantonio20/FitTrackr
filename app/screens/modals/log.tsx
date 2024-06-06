import { Stack, useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react'
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, FlatList, Touchable} from 'react-native';
import colors from '../../colors';
import { WorkoutContext } from '../../contexts/workoutContext';
import styles from "../../style";
import { dateToDDMMYY, dateToWD, dateToWDDDMMYY } from '../../utilities';
import { MaterialIcons, Feather, Entypo , AntDesign, FontAwesome,Ionicons, MaterialCommunityIcons} from '@expo/vector-icons'; 
import { useMuscleSvg } from '../../hooks/useMuscleSvg';
import MuscleMap from '../../assets/svgs/muscleMap.svg'
import { Bubble } from '../../components/bubbleButton';
import { useModal } from '../../hooks/useModal';
import { Swipeable } from 'react-native-gesture-handler';

const Log = () => {
  const { inActiveWorkout, workoutName, workoutDate, targetMuscles, exercises } = useContext(WorkoutContext);
  const router = useRouter();

  const handleNewExercisePress = () => {
    router.push('/screens/modals/exercise')
  }
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

          {exercises != undefined && 
            <>
            {
              exercises.map((e, index) => {
                return (
                  <>
                    <View style={[styles.widgetHeader, {marginTop:0, marginBottom:3.5}]}>
                      <Text style={styles.h4}>Exercise {index + 1}:</Text>
                    </View>      
                    <Swipeable>

                    <TouchableOpacity style={{flexDirection:'row', backgroundColor:colors.primary, padding:14, marginBottom:14, borderRadius:7, justifyContent:'space-between', alignItems:'center'}}>
                      <MaterialCommunityIcons name="weight-lifter" size={24} color={colors.yellow} />
                      <Text style={styles.h3a}>{e.exerciseName}</Text>
                      <View >
                        {
                          e.sets.map((s, index) => {
                            return (
                              <View style={{alignSelf:'flex-end'}}>
                                <Text style={styles.p}>{s.reps} X {s.weight}Ibs</Text>
                              </View>
                            )
                          })
                        }
                      </View>
                      </TouchableOpacity>
                      </Swipeable>
                  </>
                )
              })
            }
            </>
          }

          <TouchableOpacity style={styles.widgetBody} onPress={handleNewExercisePress}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 14, }}>
              <Text style={[styles.h4, { lineHeight: 28 }]}>Add Exercise</Text>
              <AntDesign name="plus" size={28} color={colors.yellow} />
            </View> 
          </TouchableOpacity>

        </View>
      </ScrollView>
      <View style={{ position: "absolute", bottom: 50, backgroundColor:colors.primary,padding:14, borderRadius:100, alignSelf:'center' }}>
        <Text style={styles.h3}>End Workout</Text>
      </View>
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