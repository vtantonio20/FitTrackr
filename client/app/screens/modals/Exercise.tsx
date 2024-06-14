import React, { FunctionComponent, Ref, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList, ScrollView } from 'react-native'
import colors from '../../colors'
import styles from "../../style";
import { MaterialIcons, Feather, Entypo , AntDesign, Ionicons} from '@expo/vector-icons'; 
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import BottomModal, { ModalButton } from '../../components/smallModal';
import { useSelectionModal } from '../../hooks/useSelectionModal';
import { SimpleLineIcons  } from '@expo/vector-icons'; 
import { useSuggested } from '../../hooks/useSuggestions';
import DraggableFlatList, { DragEndParams, ScaleDecorator } from 'react-native-draggable-flatlist'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { dateToDDMMYY, dateToWD } from '../../utilities';
import { useMutation, useQuery } from 'react-query';
import { addExerciseToWorkout, fetchExerciseData, fetchWorkoutData, fetchWorkoutsData } from '../../api';
import { WorkoutIcon } from '../../_layout';

const SetInput: FunctionComponent<any> = (props:any) => {
  const [sets, setSets] = useState(props.sets);
  const handleSetDrag = (data: any) => setSets(data.data);

  const getSetNum = (index: number|undefined) => {
    return index ? index + 1 : 1
  }
  const addNewSet = () => {
    const lastSet = sets[sets.length - 1];
    const newSet = [{
      setNum: sets.length,
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
    sets[index || 0].rep = val;
  }
  
  const onWeightChange = (val: string, index: number | undefined) => {
    sets[index || 0].weight = val;
  }
  const handleSubmit = () => {
    props.onSubmit(sets)
  }
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
          keyExtractor={(item:any) => (item.setNum.toString())}
          onDragEnd={(data) => { handleSetDrag(data as any) }}
          renderItem={(item) => {
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
                      defaultValue={item.item.rep}
                      keyboardType='numeric'
                      returnKeyLabel='Done'
                      returnKeyType='done'
                      onChangeText={newRep => onRepChange(newRep, item.getIndex())}
                    />
                  </View>
                  <View style={{ width: '33%', flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput style={[styles.h4, styles.lighterFont, { padding: 7, backgroundColor: colors.darker, minWidth: 40, borderRadius: 7 }]}
                      defaultValue={item.item.weight}
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
        {sets.length != 0 &&
          <TouchableOpacity style={[form.submitContainer, { marginTop: 14 }]} onPress={handleSubmit}>
            <Text style={[styles.h3, { lineHeight: 28 }]}>Save Changes</Text>
          </TouchableOpacity>
        }
      </View>
    </>
  )
}

const AddExercise: FunctionComponent = (props:any) => {
  const {id} = useLocalSearchParams();
  const sets:any[] = props.sets ? props.sets : [];

  const router = useRouter();

  // Form handling
  const { control, setValue, getValues } = useForm({defaultValues: { exerciseName: ''}});
  const [focusOn, setFocusOn] = useState('');
  const changeFocus = (to: string) => setFocusOn(to);

  // Fetch Workout Data Handling
  const { data, error, isLoading, refetch } = useQuery('workout', () => fetchWorkoutData(id))  
  const { workoutName, workoutDate, workoutTargetMuscles, workoutId } = useMemo(() => {
    if (!data) return {}
    return {
      workoutName: data.name,
      workoutDate: new Date(data.date),
      workoutTargetMuscles: data.target_muscles.map((muscle: any) => muscle),
      workoutId: data.id,
    }
  }, [data])
  
  // Fetch Suggested Exercises Data Handling
  const [updateExercises, setUpdateExercises] = useState(false);
  const { data: exercisesData, error: exercisesError, isLoading: areExercisesLoading } = useQuery(['exercises', workoutTargetMuscles], () => fetchExerciseData(workoutTargetMuscles), {
    onSuccess: () => {
      setUpdateExercises(true);
    }
  });
  const { exerciseNames } = useMemo(() => {
    return { exerciseNames: exercisesData ? [... new Set(exercisesData.exercises.map((e: any) => e.name))] : [] }
  }, [exercisesData])

  // Handle Suggestion Logic
  const addSuggestion = (suggestion: string) => {
    setValue("exerciseName", suggestion)
  }
  // const selectionModal = useModal(WORKOUTGROUPS);
  const suggestions = useSuggested(exerciseNames);
  // Updates the selection modal when muscleMap is changed (fetched)
  useEffect(() => {
    suggestions.setNewSuggestions(exerciseNames);
  }, [updateExercises])
  
  
  // Submit Functionality
  const [errorMessage, setErrorMessage] = useState<string>();
  const submitMutation = useMutation((data:any) => addExerciseToWorkout(workoutId, data), {
    onSuccess: () => {
      // router.back()
      router.navigate({pathname:'/screens/modals/Log', params:{refresh:"true", id:id}})
    },
    onError: (error:any) => {
      // setErrorMessage(error.response.data.error)
    }
  })

  const onSubmitForm = (setsData:any) => {
    const name = getValues("exerciseName")
    const newExerciseData:any = {
      name: name,
      sets: setsData.map((setData:any) => ({
        number: setData.setNum,
        rep_num: setData.rep,
        weight: setData.weight
      }))
    }

    if (name === "") {
      setErrorMessage("A name is required.")
      return;
    }

    for (const set of newExerciseData.sets) {
      if (set.rep_num ===  ""){
        setErrorMessage("A rep number is required.")
        return;
      }

      if (set.weight ===  ""){
        setErrorMessage("A weight value is required.")
        return;
      }
    }
  
    submitMutation.mutate(newExerciseData);
  }

  if (isLoading || areExercisesLoading) {
    return <View><Text>Loading...</Text></View>;
  }

  if (error || exercisesError) {
    console.error('Error fetching workout data:', error);
    return <View><Text>Error loading data</Text></View>;
  }

  return (
    <>
      <Stack.Screen
          options={{
          headerBackVisible: true,
          title: workoutName,
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
          <Text style={styles.h3}>{workoutDate && dateToWD(workoutDate)}'s Session</Text>
          <Text style={[styles.h4, styles.lighterFont]}>{workoutDate && dateToDDMMYY(workoutDate)}</Text>
        </View>
      
        <View style={[styles.widgetHeader, {marginVertical:0,paddingBottom:7}]}>
            <Text style={form.elementHeader}>Name: </Text>
            <ModalButton onPress={() => {/*modal.toggleOpen()*/}} text={"muscle"/*modal.selectedGroup*/}showing={true} />
        </View>
          
        <Controller
          name="exerciseName"
          control={control}
          rules={{required:true}}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[form.formTextArea, (focusOn === 'name') && form.focusedInput]}
              onChangeText={onChange}
              value={value}
              placeholder={'Name of Exercise'}
              onBlur={() => changeFocus('')}
              onChange={onChange}
              onFocus={() => changeFocus('name')}
              />
          )}
        />
        <FlatList
          horizontal={true}
          data={suggestions.unselectedSuggestions}
          renderItem={({ item }) => (
            <TouchableOpacity style={form.suggestion} onPress={() => {addSuggestion(item)}}>
                <Text style={[styles.p, { paddingRight: 1.5 }]}>{item}</Text>
            </TouchableOpacity>
          )}
        />
        <SetInput sets={sets} onSubmit={onSubmitForm}/>

        {/*{modal.modalOpen &&
          <BottomModal
            onSelectionPress={(i) => modal.changeIndex(i)}
            onExitPress={() => modal.toggleOpen()}
            title={"Set Primary Muscle"}
            selections={modal.selections}
          />
        } */}
      </View>
    </ScrollView>        
    </>
  )
}
export default AddExercise;
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

function useModal(WORKOUTGROUPS: string[]) {
  throw new Error('Function not implemented.');
}
