import React, { FunctionComponent, useContext, useState, useMemo, useEffect } from 'react'
import { Modal, Image, View, Text, StyleSheet, TouchableOpacity, GestureResponderEvent, Platform, TouchableHighlight, ScrollView } from 'react-native'
import colors from '../../colors';
import styles from "../../style"
import { MaterialIcons, Feather, Entypo , AntDesign, FontAwesome} from '@expo/vector-icons'; 
import { useRouter } from 'expo-router';
import { dateToDDMMYY, dateToWD, fakeData } from '../../utilities';
import  BottomModal, { ModalButton }  from '../../components/smallModal';
import MuscleMap from '../../assets/svgs/muscleMap.svg'
import { useSelectionModal } from '../../hooks/useSelectionModal';
import axios from 'axios';
import { API_URL } from '../../config';
import useWorkout from '../../hooks/useWorkout';


const Home: FunctionComponent = () => {
  const [activeWorkout, setActiveWorkout] = useState({})
  const [inactiveWorkouts, setInactiveWorkouts] = useState([])

  useEffect(() => {
    const fetchWorkoutData = async () => {
      try {
        const response = await axios.get(`${API_URL}/workouts`);
        
        const activeWorkoutData = response.data['active_workout'];
        if (activeWorkoutData != null) {
          setActiveWorkout({
            workoutName: activeWorkoutData.name,
            workoutDate: new Date(activeWorkoutData.date),
            targetMuscles: activeWorkoutData.target_muscles.map((muscle: any) => muscle.name),
            isActive: activeWorkoutData.is_active
          })
        }

        const inactiveWorkoutsData = response.data['inactive_workouts'];
        if (inactiveWorkoutsData != null) {
          setInactiveWorkouts(inactiveWorkoutsData.map((inactiveWorkout: any) => ({
            workoutName: inactiveWorkout.name,
            workoutDate: inactiveWorkout.date,
            targetMuscles: inactiveWorkout.target_muscles.map((muscle: any) => muscle.name),
            isActive: inactiveWorkout.is_active
          })))
        }
      } catch (e) {
        console.error('Error fetching workout data:', e);
      }
    }
    fetchWorkoutData()
  }, [])

  return (
    <>
      <ScrollView style={styles.tabContainer}>
        <View style={styles.containerWrapper}>
          <ActiveWidget activeWorkout={activeWorkout}/>
          <RecentsWidget workouts={inactiveWorkouts}/>
        </View>
      </ScrollView>
  </>  
  )
}

const ActiveWidget: FunctionComponent<any> = (props:any) => {
  const { workoutName, workoutDate, isActive, muscleMapSvg } = useWorkout(props.activeWorkout);
  const router = useRouter();

  const handleWidgetPress = () => {
    if (isActive)
      router.push('/screens/modals/Log')
    else
      router.push('/screens/modals/CreateWorkout')
  }

  return (
    <>
      <View style={styles.widgetHeader}>
        <Text style={styles.h3}>Active Workout</Text>
      </View>
      <TouchableOpacity style={styles.widgetBody} onPress={() => handleWidgetPress()}>
            <View >
              {isActive ? 
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 14, }}>
                  <View style={{}}>
                    <Text style={[styles.h3]}>{workoutName && workoutName}</Text>
                    <Text style={[styles.h4, styles.lighterFont, { lineHeight: 28 }]}>{workoutDate && dateToWD(workoutDate)}</Text> 
                    <Text style={[styles.h4, styles.lighterFont, { }]}>{workoutDate && dateToDDMMYY(workoutDate)}</Text> 
                  </View>
                  <MuscleMap width={150} height={150}  {...muscleMapSvg} />
                </View>
              : 
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 14, }}>
                  <Text style={[styles.h4, { lineHeight: 28 }]}>Begin new workout</Text>
                  <AntDesign name="plus" size={28} color={colors.yellow} />
                </View> 
              }
            </View>
      </TouchableOpacity >
    </>
  );
}


const RecentsWidget: FunctionComponent<any> = (workouts:any) => {
  const modal = useSelectionModal(['Previous 3 days', 'Previous 7 days', 'Previous 14 days'], [3,7,14]);
  const router = useRouter();

  return (
    <>
      <View style={styles.widgetHeader}>
        <Text style={styles.h3}>Recent Workouts</Text>
        <ModalButton onPress={() => modal.toggleOpen()} text={'Show ' + modal.numericValue } />
      </View>
  
      <View style={recents.widgetBody}>
        {fakeData.slice(0,modal.numericValue ).map((workOut, index) => {
          return (
            <View key={workOut.id}>
              <DayCard
                onPress={() => router.push('/screens/modals/Details')}
                day={workOut.day}
                workoutName={workOut.workoutName}
                date={dateToDDMMYY(workOut.date)}
              />
              {index + 1 !== fakeData.length && <View style={styles.divider} />}
          </View>
          );
        })}
      </View>
      {modal.modalOpen &&
        <BottomModal
          onSelectionPress={(selectionIndex:number) => modal.changeIndex(selectionIndex)}
          onExitPress={() => modal.toggleOpen()}
          selections={modal.selections}
          header={
            <View style={recents.widgetModalHeader}>
              <Text style={[styles.h3, { paddingRight:7 }]}>Set Range</Text>
              <MaterialIcons name="date-range" size={24} color="white" />
            </View>
          }
        />
      }
      
    </>
  );
}

interface WorkoutProps {
  workoutName: string,
  day: string,
  date: string,
  onPress: () => void
}
    
const DayCard: FunctionComponent<WorkoutProps> = (props: WorkoutProps) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 7, paddingHorizontal: 14, }}>
      <View style={{ width:'40%'}}>
        <Text style={[styles.h4]}>{props.day}</Text>
        <Text style={[styles.p, styles.lighterFont]}>{props.date}</Text>
      </View>
      <View style={{ width: '50%' }}>
        <Text style={styles.h4}>{props.workoutName}</Text>
      </View>
      <TouchableOpacity  onPress={props.onPress}>
        <Feather name="info" size={24} color={colors.yellow} />
      </TouchableOpacity>
    </View>
  );
}

export default Home;

const recents = StyleSheet.create({
  widget: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  widgetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 14 
  },
  widgetModalButton: {
    flexDirection: "row",
    alignItems: "center"
  },
  widgetBody: {
    backgroundColor: colors.primary,
    borderRadius: 7
  },
  widgetModalHeader: {
    flexDirection: "row",
    alignItems:"center"
    
  }
})