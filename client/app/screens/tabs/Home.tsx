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
import useWorkout from '../../hooks/useWorkout';
import { useQuery } from "react-query";
import { fetchWorkoutData } from '../../api';
import { useMuscleSvg } from '../../hooks/useMuscleSvg';

const Home: FunctionComponent = () => {
  const { data, error, isLoading } = useQuery('workouts', fetchWorkoutData)

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

  const inactiveWorkouts = data.inactive_workouts
    ? data.inactive_workouts.map((inactiveWorkoutData: any) => ({
        workoutName: inactiveWorkoutData.name,
        workoutDate: new Date(inactiveWorkoutData.date),
        targetMuscles: inactiveWorkoutData.target_muscles.map((muscle: any) => muscle.name),
        isActive: inactiveWorkoutData.is_active,
        id: inactiveWorkoutData.id,
      }))
    : [];
  return (
    <>
      <ScrollView style={styles.tabContainer}>
        <View style={styles.containerWrapper}>
          <ActiveWidget activeWorkout={activeWorkout}/>
          <RecentsWidget inactiveWorkouts={data.inactive_workouts}/>
        </View>
      </ScrollView>
  </>  
  )
}

const ActiveWidget: FunctionComponent<any> = (props:any) => {
  const router = useRouter();

  const workoutName = props.activeWorkout.workoutName;
  const workoutDate = props.activeWorkout.workoutDate;
  const targetMuscles = props.activeWorkout.targetMuscles;
  const isActive = props.activeWorkout.isActive;
  const muscleMapSvg = useMuscleSvg(targetMuscles);
  
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


const RecentsWidget: FunctionComponent<any> = (props:any) => {
  const selectionModal = useSelectionModal(['Previous 3 days', 'Previous 7 days', 'Previous 14 days'], [3,7,14]);
  const router = useRouter();

  const inactiveWorkouts = props.inactiveWorkouts
  ? props.inactiveWorkouts.map((inactiveWorkoutData:any) => ({
      workoutName: inactiveWorkoutData.name,
      workoutDate: new Date(inactiveWorkoutData.date),
      targetMuscles: inactiveWorkoutData.target_muscles.map((muscle: any) => muscle.name),
      isActive: inactiveWorkoutData.is_active,
      id: inactiveWorkoutData.id,
    }))
  : [];
  
  return (
    <>
      <View style={styles.widgetHeader}>
        <Text style={styles.h3}>Recent Workouts</Text>
        <ModalButton onPress={() => selectionModal.toggleOpen()} text={'Show ' + selectionModal.numericValue } />
      </View>
  
      <View style={recents.widgetBody}>
        {inactiveWorkouts.slice(0,selectionModal.numericValue ).map((workout:any, index:any) => {
          return (
            <View key={workout.id}>
              <DayCard
                onPress={() => router.push('/screens/modals/Details')}
                day={"Sunday"}
                workoutName={workout.workoutName}
                date={dateToDDMMYY(workout.workoutDate)}
              />
              {index + 1 !== inactiveWorkouts.length && <View style={styles.divider} />}
          </View>
          );
        })}
      </View>
      {selectionModal.modalOpen &&
        <BottomModal
          onSelectionPress={(selectionIndex:number) => selectionModal.changeIndex(selectionIndex)}
          onExitPress={() => selectionModal.toggleOpen()}
          selections={selectionModal.selections}
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