import React, { FunctionComponent, useContext, useState, useMemo, useEffect } from 'react'
import { Modal, Image, View, Text, StyleSheet, TouchableOpacity, GestureResponderEvent, Platform, TouchableHighlight, ScrollView } from 'react-native'
import colors from '../../colors';
import styles from "../../style"
import { MaterialIcons, Feather, Ionicons , AntDesign, FontAwesome} from '@expo/vector-icons'; 
import { useRouter } from 'expo-router';
import { dateToDDMMYY, dateToWD, fakeData } from '../../utilities';
import  BottomModal, { ModalButton }  from '../../components/smallModal';
import MuscleMap from '../../assets/svgs/muscleMap.svg'
import { useSelectionModal } from '../../hooks/useSelectionModal';
import { useQuery } from "react-query";
import { fetchWorkoutsData } from '../../api';
import { useMuscleSvg } from '../../hooks/useMuscleSvg';
import { ActionSelectionModal, InitActionModalButton } from '../../components/Modal';

const Home: FunctionComponent = () => {
  const { data, error, isLoading } = useQuery('workouts', fetchWorkoutsData)
  const [modalComponent, setModalComponent] = useState(null)
  const [showModal, setShowModal] = useState(false)

  if (isLoading) {
    return <View><Text>Loading...</Text></View>;
  }

  if (error) {
    console.error('Error fetching workout data:', error);
    return <View><Text>Error loading data</Text></View>;
  }

  return (
    <>
      <ScrollView style={styles.tabContainer}>
        <View style={styles.containerWrapper}>
          <ActiveWidget activeWorkout={data.active_workout} onRenderModal={(modal:any) => setModalComponent(modal)} onToggleModal={(show:boolean) => setShowModal(show)} showing={showModal}/>
          <RecentDaysWidget inactiveWorkouts={data.inactive_workouts} onRenderModal={(modal:any) => setModalComponent(modal)} onToggleModal={(show:boolean) => setShowModal(show)} showing={showModal}/>
        </View>
      </ScrollView>
      {showModal && modalComponent}
  </>  
  )
}

interface Workout {
  name: string;
  date: Date;
  isActive: boolean;
  id: number;
  targetMusclesNames?: string[]
}

const ActiveWidget: FunctionComponent<any> = (props:any) => {
  const router = useRouter();

  // const activeWorkout:Workout = useMemo(() => {
  //   return {
  //     name: props.activeWorkout.name,
  //     date: new Date(props.activeWorkout.date),
  //     isActive: props.activeWorkout.is_active,
  //     id: props.activeWorkout.id ,
  //     targetMusclesNames: props.activeWorkout.target_muscles?.map((muscle: any) => muscle) ?? [],
  //   };
  // }, [props.activeWorkout]);

  const { workoutName, workoutDate, isActive, targetMuscles, workoutId } = useMemo(() => {
    const activeWorkout = props.activeWorkout;
    return {
      workoutName: activeWorkout?.name ?? null,
      workoutDate: activeWorkout?.date ? new Date(activeWorkout.date) : null,
      isActive: activeWorkout?.is_active ?? false, 
      targetMuscles: activeWorkout?.target_muscles?.map((muscle: any) => muscle) ?? [],
      workoutId: activeWorkout?.id
    };
  }, [props.activeWorkout]);

  // The muscle map
  const muscleMapSvg = useMuscleSvg(targetMuscles);
  
  // Handles routing when widget is pressed
  const handleWidgetPress = () => {
    const id = 1;
    if (isActive)
      router.push({ pathname: '/screens/modals/Log', params: {id:workoutId, isActive:isActive}})
    else
      router.push('/screens/modals/CreateWorkout')
  }

  // Edit, Clone, Delete Routes
  const [isShowingModal, setIsShowingModal] = useState(false)
  const handleShowModalComponent = (show:boolean) => {
    setIsShowingModal(show);
    props.onToggleModal(show);
    props.onRenderModal(
      <ActionSelectionModal
        title={'Active Workout Options'}
        onExitPress={() => handleShowModalComponent(false)}
        selections={[
          {text:'Edit Workout', action: () => console.log("edit")},
          {text:'Copy Workout', action: () => console.log("copy")},
          {text:'Delete Workout', action: () => console.log("delete")}
        ]}
      />
    ) 
  }

  return (
    <>
      <View style={styles.widgetHeader}>
        <Text style={styles.h3}>Active Workout</Text>
        <InitActionModalButton onPress={() => handleShowModalComponent(true)} showing={isShowingModal} text={'Options'}  />
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

interface DayWorkout {
  id: number,
  workouts: Workout[],
  day: string
}

const RecentDaysWidget: FunctionComponent<any> = (props:any) => {
  const router = useRouter();
  const inactiveWorkouts:Workout[] = useMemo(() => {
    return props.inactiveWorkouts
      ? props.inactiveWorkouts.map((inactiveWorkoutData:any):Workout => ({
          name: inactiveWorkoutData.name,
          date: new Date(inactiveWorkoutData.date),
          isActive: inactiveWorkoutData.is_active,
          id: inactiveWorkoutData.id
        }))
      : [];
  }, [props.inactiveWorkouts]);

  // Getting the days of the week
  const getDaysList = () => {
    const dates = [];
    const getLastSunday = () => {
      // Calculate how many days to add to reach the next Sunday
      let today = new Date();
      let daysToAddForLastSunday = today.getDay() - 6;
      let lastSunday = new Date(today.getTime() + daysToAddForLastSunday * 24 * 60 * 60 * 1000);
      return lastSunday;
    }
    for (let i = 0; i <= 6; i++) {
      const pastDate = new Date();
      pastDate.setDate(getLastSunday().getDate() + i);
      dates.push(pastDate.toISOString().split('T')[0]);
    }
    return dates;
  }


  const buildDayToWorkoutMap = (inactiveWorkouts:Workout[], days:string[]) => {
    const map: Record<string, DayWorkout> = {};
    for (const day of days) {
      if (!map[day]){
        map[day] = {
          workouts:[],
          id: new Date(day).getDay(),
          day: day
        }
      }
      for (const inactiveWorkout of inactiveWorkouts) {
        if (dateToWD(new Date(day)) === dateToWD(new Date(inactiveWorkout.date))) {
          map[day].workouts.push(inactiveWorkout)
        }
      }
    }
    return map;
  };

  const dayWorkoutMap = buildDayToWorkoutMap(inactiveWorkouts, getDaysList());
  const days = Object.keys(dayWorkoutMap);

  const handleWorkoutOnPress = (dayWorkout:DayWorkout) => {
    const numberOfWorkouts = dayWorkout.workouts.length;
    const pushRouterToExerciseLog = (id:number, isActive:any) => {
      router.push({ 
        pathname: '/screens/modals/Log', 
        params: {
          id:id,
          isActive:isActive
        }
      })
    };

    if (numberOfWorkouts === 0) {
      console.log('add workout')
      return;
    }
    if (numberOfWorkouts === 1) {
      const singleWorkoutForDay = dayWorkout.workouts[0];
      pushRouterToExerciseLog(singleWorkoutForDay.id, singleWorkoutForDay.isActive)
      return;
    }
    if (numberOfWorkouts > 1) {
      // This will be the choose workout modal if a day is pressed with multiple workotus
      const handleShowModalComponent = (show:boolean, dayWorkout?:DayWorkout) => {
        props.onToggleModal(show);
        if (dayWorkout) {
          props.onRenderModal(
            <ActionSelectionModal
              title={dateToWD(new Date(dayWorkout.day))}
              onExitPress={() => handleShowModalComponent(false)}
              selections={dayWorkout.workouts.map((w: Workout) => {
                return {
                  text: w.name, action: () => {
                    pushRouterToExerciseLog(w.id, w.isActive)
                  }
                }
              })}
            />
          ) 
        }
      }
      handleShowModalComponent(true, dayWorkout)
      return;
    }
  }
  return (
    <>
      <View style={styles.widgetHeader}>
        <Text style={styles.h3}>This Week</Text>
        {/* <InitActionModalButton onPress={() => handleShowModalComponent(true)} showing={isShowingModal} text={'Time Frame'}  /> */}
      </View>
      <View style={[styles.divider, {borderColor:colors.primary, borderRadius: 7}]}>
        {dayWorkoutMap && days.map((day:string, index:number) => {
          const determineWorkoutString = (dayWorkout:DayWorkout) => {
            if (!dayWorkout || !dayWorkout.workouts || !dayWorkout.workouts[0])
              return "";
            if (dayWorkout.workouts.length > 1)
              return "(" + dayWorkout.workouts.length + ") Workouts";
            return dayWorkout.workouts[0].name;
          }
          const dayWorkout = dayWorkoutMap[day];
          return (
            <TouchableOpacity key={dayWorkout.id} onPress={() => handleWorkoutOnPress(dayWorkout)}>
              <>
                <DayCard
                  onPress={() => {}}
                  day={dateToWD(new Date(day))}
                  workoutName={determineWorkoutString(dayWorkout)}
                  date={dateToDDMMYY(new Date(day))}
                />
                {index + 1 !== days.length && <View style={[styles.divider, { borderColor: colors.primary,}]} />}
              </>
            </TouchableOpacity>
          );
        })}
      </View>

    </>
  );
}

const RecentsWidget: FunctionComponent<any> = (props:any) => {
  const selectionModal = useSelectionModal(['Previous 3 days', 'Previous 7 days', 'Previous 14 days'], [3,7,14]);
  const router = useRouter();

  const inactiveWorkouts = useMemo(() => {
    return props.inactiveWorkouts
      ? props.inactiveWorkouts.map((inactiveWorkoutData: any) => ({
          workoutName: inactiveWorkoutData.name,
          workoutDate: new Date(inactiveWorkoutData.date),
          isActive: inactiveWorkoutData.is_active,
          id: inactiveWorkoutData.id
        }))
      : [];
  }, [props.inactiveWorkouts]);

  const handleShowModalComponent = (show:boolean) => {
    selectionModal.setModalOpen(show);
    props.onToggleModal(show);
    if (show){
      props.onRenderModal(
        <BottomModal
          onSelectionPress={(selectionIndex:number) => selectionModal.changeIndex(selectionIndex)}
          onExitPress={() => handleShowModalComponent(false)}
          selections={selectionModal.selections}
          header={
            <View style={recents.widgetModalHeader}>
              <Text style={[styles.h3, { paddingRight:7 }]}>Set Range</Text>
              <MaterialIcons name="date-range" size={24} color="white" />
            </View>
          }
        />
      )
    }
  }

  return (
    <>
      <View style={styles.widgetHeader}>
        <Text style={styles.h3}>Recent Workouts</Text>
        <ModalButton onPress={() => handleShowModalComponent(true)} showing={selectionModal.modalOpen} text={'Show ' + selectionModal.numericValue } />
      </View>
  
      <View style={recents.widgetBody}>
        {inactiveWorkouts.slice(0, selectionModal.numericValue).map((workout:any, index:any) => {
          return (
            <View key={workout.id}>
              <DayCard
                onPress={() => router.push('/screens/modals/Details')}
                day={dateToWD(workout.workoutDate)}
                workoutName={workout.workoutName}
                date={dateToDDMMYY(workout.workoutDate)}
              />
              {index + 1 !== inactiveWorkouts.length && <View style={styles.divider} />}
          </View>
          );
        })}
      </View>
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
    <View style={{ flexDirection: "row", alignItems: "center", padding:14 }}>
      <View style={{ width:'40%'}}>
        <Text style={[styles.h3a]}>{props.day}</Text>
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