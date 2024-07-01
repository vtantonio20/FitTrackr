import React, { FunctionComponent, useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList, ScrollView } from 'react-native'
import colors from '../../colors'
import styles from "../../style";
import { AntDesign,Entypo } from '@expo/vector-icons'; 
import { Controller, useForm } from 'react-hook-form';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { dateToDDMMYY } from '../../utilities';
import { WorkoutIcon } from '../../_layout';
import { WorkoutSet, useWorkoutData } from '../../queries/WorkoutQueries';
import { ActionSelectionModal, InitActionModalButton } from '../../components/Modal';
import { Exercise, Muscle, useExerciseSuggestionsFromMuscle } from '../../queries/SuggestionQueries';

const ExerciseFC: FunctionComponent = (props:any) => {
  const {workoutId, exerciseId} = useLocalSearchParams();
  const router = useRouter();

  // Fetch Workout Data Handling
  const workoutData = useWorkoutData(workoutId);
  const workout = workoutData.workout;
  const exercise = workout?.exercises?.find((e) => {
    if (exerciseId && exerciseId === String(e.id)) {
      return e;
    }
  })
  // The setIn if in edit, if in create mode, empty array
  const sets = (exercise && exercise.sets) ? exercise.sets : [];
  // The targetMuscles from the workout
  const targetMuscles = workout?.targetMuscles?.map((muscle:Muscle) =>  muscle ) ?? [];
  
  // Form handling
  const [focusOn, setFocusOn] = useState('');
  const changeFocus = (to: string) => setFocusOn(to);
  const { control, setValue, getValues, watch } = useForm({defaultValues: { exerciseName: exercise ? exercise.name : ''}});

  // Exercise Suggestions Handling
  const [isShowingModal, setIsShowingModal] = useState(false);
  const exerciseSuggestions = useExerciseSuggestionsFromMuscle(targetMuscles ? targetMuscles[0] : undefined);
  
  // Submit Functionality
  const [errorMessage, setErrorMessage] = useState<string>();
  const onSubmitForm = (setsData:WorkoutSet[]) => {
    const name = getValues("exerciseName");
    if (name === "") {
      setErrorMessage("A name is required.")
      return;
    }

    for (const set of setsData) {
      if (!set.rep){
        setErrorMessage("A rep number is required.")
        return;
      }

      if (!set.weight){
        setErrorMessage("A weight value is required.")
        return;
      }
    }

    if (!exerciseId){
      workoutData.createExercise(name, setsData, () => {
        router.navigate({ pathname: '/screens/modals/Log', params: { workoutId } });
      })
    } else {
      workoutData.updateExercise(exerciseId, name, setsData, () => {
        router.navigate({ pathname: '/screens/modals/Log', params: { workoutId } });
      })
    }
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

        {/* Error Messages */}
        { errorMessage &&
          <View>
            <Text style={{paddingTop:14, color:colors.red}}>{errorMessage}</Text>
          </View>
        }

        {/* Header */}
        <View style={styles.widgetHeader}>
          <Text style={styles.h3}>Exercise Details</Text>
          <Text style={[styles.h4, styles.lighterFont]}>{workout?.date && dateToDDMMYY(workout.date)}</Text>
        </View>
      
        {/* Suggested Exercises Section */}
        <View style={[styles.widgetHeader, {marginVertical:0,paddingBottom:7}]}>
            <Text style={form.elementHeader}>Name: </Text>
            {exerciseSuggestions.muscle && (
              <InitActionModalButton onPress={() => setIsShowingModal(true)} text={exerciseSuggestions.muscle.name} showing={isShowingModal} />
              )
            }
        </View>
          
        <Controller
          name="exerciseName"
          control={control}
          rules={{required:true}}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:'center'}}>
              <TextInput
                style={[form.formTextArea, (focusOn === 'name') && form.focusedInput , {flexGrow:1}]}
                onChangeText={onChange}
                value={value}
                placeholder={'Name of Exercise'}
                onBlur={() => changeFocus('')}
                onChange={onChange}
                onFocus={() => changeFocus('name')}
              />
              <TouchableOpacity onPress={() => setValue("exerciseName", "")}>
                <Entypo style={{paddingLeft:7}} name="erase" size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>

            
          )}
        />
        {/* The suggestion list */}
        { exerciseSuggestions.exerciseData && (
          <FlatList
            horizontal={true}
            data={exerciseSuggestions.exerciseData.filter((exercise: Exercise) => {
                const inputtedText = watch("exerciseName").toLowerCase();
                return inputtedText !== "" ? exercise.name.toLowerCase().startsWith(inputtedText) : exercise.name;
              })
            }
            renderItem={({ item }) => (
              <TouchableOpacity style={form.suggestion} onPress={() => {setValue("exerciseName", item.name)}}>
                  <Text style={[styles.p, { paddingRight: 1.5 }]}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        {/* Sets Component */}
        <SetInput setsData={sets} onSubmitSetsData={onSubmitForm}/>

        {/* Target Muscle Modal */}
        {isShowingModal && (
          <ActionSelectionModal
          title={'Select Target Muscle'}
          onExitPress={() => {setIsShowingModal(false); setValue("exerciseName", "")}}
          selections={targetMuscles.map((muscle:Muscle) => {
            return {text:muscle.name, action:() => {exerciseSuggestions.changeMuscle(muscle)}}
          })}
        />
        )}
      </View>
    </ScrollView>
    </>
  )
}


interface SetInputProps {
  setsData:WorkoutSet[];
  onSubmitSetsData: (setsData:WorkoutSet[]) => WorkoutSet[];
}

const SetInput: FunctionComponent<any> = (props:SetInputProps) => {
  const [sets, setSets] = useState<WorkoutSet[]>(props.setsData);

  const getSetNum = (index: number|undefined) => {
    return index ? index + 1 : 1
  }
  const addNewSet = () => {
    const lastSet = sets[sets.length - 1];
    const newSet: WorkoutSet[] = [{
      id: sets.length + 1,
      rep: lastSet?.rep ?? '',
      weight: lastSet?.weight ?? ''
    }];
    setSets([...sets, ...newSet]);
  }
  const removeSet = (index: number | undefined) => {
    const temp:any = [...sets];
    temp.splice(index || 0, 1);
    setSets(temp);
  }

  const onRepChange = (val: string, index: number | undefined) => {
    sets[index || 0].rep = parseInt(val);
  }
  
  const onWeightChange = (val: string, index: number | undefined) => {
    sets[index || 0].weight = parseInt(val);
  }
  const handleSetDrag = (data: any) => setSets(data.data);

  const handleSubmit = () => {
    props.onSubmitSetsData(sets)
  }

  // Whenever component mounts add one set defaultly
  useEffect(() => {
    if (sets.length == 0) {
      addNewSet();
    }
  }, [])


  return (
    <>
      <View style={{ marginVertical: 14 }}>
        {sets.length != 0 &&
          <View style={{ flexDirection: 'row', paddingHorizontal: 7, paddingBottom: 14 }}>
            <Text style={[styles.h3a, { width: '25%' }]}>Set</Text>
            <Text style={[styles.h3a, { width: '33%' }]}>Rep</Text>
            <Text style={[styles.h3a, { width: '33%' }]}>Weight (Ibs)</Text>
          </View>
        }
        <DraggableFlatList
          scrollEnabled={false}
          data={sets}
          keyExtractor={(item:any) => (item.id.toString())}
          onDragEnd={(data) => { handleSetDrag(data as any) }}
          renderItem={(item) => {
            const rep = item.item.rep && JSON.stringify(item.item.rep);
            const weight = item.item.weight && JSON.stringify(item.item.weight);
            return (
              <ScaleDecorator>
                <TouchableOpacity
                  onLongPress={item.drag} disabled={item.isActive}
                  style={{
                    flexDirection: 'row', backgroundColor: colors.primary, padding: 10.5, borderBottomWidth: 1, borderBottomColor: colors.darker,
                    borderTopLeftRadius: (item.getIndex() === 0) ? 7 : 0,
                    borderTopRightRadius: (item.getIndex() === 0) ? 7 : 0,
                  }}>
                  <Text style={[styles.h4, styles.lighterFont, { width: '25%', alignSelf: 'center', padding: 7 }]}>{getSetNum(item.getIndex())}</Text>
                  <View style={{ width: '33%', flexDirection: 'row', alignItems: 'center', }}>
                    <TextInput style={[styles.h4, styles.lighterFont, { padding: 7, backgroundColor: colors.darker, minWidth: 40, borderRadius: 7 }]}
                      defaultValue={rep}
                      keyboardType='numeric'
                      returnKeyLabel='Done'
                      returnKeyType='done'
                      onChangeText={newRep => onRepChange(newRep, item.getIndex())}
                    />
                  </View>
                  <View style={{ width: '33%', flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput style={[styles.h4, styles.lighterFont, { padding: 7, backgroundColor: colors.darker, minWidth: 40, borderRadius: 7 }]}
                      defaultValue={weight}
                      keyboardType='number-pad'
                      returnKeyLabel='Done'
                      returnKeyType='done'
                      onChangeText={newWeight => onWeightChange(newWeight, item.getIndex())}
                    />
                  </View>
                  <TouchableOpacity onPress={() => removeSet(item.getIndex())} style={{ alignItems: 'flex-end', justifyContent: 'center', paddingHorizontal:7 }} >
                    <AntDesign name="delete" size={24} color={colors.lighter} />
                  </TouchableOpacity>
                </TouchableOpacity>
              </ScaleDecorator>
            );
          }}
        />
        <TouchableOpacity onPress={() => addNewSet()} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 14, backgroundColor: colors.primary, borderBottomRightRadius: 7, borderBottomLeftRadius: 7, borderRadius: sets.length === 0 ? 7 : 0 }}>
          <Text style={[styles.h4, { lineHeight: 28 }]}>Add new set</Text>
          <AntDesign name="plus" size={28} color={colors.yellow} />
        </TouchableOpacity>
        <TouchableOpacity style={[form.submitContainer, { marginTop: 14 }]} onPress={handleSubmit}>
          <Text style={[styles.h3, { lineHeight: 28 }]}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </>
  )
}

export default ExerciseFC;
const form = StyleSheet.create({
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 7,
    padding:14,
  },
  focusedInput: {
    borderColor: 'rgba(255, 255, 10, 0.1)',
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
    ...styles.h3a,
    color: colors.white,
  },
  formTextArea: {
    color: colors.lighter,
    height: 48,
    paddingHorizontal: 7,
    borderColor: colors.primary,
    borderWidth:1,
    borderRadius: 7,
    marginBottom:7
  },
  widget: {
    padding:7,
    backgroundColor: colors.primary,
    borderRadius: 7,
    marginBottom:14
  },
  suggestion: {
    backgroundColor: colors.primary,
    borderRadius: 7,
    padding: 14,
    margin: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  }
})