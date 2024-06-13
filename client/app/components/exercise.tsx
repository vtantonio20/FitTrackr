// import React, { FunctionComponent, useEffect, useState } from 'react'
// import { View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList } from 'react-native'
// import colors from '../colors'
// import styles from "../style";
// import { MaterialIcons, Feather, Entypo , AntDesign, FontAwesome} from '@expo/vector-icons'; 
// import { Controller, useFieldArray, useForm } from 'react-hook-form';
// import BottomModal, { ModalButton } from './smallModal';
// import { useSelectionModal } from '../hooks/useSelectionModal';
// import { SimpleLineIcons  } from '@expo/vector-icons'; 
// import { useSuggested } from '../hooks/useSuggestions';
// import DraggableFlatList from 'react-native-draggable-flatlist'

// type WorkoutSet = {
//   set: number;
//   reps:string;
// }
// export const Set = () => {
//   const [setNumber, setSetNumber] = useState();
//   const data = ['set1', 'set2', 'set3'];
//   return (
//     <DraggableFlatList
//       data={data}
//       keyExtractor={(item) => item}
//       renderItem={ () => {
//         return <Text>data</Text>;
//       }
//       }
//     />
//   );
// }
// interface ExerciseProps {
//   name: string;
//   sets:WorkoutSet[];
//   weight: number;
// }
// export const AddExercise = () => {
//   const [inForm, setInForm] = useState(false);
//   const { control, handleSubmit, setValue, getValues ,formState: { errors } } = useForm({
//     defaultValues: {
//       exerciseName: '',
//       sets: [],
//       weight: 0,
//     }
//   });
//   const { remove, append } = useFieldArray<any>({ name: "sets", control });
//   const modal = useSelectionModal(WORKOUTGROUPS);
//   const suggestions = useSuggested(getWorkouts(modal.selected));

//   useEffect(() => {
//     suggestions.setNewSuggestions(getWorkouts(modal.selected))
//   }, [modal.selected])

//   const addSuggestion = (suggestion: string) => {
//     setValue("exerciseName", suggestion)
//   }

//   const [isFocused, setIsFocused] = useState(false);
//   const onFocus = () => {
//     setIsFocused(!isFocused)
//   }
//   return (
//     <>
//       {!inForm ?
        
//         <TouchableOpacity style={styles.widgetBody} onPress={() => setInForm(true)}>
//           <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 14, }}>
//             <Text style={[styles.h4, { lineHeight: 28 }]}>Add Exercise</Text>
//             <AntDesign name="plus" size={28} color={colors.yellow} />
//           </View> 
//           {/*
//           <View style={styles.flexRowLeft}>
//             <AntDesign name="plus" size={28} color={colors.yellow} />
//             <Text style={[form.elementHeader, { paddingLeft: 7, lineHeight: 28 }]}> Add new Workout </Text>
//           </View>
//           */}
//         </TouchableOpacity>
//         :
//         <View>
//           <View style={[styles.widgetHeader, {marginVertical:0,paddingBottom:7}]}>
//               <Text style={form.elementHeader}>Name: </Text>
//               <ModalButton onPress={() => modal.toggleOpen()} text={modal.selected} />
//           </View>
            
//           <View >
//             <Controller
//               name="exerciseName"
//               control={control}
//               rules={{ required: true }}
//               render={({ field: { onChange, onBlur, value } }) => (
//                 <TextInput
//                   style={[form.formTextArea, isFocused && form.focusedInput]}
//                   onChangeText={onChange}
//                   value={value}
//                   placeholder={'Name of Exercise'}
//                   onBlur={onFocus}
//                   onChange={onChange}
//                   onFocus={onFocus}
//                 />
//               )}
//             />
//             <FlatList
//               horizontal={true}
//               data={suggestions.unselectedSuggestions}
//               renderItem={({ item, index }) =>
//                 <TouchableOpacity 
//                     style={form.suggestion}
//                     onPress={() => {addSuggestion(item)}}
//                   >
//                     <Text style={[styles.p, { paddingRight: 1.5 }]}>{item}</Text>
//                 </TouchableOpacity>
//             }
//             />
//           </View>

//         </View>
//       }
//       {modal.modalOpen &&
//         <BottomModal
//           onSelectionPress={(i) => modal.changeIndex(i)}
//           onExitPress={() => modal.toggleOpen()}
//           title={"Set Primary Muscle"}
//           selections={modal.selections}
//         />
//       }
//     </>

//   );
// }


// export const Exercise = (props:ExerciseProps) => {
// //  const [inExercise, setInExercise] = useState(props.active ? true : false);


//   return (
//     <>

//     </>

//     );



// }

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
//     ...styles.h4,
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
//     padding: 7,
//     margin: 1.5,
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexDirection: 'row'
//   }
// })