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
import { getWorkouts, WORKOUTGROUPS } from '../../static/workouts';
import DraggableFlatList, { DragEndParams, ScaleDecorator } from 'react-native-draggable-flatlist'
import { Stack, useRouter } from 'expo-router';
import { dateToDDMMYY, dateToWD } from '../../utilities';
import { useQuery } from 'react-query';
import { fetchWorkoutData } from '../../api';
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
      reps: lastSet?.reps ?? '',
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
    sets[index || 0].reps = val;
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
            <Text style={[styles.h3a, { width: '33%' }]}>Reps</Text>
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
                      defaultValue={item.item.reps}
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

const AddExercise: FunctionComponent = () => {
  const { data, error, isLoading } = useQuery('workouts', fetchWorkoutData)
  const router = useRouter();
  
  // const selectionModal = useModal(WORKOUTGROUPS);

  const { control, handleSubmit, setValue, getValues, formState: { errors } } = useForm({defaultValues: { exerciseName: ''}});
  const [isFocused, setIsFocused] = useState(false);
  const onFocus = () => setIsFocused(!isFocused);

    
  const { name, date, exercises } = useMemo(() => {
    const activeWorkout = data.active_workout;
    return {
      name: activeWorkout.name,
      date: new Date(activeWorkout.date),
      id: activeWorkout.id,
      exercises: activeWorkout.exercises.map((exercise: any) => ({
        id: exercise.id,
        name: exercise.name,
        sets: exercise.sets.map((s: any) => ({
          id: s.id,
          rep: s.rep_num,
          weight: s.weight
        }))
      }))
    }
  }, [data.active_workout])

  const sets:any[] = [];

  const [errorMessage, setErrorMessage] = useState();

  const onSubmitForm = (data:any) => {
    console.log(data)
    // router.push('/screens/modals/Log')
  }



  if (isLoading) {
    return <View><Text>Loading...</Text></View>;
  }

  if (error) {
    console.error('Error fetching workout data:', error);
    return <View><Text>Error loading data</Text></View>;
  }

  return (
    <>
      <Stack.Screen
          options={{
          headerBackVisible: true,
          title: name,
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
          <Text style={styles.h3}>{date && dateToWD(date)}'s Session</Text>
          <Text style={[styles.h4, styles.lighterFont]}>{date && dateToDDMMYY(date)}</Text>
        </View>
      
        {/* <View style={[styles.widgetHeader, {marginVertical:0,paddingBottom:7}]}>
            <Text style={form.elementHeader}>Name: </Text>
            <ModalButton onPress={() => modal.toggleOpen()} text={modal.selectedGroup} />
        </View> */}
          
        <Controller
          name="exerciseName"
          control={control}
          rules={{required:true}}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[form.formTextArea, isFocused && form.focusedInput]}
              onChangeText={onChange}
              value={value}
              placeholder={'Name of Exercise'}
              onBlur={onFocus}
              onChange={onChange}
              onFocus={onFocus}
            />
          )}
        />
        <SetInput sets={sets} onSubmit={onSubmitForm}/>

        {/* <FlatList
          horizontal={true}
          data={suggestions.unselectedSuggestions}
          renderItem={({ item, index }) => (
            <TouchableOpacity style={form.suggestion} onPress={() => {addSuggestion(item)}}>
                <Text style={[styles.p, { paddingRight: 1.5 }]}>{item}</Text>
            </TouchableOpacity>
          )}
        />
        <SetList sets={sets} onSubmit={onSubmitForm}/>
        {modal.modalOpen &&
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
