import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import colors from '../../colors';
import styles from "../../style";
import { dateToDDMMYY, dateToWD } from '../../utilities';
import { MaterialIcons, AntDesign, MaterialCommunityIcons} from '@expo/vector-icons'; 
import { WorkoutIcon } from '../../_layout';
import { WorkoutExercise, WorkoutSet, useWorkoutData } from '../../queries/WorkoutQueries';
import { useMuscleSvg } from '../../hooks/useMuscleSvg';
import MuscleMap from '../../assets/svgs/muscleMap.svg'
import { InfoBubble } from '../../components/Bubble';
import { ActionSelectionModal, InitActionModalButton } from '../../components/Modal';
import { useState } from 'react';

const Log = () => {
  const router = useRouter();
  const { workoutId } =  useLocalSearchParams();
  const workoutData = useWorkoutData(workoutId);
  const workout = workoutData.workout;
  const targetMuscles = workout ? (workout.targetMuscles || []) : [];
  const muscleMapSvg = useMuscleSvg(targetMuscles);

  const handleNewExercisePress = () => {
    router.push({pathname:'/screens/modals/Exercise', params:{workoutId:workoutId}})
  }

  const handleExercisePress = (exercise:WorkoutExercise) => {
    router.push({pathname:'/screens/modals/Exercise', params:{workoutId:workoutId, exerciseId:exercise.id}})
  }

  const handleEditWorkoutPress = () => {
    router.push({pathname:'/screens/modals/Workout', params:{workoutId:workoutId}})
  }

  // Workout options modal
  const [isShowingWorkoutOptionsModal, setIsShowingWorkoutOptionsModal] = useState(false);

  // Verify Delete Workout Modal
  const [showDeleteWorkoutModal, setShowDeleteWorkoutModal] = useState(false);

  // Exercise options Modal
  const [selectedExerciseModal, setSelectedExerciseModal] = useState<WorkoutExercise | null>(null);

  // Verify Delete Exercise Modal
  const [selectedDeleteExerciseModal, setSelectedDeleteExerciseModal] = useState<WorkoutExercise | null>(null);
  const handleDeleteExerciseAction = (exerciseId:any) => workoutData.deleteExercise(exerciseId, () => setEventMessage("Succesfully Deleted Exercise"));

  const [eventMessage, setEventMessage] = useState<string | null>();
  if (workoutData.isLoading) {
    return <View><Text>Loading...</Text></View>;
  }

  if (workoutData.error) {
    console.error('Error fetching workout data:', workoutData.error);
    return <View><Text >Error loading data</Text></View>;
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
          
          { eventMessage != null &&
            <View>
              <Text style={{paddingTop:14, color:colors.lighter}}>{eventMessage}</Text>
            </View>
          }
          {/* Header */}
          <View style={[styles.widgetHeader, {marginBottom:0}]}>
            <Text style={styles.h3}>{workout?.date && dateToWD(workout.date)}'s Session</Text>
            <Text style={[styles.h4, styles.lighterFont]}>{workout?.date && dateToDDMMYY(workout.date)}</Text>
          </View>

          {/* Workout Options Modal Initializer */}
          <View style={{flexDirection:'row', flexGrow:1, justifyContent:'flex-end'}}>
            <InitActionModalButton onPress={() => setIsShowingWorkoutOptionsModal(true)} showing={isShowingWorkoutOptionsModal} text={'Options'}  />
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
                            e.sets.slice(0,5).map((s: WorkoutSet, index: any) => {
                              return (
                                <View key={s.id} style={{ alignSelf: 'flex-end' }}>
                                  <Text style={styles.p}>{s.rep} x {s.weight} Ibs</Text>
                                </View>
                              )
                            })
                          }
                          {
                            e.sets.length > 5 && (
                              <View key={"..."} style={{ alignSelf: 'center' }}>
                                <Text style={styles.p}>    ...   </Text>
                              </View>
                            )
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
          {isShowingWorkoutOptionsModal && 
            <ActionSelectionModal
              title={'Workout Options'}
              onExitPress={() => setIsShowingWorkoutOptionsModal(false)}
              selections={[
                { text: 'Edit Workout Details', action: handleEditWorkoutPress },
                { text: 'Delete Workout', action: () => setShowDeleteWorkoutModal(true) }
              ]}
            />
          }
          {/* Confirm Delete Workout Modal */}
          {showDeleteWorkoutModal && 
            <ActionSelectionModal
              title={"Are you sure you want to delete the Workout?"}
              onExitPress={() => setShowDeleteWorkoutModal(false)}
              selections={[
                {text:'Confirm Delete', textStyle:{color:colors.red}, action: () => workoutData.deleteWorkout(() => router.back())},
                {text:'Cancel'}
              ]}
            />
          }

          {/* Exercise Modal */}
          {selectedExerciseModal != null && 
            <ActionSelectionModal
              title={selectedExerciseModal.name + " Options"}
              onExitPress={() => setSelectedExerciseModal(null)}
              selections={[
                {text:'Edit Exercise Details', action: () => handleExercisePress(selectedExerciseModal)},
                {text:'Delete Exercise', action: () => setSelectedDeleteExerciseModal(selectedExerciseModal)}
              ]}
            />
          }

          {/* Confirm Delete Exercise Modal */}
          {selectedDeleteExerciseModal != null && 
            <ActionSelectionModal
              title={"Are you sure you want to delete this Exercise?"}
              onExitPress={() => setSelectedDeleteExerciseModal(null)}
              selections={[
                {text:'Confirm Delete', textStyle:{color:colors.red}, action: () => handleDeleteExerciseAction(selectedDeleteExerciseModal?.id)},
                {text:'Cancel', action: () => console.log("Cancel")}
              ]}
            />
          }

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
    height: 100
  }
})
export default Log;