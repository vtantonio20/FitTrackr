// import React, { FunctionComponent, Ref, useContext, useEffect, useRef, useState } from 'react'
// import { View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList, ScrollView } from 'react-native'
// import colors from '../../colors'
// import styles from "../../style";
// import { MaterialIcons, Feather, Entypo , AntDesign, Ionicons} from '@expo/vector-icons'; 
// import { Controller, useFieldArray, useForm } from 'react-hook-form';
// import BottomModal, { ModalButton } from '../../components/smallModal';
// import { useSelectionModal } from '../../hooks/useSelectionModal';
// import { SimpleLineIcons  } from '@expo/vector-icons'; 
// import { useSuggested } from '../../hooks/useSuggestions';
// import { getWorkouts, WORKOUTGROUPS } from '../../static/workouts';
// import DraggableFlatList, { DragEndParams, ScaleDecorator } from 'react-native-draggable-flatlist'
// import { Stack, useRouter } from 'expo-router';
// import { dateToDDMMYY, dateToWD } from '../../utilities';


// const useSets = (initial:Set[]) => {
//   const [sets, setSets] = useState<Set[]>(initial);
//   const handleSetDrag = (data: any) => setSets(data.data);
//   const getSetNum = (index: number|undefined) => {
//     return index ? index + 1 : 1
//   }
//   const addNewSet = () => {
//     const lastSet = sets[sets.length - 1];
//     const newSet = [{
//       setNum: sets.length,
//       reps: lastSet?.reps ?? '',
//       weight: lastSet?.weight ?? ''
//     }];
//     setSets([...sets, ...newSet]);
//   }
//   const removeSet = (index: number | undefined) => {
//     const temp:Set[] = [...sets];
//     temp.splice(index || 0, 1);
//     setSets(temp);
//   }

//   const onRepsChange = (val: string, index: number | undefined) => {
//     sets[index || 0].reps = val;
//   }
//   const onWeightChange = (val: string, index: number | undefined) => {
//     sets[index || 0].weight = val;
//   }
//   return {
//     sets,
//     handleSetDrag,
//     getSetNum,
//     addNewSet,
//     removeSet,
//     onRepsChange,
//     onWeightChange,
//   }
// }

// interface SetListProps {
//   sets: Set[];
//   onSubmit: (val:Set[]) => void;
// }

// export const SetList: FunctionComponent<SetListProps> = (props: SetListProps) => {
//   const [sets, setSets] = useState<Set[]>(props.sets);
//   const handleSetDrag = (data: any) => setSets(data.data);
//   const getSetNum = (index: number|undefined) => {
//     return index ? index + 1 : 1
//   }
//   const addNewSet = () => {
//     const lastSet = sets[sets.length - 1];
//     const newSet = [{
//       setNum: sets.length,
//       reps: lastSet?.reps ?? '',
//       weight: lastSet?.weight ?? ''
//     }];
//     setSets([...sets, ...newSet]);
//   }
//   const removeSet = (index: number | undefined) => {
//     const temp:Set[] = [...sets];
//     temp.splice(index || 0, 1);
//     setSets(temp);
//   }

//   const onRepsChange = (val: string, index: number | undefined) => {
//     sets[index || 0].reps = val;
//   }
//   const onWeightChange = (val: string, index: number | undefined) => {
//     sets[index || 0].weight = val;
//   }
//   const handleSubmit = () => {
//     props.onSubmit(sets)
//   }
//   return (
//     <View style={{marginVertical:14}}>
//       { sets.length != 0 &&
//         <View style={{ flexDirection: 'row', paddingHorizontal: 7, paddingBottom:14 }}>
//           <Text style={[styles.h3a, { width: '25%' }]}>Set</Text>
//           <Text style={[styles.h3a, { width: '33%' }]}>Reps</Text>
//           <Text style={[styles.h3a, { width: '33%' }]}>Weight (Ibs)</Text>
//         </View>
//       }
//       <DraggableFlatList
//         scrollEnabled={false}
//         data={sets}
//         keyExtractor={(item) => (item.setNum.toString())}
//         onDragEnd={(data) => {handleSetDrag(data as any)}}
//         renderItem={(item) => {
//           return (
//             <ScaleDecorator>
//               <TouchableOpacity
//                 onLongPress={item.drag} disabled={item.isActive}
//                 style={{
//                   flexDirection: 'row', backgroundColor: colors.primary, padding: 10.5, borderBottomWidth:1, borderBottomColor: colors.darker,
//                   borderTopLeftRadius: (item.getIndex() === 0) ? 7 : 0,
//                   borderTopRightRadius: (item.getIndex() === 0) ? 7 : 0,
//                 }}>
//                 <Text style={[styles.h4, styles.lighterFont, { width: '25%', alignSelf: 'center', padding:7 }]}>{getSetNum(item.getIndex())}</Text>
//                 <View style={{ width: '33%', flexDirection:'row', alignItems: 'center', }}>
//                   <TextInput style={[styles.h4, styles.lighterFont, { padding: 7,  backgroundColor:colors.darker,  minWidth:40, borderRadius:7}]}
//                     defaultValue={item.item.reps}
//                     keyboardType='numeric'
//                     returnKeyLabel='Done'
//                     returnKeyType='done'
//                     onChangeText={newReps => onRepsChange(newReps, item.getIndex())}
//                   />
//                 </View>
//                 <View style={{ width: '33%', flexDirection:'row', alignItems: 'center' }}>
//                   <TextInput style={[styles.h4, styles.lighterFont, { padding: 7,  backgroundColor:colors.darker, minWidth:50, borderRadius:7}]}
//                     defaultValue={item.item.weight}
//                     keyboardType='number-pad'
//                     returnKeyLabel='Done'
//                     returnKeyType='done'
//                     onChangeText={newWeight => onWeightChange(newWeight, item.getIndex())}
//                   />
//                 </View>
//                 <TouchableOpacity onPress={() => removeSet(item.getIndex())} style={{ alignItems: 'flex-end', justifyContent: 'center'}} >
//                   <AntDesign name="delete" size={24} color={colors.lighter} />
//                 </TouchableOpacity>
//               </TouchableOpacity>  
//             </ScaleDecorator>
//           );
//         }}
//       />
//       <TouchableOpacity onPress={() => addNewSet()} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 14, backgroundColor:colors.primary, borderBottomRightRadius:7, borderBottomLeftRadius:7, borderRadius: sets.length === 0 ? 7 : 0 }}>
//         <Text style={[styles.h4, { lineHeight: 28 }]}>Add new set</Text>
//         <AntDesign name="plus" size={28} color={colors.yellow} />
//       </TouchableOpacity> 
//       {sets.length != 0 &&
//         <TouchableOpacity style={[form.submitContainer, {marginTop:14}]} onPress={handleSubmit}>
//           <Text style={[styles.h3, {lineHeight:28}]}>Save Changes</Text>
//         </TouchableOpacity>
//       }
//     </View>
//   );
// }

// const AddExercise = () => {
//   const router = useRouter();
//   //const sets: Set[] = [{setNum:0, reps:'', weight:''}]
//   const { workoutName, workoutDate, exercises, setExercises } = useContext(WorkoutContext);
//   const { control, handleSubmit, setValue, getValues, formState: { errors } } = useForm({defaultValues: { exerciseName: ''}});

//   const modal = useModal(WORKOUTGROUPS);
//   const suggestions = useSuggested(getWorkouts(modal.selectedGroup));

//   const [isFocused, setIsFocused] = useState(false);
//   const onFocus = () => setIsFocused(!isFocused);

//   const addSuggestion = (suggestion: string) => {
//     setValue("exerciseName", suggestion)
//   }

//   useEffect(() => {
//     suggestions.setNewSuggestions(getWorkouts(modal.selectedGroup))
//   }, [modal.selectedGroup])

//   const sets:Set[] = ([{setNum:0, reps:'', weight:''}]);
//   const onSubmitForm = (inputSets: Set[]) => {
//     setExercises([
//       ...(exercises || []),
//       {
//         exerciseName: getValues('exerciseName'),
//         sets: inputSets,
//       }
//     ]);
//     router.push('/screens/modals/log')
//   }

//   return (
//     <>
//       <Stack.Screen
//         options={{
//           headerBackVisible: true,
//           title: workoutName
//         }}
//       />

//       <ScrollView style={[styles.modalContainer]}>
//         <View style={styles.containerWrapper}>
//           <View style={styles.widgetHeader}>
//             <Text style={styles.h3}>{workoutDate && dateToWD(workoutDate)}'s Session</Text>
//             <Text style={[styles.h4, styles.lighterFont]}>{workoutDate && dateToDDMMYY(workoutDate)}</Text>
//           </View>
        
//           <View style={[styles.widgetHeader, {marginVertical:0,paddingBottom:7}]}>
//               <Text style={form.elementHeader}>Name: </Text>
//               <ModalButton onPress={() => modal.toggleOpen()} text={modal.selectedGroup} />
//           </View>
            
//           <Controller
//             name="exerciseName"
//             control={control}
//             rules={{required:true}}
//             render={({ field: { onChange, onBlur, value } }) => (
//               <TextInput
//                 style={[form.formTextArea, isFocused && form.focusedInput]}
//                 onChangeText={onChange}
//                 value={value}
//                 placeholder={'Name of Exercise'}
//                 onBlur={onFocus}
//                 onChange={onChange}
//                 onFocus={onFocus}
//               />
//             )}
//           />
//           <FlatList
//             horizontal={true}
//             data={suggestions.unselectedSuggestions}
//             renderItem={({ item, index }) => (
//               <TouchableOpacity style={form.suggestion} onPress={() => {addSuggestion(item)}}>
//                   <Text style={[styles.p, { paddingRight: 1.5 }]}>{item}</Text>
//               </TouchableOpacity>
//             )}
//           />
//           <SetList sets={sets} onSubmit={onSubmitForm}/>
//           {modal.modalOpen &&
//             <BottomModal
//               onSelectionPress={(i) => modal.changeIndex(i)}
//               onExitPress={() => modal.toggleOpen()}
//               title={"Set Primary Muscle"}
//               selections={modal.selections}
//             />
//           }
//         </View>
//       </ScrollView>

//     </>
//   );
// }

// export default AddExercise;
// const form = StyleSheet.create({
//   imageContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: colors.primary,
//     borderRadius: 7,
//     padding:14,
//   },
//   focusedInput: {
//     borderColor: 'rgba(255, 255, 10, 0.1)',
//   },
//   submitContainer: {
//     alignItems: 'center',
//     backgroundColor: colors.primary,
//     borderRadius: 50,
//     paddingVertical: 14,
//   },
//   element: {
//     paddingBottom:7
//   },
//   elementHeader: {
//     ...styles.h3a,
//     color: colors.white,
//   },
//   formTextArea: {
//     color: colors.lighter,
//     height: 48,
//     paddingHorizontal: 7,
//     borderColor: colors.primary,
//     borderWidth:1,
//     borderRadius: 7,
//     marginBottom:7
//   },
//   widget: {
//     padding:7,
//     backgroundColor: colors.primary,
//     borderRadius: 7,
//     marginBottom:14
//   },
//   suggestion: {
//     backgroundColor: colors.primary,
//     borderRadius: 7,
//     padding: 14,
//     margin: 1.5,
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexDirection: 'row'
//   }
// })