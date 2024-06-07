import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import colors from '../../colors';
import styles from "../../style";
import { dateToDDMMYY, dateToWD, dateToWDDDMMYY } from '../../utilities';
import { MaterialIcons, Feather, Entypo , AntDesign, FontAwesome} from '@expo/vector-icons'; 
import { useQuery } from 'react-query';
import { fetchWorkoutData } from '../../api';

const Log = () => {
  const { data, error, isLoading } = useQuery('workouts', fetchWorkoutData)
  const router = useRouter();

  if (isLoading) {
    return <View><Text>Loading...</Text></View>;
  }

  if (error) {
    console.error('Error fetching workout data:', error);
    return <View><Text>Error loading data</Text></View>;
  }

  const activeWorkout = data.active_workout ? {
    workoutName: data.active_workout.name,
    workoutDate: new Date(data.active_workout.date),
    targetMuscles: data.active_workout.target_muscles.map((muscle: any) => muscle.name),
    isActive: data.active_workout.is_active,
    id: data.active_workout.id,
  } : {};

  const handleNewExercisePress = () => {
    router.push('/screens/modals/Exercise')
  }
  
  return (
    <>
      <Stack.Screen
        options={{
          headerBackVisible: true,
          title: activeWorkout.workoutName
        }}
      />
      <ScrollView style={[styles.modalContainer]}>
        <View style={styles.containerWrapper}>
          <View style={styles.widgetHeader}>
            <Text style={styles.h3}>{activeWorkout.workoutDate && dateToWD(activeWorkout.workoutDate)}'s Session</Text>
            <Text style={[styles.h4, styles.lighterFont]}>{activeWorkout.workoutDate && dateToDDMMYY(activeWorkout.workoutDate)}</Text>
          </View>
          {/*<Exercise name='squats' sets='4' reps=''/>*/} 
          {/* <AddExercise/> */}
          <TouchableOpacity style={styles.widgetBody} onPress={handleNewExercisePress}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 14, }}>
              <Text style={[styles.h4, { lineHeight: 28 }]}>Add Exercise</Text>
              <AntDesign name="plus" size={28} color={colors.yellow} />
            </View> 
          </TouchableOpacity>

          <View style={styles.widgetHeader}>
            <TouchableOpacity style={form.imageContainer}>
              {/* <MuscleMap width={150} height={150}  {...muscleMapSvg} /> */}
            </TouchableOpacity>
          </View>



        </View>
      </ScrollView>
    </>
  )
}


const form = StyleSheet.create({
  container: {
    paddingVertical:7,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7,
    borderColor: colors.primary,
    borderWidth: 1,
    padding:14,
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
    ...styles.h4,
    color: colors.white,
  },
  formTextArea: {
    color: colors.lighter,
    height: 36,
    paddingHorizontal: 7,
    borderColor: colors.primary,
    borderWidth:1,
    borderRadius: 7,
  },
  widget: {
    padding:7,
    borderColor: colors.primary,
    borderWidth:1,
    borderRadius: 7,
    marginBottom:14
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
export default Log;