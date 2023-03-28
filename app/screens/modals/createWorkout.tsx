
import React, { FunctionComponent, useState, useContext, useEffect, useMemo } from 'react'
import { Stack, useNavigation, useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, TextInput, FlatList, StyleSheet, ScrollView, TextStyle, StyleProp, Pressable } from 'react-native';
import colors from '../../colors';
import styles from "../../style";
import { dateToDDMMYY, MUSCLEGROUPS, MUSCLEMAP } from '../../utilities';
import { WorkoutContext } from '../../contexts/workoutContext';
import { Bubble } from '../../components/bubbleButton';
import { DatePicker } from '../../components/datePicker';
import { Controller, useFieldArray, useForm, useFormContext, useWatch } from 'react-hook-form';
import { SimpleLineIcons  } from '@expo/vector-icons'; 


export const Workout: FunctionComponent = () => {
  const router = useRouter();
  const { setInActiveWorkout, setWorkout, setWorkoutDate, setTargetMuscles } = useContext(WorkoutContext);
  const { control, handleSubmit, setValue, getValues ,formState: { errors } } = useForm({
    defaultValues: {
      workoutName: '',
      workoutDate: new Date(),
      targetMuscles: [],
    }
  });
  const { remove, append } = useFieldArray<any>({
    name: "targetMuscles",
    control
  });

  const [inputDate, setInputDate] = useState<Date>();
  useEffect(() => {
    setValue("workoutDate", inputDate || new Date());
  }, [inputDate])

  const [suggestedMuscles, setSuggestedMuscles] = useState(MUSCLEGROUPS);
  const [inputMuscles, setInputMuscles] = useState<Set<string>>(new Set());
  const appendMuscle = (muscle: string) => {
    if (!inputMuscles.has(muscle)) {
      append({ targetMuscle: muscle });
      const temp = new Set(inputMuscles);
      temp.add(muscle)
      setInputMuscles(temp);
      setUpdateSuggestions(true);
    }
  }
  const removeMuscle = (muscle: string, index:number) => {
    if (inputMuscles.has(muscle)) {
      remove(index);
      const temp = new Set(inputMuscles);
      temp.delete(muscle)
      setInputMuscles(temp);
      setUpdateSuggestions(true);
    }
  }
  const [updatedSuggestions, setUpdateSuggestions] = React.useState<boolean>(false)
  useEffect(() => {
    const set1 = new Set(MUSCLEGROUPS);
    const set2 = new Set(inputMuscles);
    const combinedArray = [...new Set([...set1, ...set2].filter(value => !set1.has(value) || !set2.has(value)))];
    setSuggestedMuscles(combinedArray);
    setUpdateSuggestions(false);
  }, [updatedSuggestions])
  
  const onSubmitForm = (data: any) => {
    setInActiveWorkout(true);
    setWorkout(getValues('workoutName'));
    setWorkoutDate(getValues('workoutDate'))
    setTargetMuscles([...inputMuscles])
    router.push('/screens/tabs/_navigator')
  };
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
            <Text style={styles.h3}>Set Details</Text>
          </View>
          
          <View style={form.element}>
            <Text style={form.elementHeader}>Workout Name: </Text>
            {errors.workoutName && <Text style={[styles.p, {color:colors.red}]}>This is required.</Text>}

            <Controller
              control={control}
              rules={{required:true}}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={form.formTextArea}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="workoutName"
            />
          </View>

          <View style={form.element}>
            <Text style={form.elementHeader}>Workout Date: </Text>
            <DatePicker parentDate={setInputDate} editable={true} />
          </View>
          
          <View style={form.element}>
            <Text style={form.elementHeader}>Target Muscles: <Text style={styles.p}>(optional)</Text></Text>
            <Controller
              name="targetMuscles"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={[form.formTextArea, {paddingHorizontal:0}]}>
                  <FlatList
                    horizontal={true}
                    data={value}
                    keyExtractor={(item => item["targetMuscle"])}
                    renderItem={({ item, index }) =>
                      <TouchableOpacity
                        style={form.suggestion}
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
              data={[...suggestedMuscles]}
              renderItem={({ item }) => <Bubble textStyle={[styles.p, {padding: 1.5}]} name={item} onPress={() => appendMuscle(item)} />}
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
    paddingBottom:7
  },
  elementHeader: {
    ...styles.h4,
    paddingBottom: 7,
    color: colors.white
  },
  formTextArea: {
    color: colors.lighter,
    height: 36,
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