import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import colors from '../../colors';
import styles from "../../style";
import { dateToDDMMYY, dateToWD } from '../../utilities';
import { MaterialIcons, EvilIcons , Entypo , AntDesign, MaterialCommunityIcons} from '@expo/vector-icons'; 
import { useCallback, useEffect, useMemo } from 'react';
import { WorkoutIcon } from '../../_layout';
import { WorkoutExercise, WorkoutSet, useWorkoutData } from '../../queries/WorkoutQueries';

const Log = () => {
  const router = useRouter();
  const { workoutId, refresh } =  useLocalSearchParams();
  const workoutData = useWorkoutData(workoutId);
  const workout = workoutData.workout;
    
  // Triggers a refresh if localsearchparam says to refresh
  useEffect(() => {
    if (workoutId && refresh === "true"){
      workoutData.refetch()
      router.setParams({id:workoutId[0], refresh:"false"})
    }
  }, [refresh])
  
  const handleNewExercisePress = () => {
    router.push({pathname:'/screens/modals/Exercise', params:{workoutId:workoutId}})
  }

  const handleExercisePress = (e:WorkoutExercise) => {
    router.push({pathname:'/screens/modals/Exercise', params:{workoutId:workoutId, exerciseId:e.id}})
  }

  if (workoutData.isLoading) {
    return <View><Text>Loading...</Text></View>;
  }

  if (workoutData.error) {
    console.error('Error fetching workout data:', workoutData.error);
    return <View><Text>Error loading data</Text></View>;
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerBackVisible: true,
          title: workout?.name || '',
          headerRight: () => <WorkoutIcon enabled={false}/>
        }}
      />
      <ScrollView style={[styles.modalContainer]}>
        <View style={styles.containerWrapper}>
          <View style={styles.widgetHeader}>
            <Text style={styles.h3}>{workout?.date && dateToWD(workout.date)}'s Session</Text>
            <Text style={[styles.h4, styles.lighterFont]}>{workout?.date && dateToDDMMYY(workout.date)}</Text>
          </View>
          {/*<Exercise name='squats' sets='4' reps=''/>*/} 

          {workout?.exercises && 
            <>
            {
              workout.exercises.map((e: WorkoutExercise, exerciseIndex: number) => {
                return (
                  <View key={e.id}>
                    <View style={[styles.widgetHeader, { marginTop: 0, marginBottom: 3.5 }]}>
                      <Text style={styles.h4}>Exercise {exerciseIndex + 1}:</Text>
                    </View>

                    {/* <Swipeable 
                      overshootLeft={false}
                      overshootRight={false}
                      renderRightActions={(progress, dragX) => {
                        return (
                          <View style={[form.exerciseBubble, { width: 48 , borderTopLeftRadius:0, borderBottomLeftRadius:0}]}>
                            <EvilIcons name="trash" size={24} color={colors.lighter} />
                          </View>
                        );
                      }}
                      key={`swipeable-${exerciseIndex}`}> */}
                      <TouchableOpacity style={[form.exerciseBubble]} onPress={() => handleExercisePress(e)}>
                        <MaterialCommunityIcons name="weight-lifter" size={24} color={colors.yellow} />
                        <Text style={styles.h3a}>{e.name}</Text>
                        <View >
                          {
                            e.sets.map((s: WorkoutSet, index: any) => {
                              return (
                                <View key={s.id} style={{ alignSelf: 'flex-end' }}>
                                  <Text style={styles.p}>{s.rep} x {s.weight} Ibs</Text>
                                </View>
                              )
                            })
                          }
                        </View>
                      </TouchableOpacity>
                    {/* </Swipeable> */}
                  </View>
                )
              })
            }
          </>
          }

          <TouchableOpacity style={styles.widgetBody} onPress={handleNewExercisePress}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 14, }}>
              <Text style={[styles.h4, { lineHeight: 28 }]}>Add Exercise </Text>
              <AntDesign name="plus" size={28} color={colors.yellow} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.widgetBody, {marginTop:14}]} onPress={handleNewExercisePress}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 14, }}>
              <Text style={[styles.h4, { lineHeight: 28 }]}>Edit Workout Details </Text>
              <MaterialIcons name="edit-note" size={28} color={colors.yellow} />
            </View>
          </TouchableOpacity>

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
  },
  exerciseBubble:{
    flexDirection: 'row', 
    backgroundColor: colors.primary, 
    padding: 14, marginBottom: 14, 
    borderRadius: 7, 
    justifyContent: 'space-between', 
    alignItems: 'center',
    height: 75
  }
})
export default Log;