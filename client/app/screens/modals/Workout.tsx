// import { useLocalSearchParams, useRouter } from "expo-router";
// import { Workout, useWorkoutData } from "../../queries/WorkoutQueries";
// import { useState } from "react";
// import { useFieldArray, useForm } from "react-hook-form";
// import useDate from "../../hooks/useDate";
// import { useMuscleSuggestionData } from "../../queries/SuggestionQueries";

// const Workout = () => {
//     const router = useRouter();
//     const { workoutId } =  useLocalSearchParams();
//     const workoutData = useWorkoutData(workoutId);
//     const workout = workoutData.workout;


//     // Handle Form Stuff
//     const [focusOn, setFocusOn] = useState('');
//     const changeFocus = (to: string) => setFocusOn(to);
//     const { control, handleSubmit, setValue, formState: { errors } } = useForm({
//         defaultValues: {
//             workoutName: '',
//             workoutDate: new Date(),
//             targetMuscles: [],
//             makeActive: true
//         }
//     });

//     const { remove, append } = useFieldArray<any>({ 
//         name: "targetMuscles",
//         control
//     });
    
//     const [date, setDate] = useDate(setValue);

//     const muscleSuggestions = useMuscleSuggestionData();
//     const muscleMap = muscleSuggestions.muscleMap;


//     const onSubmitForm = (data: Workout) => {

//     }
    
//     //   if (isLoading) {
//     //     return <View><Text>Loading...</Text></View>;
//     //   }
    
//     //   if (error) {
//     //     console.error('Error fetching workout data:', error);
//     //     return <View><Text>Error loading data</Text></View>;
//     // }
// }