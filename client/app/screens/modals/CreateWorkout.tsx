
// import React, { FunctionComponent, useState, useContext, useEffect, useMemo } from 'react'
// import { Stack, useRouter } from 'expo-router';
// import { View, Text, TouchableOpacity, TextInput, FlatList, StyleSheet, ScrollView, TextStyle, StyleProp, Pressable, Switch } from 'react-native';
// import colors from '../../colors';
// import styles from "../../style";
// import { Bubble } from '../../components/Bubble';
// import { DatePicker } from '../../components/DatePicker';
// import { Controller, useFieldArray, useForm, useFormContext, useWatch } from 'react-hook-form';
// import { SimpleLineIcons  } from '@expo/vector-icons'; 
// import { useSuggested } from '../../hooks/useSuggestions';
// import { useSelectionModal } from '../../hooks/useSelectionModal';
// import BottomModal, { ModalButton } from '../../components/smallModal';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import useDate from '../../hooks/useDate';
// import { useMutation, useQuery } from 'react-query';
// import { doCreateWorkout, doFetchMuscleMap } from '../../api';
// import { WorkoutIcon } from '../../_layout';

// export const Workout: FunctionComponent = () => {
//   const router = useRouter();

//   // Handle Form Stuff
//   const [focusOn, setFocusOn] = useState('');
//   const changeFocus = (to: string) => setFocusOn(to);
//   const { control, handleSubmit, setValue, formState: { errors } } = useForm({
//     defaultValues: {
//       workoutName: '',
//       workoutDate: new Date(),
//       targetMuscles: [],
//       makeActive: true
//     }
//   });

//   const { remove, append } = useFieldArray<any>({ 
//     name: "targetMuscles",
//     control
//   });

//   const [date, setDate] = useDate(setValue);

//   // Handle fetching and managing state of the muscle suggestions
//   const [updateMuscles, setUpdateMuscles] = useState(false);  
//   const { data, error, isLoading } = useQuery('muscles', doFetchMuscleMap, {
//     onSuccess: () => {
//       setUpdateMuscles(true)
//     }
//   })

//   const buildMuscleMapFromJson = (jsonData: any) => {
//     if (!data)
//       return {}
//     const musclesData = jsonData.muscles;
//     const map: any = {};
//     if (!musclesData) {
//       return map;
//     }
//     musclesData.forEach((m: any) => {
//       const groupName = m.group.name;
//       const muscleName = m.name;

//       // If the group name does not exist, create it and add muscle name to group
//       if (!map[groupName]) {
//         map[groupName] = [];
//       }
//       map[groupName].push(muscleName);

//     });
    
//     return map;
//   };

//   // A map of muscle group names to list of muscles per group name
//   const muscleMap = buildMuscleMapFromJson(data);
//   // This selection modal will be a modal for choosing which group name to show
//   const selectionModal = useSelectionModal(Object.keys(muscleMap));
//   // This will represent the selected group
//   const selectedGroup = selectionModal.selected;
//   // This will represent the list of selected muscles
//   const suggestions = muscleMap[selectedGroup] != null ? muscleMap[selectedGroup] : []
//   // The suggested muscles determined by the current group shown
//   const suggestedMuscles = useSuggested(suggestions);
  
//   // Updates the selection modal when muscleMap is changed (fetched)
//   useEffect(() => {
//     const groupIndex = selectedGroup ? selectionModal.getIndex(selectedGroup) : 0;
//     selectionModal.changeIndex(groupIndex)
//   }, [updateMuscles])

//   // Updates the suggestions when selection modal changes
//   useEffect(() => {
//     suggestedMuscles.setNewSuggestions(suggestions);
//   }, [selectedGroup])

//   const appendMuscle = (muscle: string) => {
//     if (suggestedMuscles.appendSuggestion(muscle)){
//       append({ targetMuscle: muscle })
//       setFocusOn('targetMuscles')
//     }
//   }
//   const removeMuscle = (muscle: string, index:number) => {
//     if (suggestedMuscles.removeSuggestion(muscle)){
//       remove(index);
//       setFocusOn('');
//     }
//   }

//   const [errorMessage, setErrorMessage] = useState();
//   // Submit Functionality
//   const submitMutation = useMutation(doCreateWorkout, {
//     onSuccess: () => {
//       router.push('/screens/tabs/_navigator');
//     },

//     onError: (error:any) => {
//       setErrorMessage(error.response.data.error)
//     }
//   })

//   const onSubmitForm = (data: any) => {
//     const workoutName = data.workoutName;
//     const workoutDate = data.workoutDate;
//     const targetMuscles = data.targetMuscles.map((muscle: any) => muscle['targetMuscle']);
//     const isActiveWorkout = data.makeActive;

//     const workoutData = {
//       name: workoutName,
//       date: workoutDate,
//       target_muscles: targetMuscles,
//       is_active: isActiveWorkout
//     };

//     submitMutation.mutate(workoutData);
//   }

//   if (isLoading) {
//     return <View><Text>Loading...</Text></View>;
//   }

//   if (error) {
//     console.error('Error fetching workout data:', error);
//     return <View><Text>Error loading data</Text></View>;
//   }

//   return (
//     <>
//       <Stack.Screen
//         options={{
//           headerBackVisible: true,
//           title: 'New Workout',
//           headerRight: () => <WorkoutIcon enabled={false}/>

//         }}
//       />
//       <ScrollView style={[styles.modalContainer]}>
//         <View style={styles.containerWrapper}>
//           { errorMessage &&
//             <View>
//               <Text style={{paddingTop:14, color:colors.red}}>{errorMessage}</Text>
//             </View>
//           }
//           <View style={styles.widgetHeader}>
//             <Text style={styles.h2}>Workout Details</Text>
//           </View>
//           <View style={form.element}>
//             <Text style={form.elementHeader}>Name: </Text>
//             {/* FIGURE OUT WHAT THIS IS DOING {errors.workoutName && <Text style={[styles.p, { color: colors.red }]}>This is required.</Text>} */}
//             <View style={[form.formTextArea, (focusOn === 'name') && styles.focusedInput, styles.flexRowLeft]}>
//             <MaterialCommunityIcons name="dumbbell" size={24} color={colors.yellow} style={{paddingRight:7}} />
//               <Controller
//                 name="workoutName"
//                 control={control}
//                 rules={{ required: false }}
//                 render={({ field: { onChange, onBlur, value } }) => (
//                   <TextInput
//                     style={{ color: colors.lighter, flexGrow: 1 }}
//                     onFocus={() => changeFocus('name')}
//                     onBlur={() => changeFocus('')}
//                     onChangeText={onChange}
//                     value={value}
//                     placeholder={"Name your Workout"}
//                     placeholderTextColor={"rgba(255, 255, 255, 0.54)"}
//                   />
//                 )}
//               />
//             </View>
//           </View>

//           <View style={form.element} >
//             <Text style={form.elementHeader}>Date: </Text>
//             <View style={[form.formTextArea, (focusOn === 'date') && styles.focusedInput, { justifyContent: "center" }]} >
//               <DatePicker parentDate={setDate} editable={true} focused={(is) => is ? changeFocus('date') : changeFocus('')}/>
//             </View>
//           </View>
          
//           <Controller
//             name="targetMuscles"
//             control={control}
//             render={({ field: { onChange, onBlur, value } }) => (
//               <View style={[form.element, { paddingBottom: 0 }]}>
//                 <View style={styles.flexRow}>
//                   <Text style={form.elementHeader}>Target Muscles: <Text style={styles.p}>(optional)</Text></Text>
//                   <ModalButton onPress={() => selectionModal.toggleOpen()} text={selectionModal.selected} showing={selectionModal.modalOpen}/>
//                 </View>

//                 <View style={[form.formTextArea, (focusOn === 'targetMuscles') && styles.focusedInput]}>
//                   <FlatList
//                     horizontal={true}
//                     data={value}
//                     keyExtractor={(item => item["targetMuscle"])}
//                     renderItem={({ item, index }) =>
//                       <TouchableOpacity
//                         style={styles.suggestion}
//                         onPress={() => removeMuscle(item["targetMuscle"], index)}
//                       >
//                         <Text style={[styles.p, { paddingRight: 1.5 }]}>{item["targetMuscle"]}</Text>
//                         <SimpleLineIcons name="close" size={12} color={colors.lighter} />
//                       </TouchableOpacity>
//                     }
//                   />
//                 </View>
//                 <FlatList
//                   horizontal
//                   data={suggestedMuscles.unselectedSuggestions}
//                   renderItem={({ item }) => <Bubble textStyle={[styles.p, { padding: 1.5 }]} name={item.replace(/_/g, " ")} onPress={() => appendMuscle(item)} />}
//                   keyExtractor={item => item}
//                   style={{ margin: 0 }}
//                 />
//               </View>
//             )}
//           />

//           <View style={[styles.flexRow, form.toggleActiveArea]}>
//             <Text style={[form.elementHeader, { paddingBottom: 0 }]}>Make Active Workout</Text>
//             <Controller
//               name="makeActive"
//               control={control}
//               rules={{ required: false }}
//               render={({ field: { onChange, onBlur, value } }) => (
//                 <Switch
//                   onValueChange={onChange}
//                   value={value}
//                 />
//               )}
//             />
//           </View>

//           {/*Submit Button */}
//           <TouchableOpacity style={form.submitContainer} onPress={handleSubmit(onSubmitForm)}>
//             <Text style={[styles.h3, {lineHeight:28}]}>Start Logging</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

//       {selectionModal.modalOpen &&
//         <BottomModal
//           onSelectionPress={(i) => selectionModal.changeIndex(i)}
//           onExitPress={() => selectionModal.toggleOpen()}
//           title={"Set Primary Muscle"}
//           selections={selectionModal.selections}
//         />
//       }
//     </>
//   )
// }
// const form = StyleSheet.create({
//   submitContainer: {
//     alignItems: 'center',
//     backgroundColor: colors.primary,
//     borderRadius: 50,
//     paddingVertical: 14,
//   },
//   element: {
//     paddingBottom: 14
//   },
//   elementHeader: {
//     ...styles.h4,
//     paddingBottom: 7,
//     color: colors.white
//   },
//   formTextArea: {
//     color: colors.lighter,
//     minHeight: 48,
//     paddingHorizontal: 7,
//     borderColor: colors.primary,
//     borderWidth:1,
//     borderRadius: 7,
//   },
//   suggestion: {
//     backgroundColor: colors.primary,
//     borderRadius: 7,
//     paddingHorizontal: 7,
//     margin: 1.5,
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexDirection: 'row'
//   },
//   toggleActiveArea: {
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginRight: 1.5,
//     paddingBottom: 14
//   }
// })
// export default Workout;