
import React, { FunctionComponent, useState, useContext, useEffect, useMemo } from 'react'
import { Stack, useNavigation, useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, TextInput, FlatList, StyleSheet, ScrollView, TextStyle, StyleProp, Pressable } from 'react-native';
import colors from '../../colors';
import styles from "../../style";
import { WorkoutContext } from '../../contexts/workoutContext';
import { Bubble } from '../../components/bubbleButton';
import { DatePicker } from '../../components/datePicker';
import { Controller, useFieldArray, useForm, useFormContext, useWatch } from 'react-hook-form';
import { SimpleLineIcons  } from '@expo/vector-icons'; 
import { useSuggested } from '../../hooks/useSuggestions';
import { useModal } from '../../hooks/useModal';
import BottomModal, { ModalButton } from '../../components/smallModal';
import { getMuscles, MUSCLEGROUPS } from '../../static/muscles';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
export const Workout: FunctionComponent = () => {
  const router = useRouter();
  const [focusOn, setFocusOn] = useState('');
  const changeFocus = (to: string) => setFocusOn(to);
  const { setInActiveWorkout, setWorkout, setWorkoutDate, setTargetMuscles } = useContext(WorkoutContext);
  const { control, handleSubmit, setValue, getValues ,formState: { errors } } = useForm({
    defaultValues: {
      workoutName: '',
      workoutDate: new Date(),
      targetMuscles: [],
    }
  });
  const { remove, append } = useFieldArray<any>({ name: "targetMuscles", control });

  //Dates
  const [date, setDate] = useState<Date>();
  useEffect(() => {
    setValue("workoutDate", date || new Date());
  }, [date])

  
  const modal = useModal(MUSCLEGROUPS);
  const muscles = useSuggested(getMuscles(modal.selected));
  const appendMuscle = (muscle: string) => {
    setFocusOn('target')
    if (muscles.appendSuggestion(muscle))
      append({ targetMuscle: muscle })
  }
  const removeMuscle = (muscle: string, index:number) => {
    setFocusOn('')
    if (muscles.removeSuggestion(muscle))
      remove(index);
  }
  
  useEffect(() => {
    muscles.setNewSuggestions(getMuscles(modal.selected))
  }, [modal.selected])

  const onSubmitForm = (data: any) => {
    setInActiveWorkout(true);
    setWorkout(getValues('workoutName') );
    setWorkoutDate(getValues('workoutDate'))
    setTargetMuscles(muscles.selectedSuggestions)
    router.push('/screens/tabs/_navigator')
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerBackVisible: true,
          title: 'New Workout'
        }}
      />
      <ScrollView style={[styles.modalContainer]}>
        <View style={styles.containerWrapper}>
          <View style={styles.widgetHeader}>
            <Text style={styles.h2}>Set Details</Text>
          </View>
          
          <View style={form.element}>
            <Text style={form.elementHeader}>Name: </Text>
            {errors.workoutName && <Text style={[styles.p, { color: colors.red }]}>This is required.</Text>}
            <View style={[form.formTextArea, (focusOn === 'name') && styles.focusedInput, styles.flexRowLeft]}>
            <MaterialCommunityIcons name="dumbbell" size={24} color={colors.yellow} style={{paddingRight:7}} />
            <Controller
              name="workoutName"
              control={control}
              rules={{required:false}}
              render={({ field: { onChange, onBlur, value } }) => (

                <TextInput
                  style={{color: colors.lighter, flexGrow:1}}
                  onFocus={() => changeFocus('name')}
                  onBlur={() => changeFocus('')}
                  onChangeText={onChange}
                  value={value}
                  placeholder={"Name your Workout"}
                  placeholderTextColor={"rgba(255, 255, 255, 0.54)"}
                />                
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
          
          <View style={form.element}>
            <View style={styles.flexRow}>
              <Text style={form.elementHeader}>Target Muscles: <Text style={styles.p}>(optional)</Text></Text>
              <ModalButton onPress={() => modal.toggleOpen()} text={modal.selected} />
            </View>
            <Controller
              name="targetMuscles"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={[form.formTextArea, (focusOn === 'target') && styles.focusedInput]}>
                  <FlatList
                    horizontal={true}
                    data={value}
                    keyExtractor={(item => item["targetMuscle"])}
                    renderItem={({ item, index }) =>
                      <TouchableOpacity
                        style={styles.suggestion}
                        onPress={() => removeMuscle(item["targetMuscle"], index)}
                      >
                        <Text style={[styles.p, { paddingRight: 1.5 }]}>{item["targetMuscle"]}</Text>
                        <SimpleLineIcons  name="close" size={12} color={colors.lighter} />
                      </TouchableOpacity>
                    }
                  />
                </View>
              )}
            />
            <FlatList 
              horizontal
              data={muscles.unselectedSuggestions}
              renderItem={({ item }) => <Bubble textStyle={[styles.p, {padding: 1.5}]} name={item.replace(/_/g, " ")} onPress={() => appendMuscle(item)} />}
              keyExtractor={item => item}
              style={{margin:0}}
            />    
          </View>
          {/*Submit Button */}
          <TouchableOpacity style={form.submitContainer} onPress={handleSubmit(onSubmitForm)}>
            <Text style={[styles.h3, {lineHeight:28}]}>Start Logging</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {modal.modalOpen &&
        <BottomModal
          onSelectionPress={(i) => modal.changeIndex(i)}
          onExitPress={() => modal.toggleOpen()}
          title={"Set Primary Muscle"}
          selections={modal.selections}
        />
      }
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
  }
})
export default Workout;