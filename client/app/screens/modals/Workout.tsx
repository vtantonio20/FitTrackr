import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useWorkoutData } from "../../queries/WorkoutQueries";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import useDate from "../../hooks/useDate";
import { Muscle, MuscleGroup, useMuscleSuggestionData } from "../../queries/SuggestionQueries";
import { View, Text, StyleSheet, ScrollView, TextInput, Switch, TouchableOpacity, FlatList } from "react-native";
import colors from "../../colors";
import styles from "../../style";
import { WorkoutIcon } from "../../_layout";
import { MaterialCommunityIcons, SimpleLineIcons, Entypo } from '@expo/vector-icons';
import { DatePicker } from "../../components/DatePicker";
import { ActionSelectionModal, InitActionModalButton } from "../../components/Modal";
import { Bubble } from "../../components/Bubble";
import { useMuscleSvg } from "../../hooks/useMuscleSvg";
import MuscleMap from '../../assets/svgs/muscleMap.svg'
import { useUser } from "../../contexts/UserContext";

export const Workout: FunctionComponent = () => {
  const router = useRouter();
  const { user } = useUser();
  
  const { workoutId } = useLocalSearchParams();
  const workoutData = useWorkoutData(workoutId);
  const workout = workoutData.workout;

  // Initialize Form Stuff
  const [focusOn, setFocusOn] = useState('');
  const changeFocus = (to: string) => setFocusOn(to);
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      workoutName: workout ? workout.name : '',
      workoutDate: workout ? workout.date : new Date(),
      targetMuscles: (workout && workout.targetMuscles) ? workout.targetMuscles : [],
      makeActive: workout ? workout.isActive : true
    }
  });
  const { remove, append } = useFieldArray<any>({ control, name: "targetMuscles" });

  // Date Section
  const [date, setDate] = useDate(setValue);

  // Muscle Suggestions Section
  const muscleSuggestions = useMuscleSuggestionData();
  const muscleMap = muscleSuggestions.muscleGroups;
  
  const [isShowingMuscleGroupSelectionModal, setIsShowingMuscleGroupSelectionModal] = useState(false);
  const toggleShowMuscleGroupSelectionModal = () => setIsShowingMuscleGroupSelectionModal(!isShowingMuscleGroupSelectionModal);
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>(muscleMap ? muscleMap[0] : { id: 0, name: '', muscles: [] });
  const [selectedMuscles, setSelectedMuscles] = useState<Muscle[]>((workout && workout.targetMuscles) ? workout.targetMuscles : []);
  const muscleMapSvg = useMuscleSvg(selectedMuscles);
  const unselectedMuscles = useMemo(() => {
    const unselected = [];
    for (const muscle of muscleGroup.muscles) {
      let found = false;
      for (const selectedMuscle of selectedMuscles) {
        if (selectedMuscle.id === muscle.id) {
          found = true;
          break;
        }
      }
      if (!found) {
        unselected.push(muscle);
      }
    }
    return unselected;
  }, [selectedMuscles, muscleGroup])

  const appendMuscle = (muscle: Muscle) => {
    append({ id: muscle.id, name: muscle.name })
    setFocusOn('targetMuscles')
    setSelectedMuscles(prevSelectedMuscles => [...prevSelectedMuscles, muscle]);
  }

  const removeMuscle = (muscle: any, index:number) => {
    remove(index);
    setFocusOn('');
    setSelectedMuscles(prevSelectedMuscles =>
      prevSelectedMuscles.filter(m => m.id !== muscle.id)
    );
  }

  // Update Muscle Map when data is fetched
  useEffect(() => {
    if (muscleMap !== undefined){
      setMuscleGroup(muscleMap[0])
    }
  }, [muscleMap])
  
  // Submit Form Functionality
  const [errorMessage, setErrorMessage] = useState<string>();
  const onSubmitForm = (data:any) => {
    const workoutName = data.workoutName;
    const workoutDate = data.workoutDate;
    const targetMusclesIds = data.targetMuscles.map((muscle: Muscle) => muscle.id);
    const isActiveWorkout = data.makeActive;
    
    if (!user) {
      return;
    }

    if (workoutName === ''){
      setErrorMessage("A name is required.")
      return;
    }
    
    if (!workoutId) {
      workoutData.createWorkout(workoutName, workoutDate, isActiveWorkout, targetMusclesIds, user.id, (msg) => {
        if (msg) {
          setErrorMessage(msg)
          return;
        }
        router.back();
      })
    } else {
      workoutData.updateWorkout(workoutName, workoutDate, isActiveWorkout, targetMusclesIds, user.id, (msg) => {
        if (msg) {
          setErrorMessage(msg)
          return;
        }
        router.back();
      })
    }
  }

  if (workoutData.isLoading) {
    return <View><Text>Loading...</Text></View>;
  }

  if (workoutData.error) {
    console.error('Error fetching workout data:');
    return <View><Text>Error loading data</Text></View>;
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerBackVisible: true,
          title: workout ? workout.name : 'New Workout',
          headerRight: () => <WorkoutIcon enabled={false}/>
        }}
      />
      <ScrollView style={[styles.modalContainer]}>
        <View style={styles.containerWrapper}>
          { errorMessage &&
            <View>
              <Text style={{paddingTop:14, color:colors.red}}>{errorMessage}</Text>
            </View>
          }
          <View style={styles.widgetHeader}>
            <Text style={styles.h2}>Workout Details</Text>
          </View>
          <View style={form.element}>
            <Text style={form.elementHeader}>Name: </Text>
            <View style={[form.formTextArea, (focusOn === 'name') && styles.focusedInput, styles.flexRowLeft]}>
            <MaterialCommunityIcons name="dumbbell" size={24} color={colors.yellow} style={{paddingRight:7}} />
              <Controller
                name="workoutName"
                control={control}
                rules={{ required: false }}
                render={({ field: { onChange, value } }) => (
                  <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:'center'}}>

                    <TextInput
                      style={{ color: colors.lighter, flexGrow: 1 }}
                      onFocus={() => changeFocus('name')}
                      onBlur={() => changeFocus('')}
                      onChangeText={onChange}
                      value={value}
                      placeholder={"Name your Workout"}
                      placeholderTextColor={"rgba(255, 255, 255, 0.54)"}
                    />
                    {/* <TouchableOpacity onPress={() => setValue("workoutName", "")}>
                      <Entypo style={{padding:7}} name="erase" size={24} color={colors.primary} />
                    </TouchableOpacity> */}
                  </View>
                )}
              />
            </View>
          </View>

          <View style={form.element} >
            <Text style={form.elementHeader}>Date: </Text>
            <View style={[form.formTextArea, (focusOn === 'date') && styles.focusedInput, { justifyContent: "center" }]} >
              <DatePicker parentDate={setDate} editable={true} focused={(is) => is ? changeFocus('date') : changeFocus('')}/>
            </View>
          </View>
          
          <Controller
            name="targetMuscles"
            control={control}
            render={({ field: { value } }) => (
              <View style={[form.element, { paddingBottom: 0 }]}>
                <View style={styles.flexRow}>
                  <Text style={form.elementHeader}>Target Muscles: <Text style={styles.p}>(optional)</Text></Text>
                  <InitActionModalButton onPress={toggleShowMuscleGroupSelectionModal} text={muscleGroup.name} showing={isShowingMuscleGroupSelectionModal} />
                </View>

                <View style={[form.formTextArea, (focusOn === 'targetMuscles') && styles.focusedInput]}>
                  {/* flat list representing selected muscles */}
                  <FlatList
                    horizontal={true}
                    data={value}
                    keyExtractor={(muscle => muscle.id.toString())}
                    renderItem={({ item, index }) =>
                      <TouchableOpacity style={styles.suggestion} onPress={() => removeMuscle(item, index)}>
                        <Text style={[styles.p, { paddingRight: 1.5 }]}>{item.name}</Text>
                        <SimpleLineIcons name="close" size={12} color={colors.lighter} />
                      </TouchableOpacity>
                    }
                  />
                </View>
                {/* Flat list to add to selected */}
                <FlatList
                  contentContainerStyle={[ {marginVertical:7, padding:0, flexDirection:'row', justifyContent:'center'}]}
                  horizontal={true}
                  data={unselectedMuscles}
                  keyExtractor={muscle => muscle.id.toString()}
                  renderItem={(muscle) => 
                    <Bubble key={muscle.item.id} textStyle={[styles.p]} name={muscle.item.name} onPress={() => appendMuscle(muscle.item)}/>
                  }
                />
              </View>
            )}
          />

          <View style={[styles.flexRow, form.toggleActiveArea]}>
            <Text style={[form.elementHeader, { paddingBottom: 0 }]}>Make Active Workout</Text>
            <Controller
              name="makeActive"
              control={control}
              rules={{ required: false }}
              render={({ field: { onChange, value } }) => (
                <Switch
                  onValueChange={onChange}
                  value={value}
                />
              )}
            />
          </View>

          <View style={[ styles.widgetBody, {margin:0, flexDirection:'row', marginBottom:14, justifyContent:'center'}]}>
            <MuscleMap width={150} height={150}  {...muscleMapSvg} />
          </View>

          {/*Submit Button */}
          <TouchableOpacity style={form.submitContainer} onPress={handleSubmit(onSubmitForm)}>
            <Text style={[styles.h3, {lineHeight:28}]}>Save Changes</Text>
          </TouchableOpacity>

          {/* Modal to set primary muscle group */}
          {isShowingMuscleGroupSelectionModal && 
            <ActionSelectionModal
              title={"Change Primary Muscle Group"}
              onExitPress={toggleShowMuscleGroupSelectionModal}
              selections={!muscleMap ? [] :
                muscleMap.map((muscleGroup:MuscleGroup) => {
                  return {text:muscleGroup.name, action: () => setMuscleGroup(muscleGroup)}
                })
              }
            />
          }

        </View>
      </ScrollView>
    </>
  )
}
export const form = StyleSheet.create({
  submitContainer: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 50,
    paddingVertical: 14,
  },
  element: {
    paddingBottom: 14
  },
  elementHeader: {
    ...styles.h4,
    paddingBottom: 7,
    color: colors.white
  },
  formTextArea: {
    color: colors.lighter,
    minHeight: 48,
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
  },
  toggleActiveArea: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 1.5,
    paddingBottom: 14
  }
})
export default Workout;