import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import colors from '../../colors';
import styles from "../../style";
import { dateToDDMMYY, dateToWD } from '../../utilities';
import { MaterialIcons, EvilIcons , Entypo , AntDesign, MaterialCommunityIcons} from '@expo/vector-icons'; 
import { WorkoutIcon } from '../../_layout';
import { WorkoutExercise, WorkoutSet, useWorkoutData } from '../../queries/WorkoutQueries';
import { useMuscleSvg } from '../../hooks/useMuscleSvg';
import MuscleMap from '../../assets/svgs/muscleMap.svg'
import { Bubble, InfoBubble } from '../../components/bubbleButton';
import { ActionSelectionModal, InitActionModalButton } from '../../components/Modal';
import { useState } from 'react';
import { Exercise } from '../../queries/SuggestionQueries';

const Log = () => {
  const router = useRouter();
  const { workoutId } =  useLocalSearchParams();
  const workoutData = useWorkoutData(workoutId);
  const workout = workoutData.workout;
  const targetMuscles = workout ? (workout.targetMuscles || []) : [];
  const muscleMapSvg = useMuscleSvg(targetMuscles,);

  const handleNewExercisePress = () => {
    router.push({pathname:'/screens/modals/Exercise', params:{workoutId:workoutId}})
  }

  const handleExercisePress = (exercise:WorkoutExercise) => {
    router.push({pathname:'/screens/modals/Exercise', params:{workoutId:workoutId, exerciseId:exercise.id}})
  }

  // Workout options modal
  const [isShowingWorkoutModal, setIsShowingWorkoutModal] = useState(false)

  // Exercise Modal
  const [selectedExerciseModal, setSelectedExerciseModal] = useState<WorkoutExercise | null>(null);
  const renderExerciseModal = (exercise:WorkoutExercise) => {
    return (
      <ActionSelectionModal
      title={exercise.name + " Options"}
      onExitPress={() => setSelectedExerciseModal(null)}
      selections={[
        {text:'View Exercise Details', action: () => handleExercisePress(exercise)},
        {text:'Edit Exercise Details', action: () => handleExercisePress(exercise)},
        {text:'Delete Exercise', action: () => console.log("delete")}
      ]}
    />
    )
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
          
          {/* Header */}
          <View style={[styles.widgetHeader, {marginBottom:0}]}>
            <Text style={styles.h3}>{workout?.date && dateToWD(workout.date)}'s Session</Text>
            <Text style={[styles.h4, styles.lighterFont]}>{workout?.date && dateToDDMMYY(workout.date)}</Text>
          </View>

          {/* Workout Options Modal Initializer */}
          <View style={{flexDirection:'row', flexGrow:1, justifyContent:'flex-end'}}>
            <InitActionModalButton onPress={() => setIsShowingWorkoutModal(true)} showing={isShowingWorkoutModal} text={'Options'}  />
          </View>

          {/* Target Muscles List */}
          <View>
            <Text style={[styles.p, styles.lighterFont]}>Target Muscles:</Text>
            <FlatList 
              contentContainerStyle={[ {marginVertical:7, padding:0, flexDirection:'row', justifyContent:'center'}]}
              horizontal={true}
              data={targetMuscles}
              keyExtractor={(item => item.id.toString())}
              renderItem={(item) => 
                <InfoBubble key={item.item.id} textStyle={[styles.p]} name={item.item.name}/>
              }
            /> 
          </View>
          
          {/* Muscle SVG */}
          <View style={[ styles.widgetBody, {margin:0, flexDirection:'row', marginBottom:14, justifyContent:'center'}]}>
            <MuscleMap width={150} height={150}  {...muscleMapSvg} />
          </View>

          {/* Exercise List */}
          {workout?.exercises &&
            <>
              {
                workout.exercises.map((e: WorkoutExercise, exerciseIndex: number) => {
                  return (
                    <View key={e.id}>
                      <View style={[styles.widgetHeader, { marginTop: 0, marginBottom: 3.5 }]}>
                        <Text style={styles.h4}>Exercise {exerciseIndex + 1}:</Text>
                      </View>
                      <TouchableOpacity style={[form.exerciseBubble]} onPress={() => setSelectedExerciseModal(e)}>
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
                    </View>
                  )
                })
              }
            </>
          }

          {/* Add Exercise Button */}
          <TouchableOpacity style={styles.widgetBody} onPress={handleNewExercisePress}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 14, }}>
              <Text style={[styles.h4, { lineHeight: 28 }]}>Add Exercise </Text>
              <AntDesign name="plus" size={28} color={colors.yellow} />
            </View>
          </TouchableOpacity>

          {/* Finish Active Workout Button */}
          {workout?.isActive &&
            <TouchableOpacity style={[styles.widgetBody, {marginTop:14}]} onPress={() => {}}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 14, }}>
              <Text style={[styles.h4, { lineHeight: 28 }]}>Finish Workout </Text>
              <MaterialIcons name="edit-note" size={28} color={colors.yellow} />
            </View>
          </TouchableOpacity>
          }

          {/* Workout Modal */}
          {isShowingWorkoutModal && (
            <ActionSelectionModal
              title={'Workout Options'}
              onExitPress={() => setIsShowingWorkoutModal(false)}
              selections={[
                {text:'Edit Workout Details', action: () => console.log("edit")},
                {text:'Delete Workout', action: () => console.log("delete")}
              ]}
          />
          )}
          {/* Exercise Modal */}
          {selectedExerciseModal != null && renderExerciseModal(selectedExerciseModal)}
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