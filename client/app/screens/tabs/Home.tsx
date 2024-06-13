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
import { fetchWorkoutData } from '../../api';
import { useMuscleSvg } from '../../hooks/useMuscleSvg';
import { ActionSelectionModal, InitActionModalButton } from '../../components/Modal';

const Home: FunctionComponent = () => {
  const { data, error, isLoading , refetch} = useQuery('workouts', fetchWorkoutData)

  // useEffect(() => {
  //   refetch()
  // }, [])

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
          <ActiveWidget activeWorkout={data.active_workout} onRenderModal={(modal:any) => setModalComponent(modal)} onToggleModal={(show:boolean) => setShowModal(show)}/>
          <RecentDaysWidget inactiveWorkouts={data.inactive_workouts} onRenderModal={(modal:any) => setModalComponent(modal)} onToggleModal={(show:boolean) => setShowModal(show)}/>

          {/* <RecentsWidget inactiveWorkouts={data.inactive_workouts} onRenderModal={(modal:any) => setModalComponent(modal)} onToggleModal={(show:boolean) => setShowModal(show)}/> */}
        </View>
      </ScrollView>
      {showModal && modalComponent}
  </>  
  )
}

const ActiveWidget: FunctionComponent<any> = (props:any) => {
  const router = useRouter();

  const { workoutName, workoutDate, isActive, targetMuscles } = useMemo(() => {
    const activeWorkout = props.activeWorkout;
    return {
      workoutName: activeWorkout?.name ?? null,
      workoutDate: activeWorkout?.date ? new Date(activeWorkout.date) : null,
      isActive: activeWorkout?.is_active ?? false, 
      targetMuscles: activeWorkout?.target_muscles?.map((muscle: any) => muscle) ?? []
    };
  }, [props.activeWorkout]);

  // The muscle map
  const muscleMapSvg = useMuscleSvg(targetMuscles);
  
  // Handles routing when widget is pressed
  const handleWidgetPress = () => {
    if (isActive)
      router.push('/screens/modals/Log')
    else
      router.push('/screens/modals/CreateWorkout')
  }

  // Edit, Clone, Delete Routes
  const handleShowModalComponent = (show:boolean) => {
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
        <InitActionModalButton onPress={() => handleShowModalComponent(true)} showing={true} text={'Options'}  />
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

const RecentDaysWidget: FunctionComponent<any> = (props:any) => {
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

    // Edit, Clone, Delete Routes
    const handleShowModalComponent = (show:boolean) => {
      props.onToggleModal(show);
      props.onRenderModal(
        <ActionSelectionModal
          title={'Recents Type'}
          onExitPress={() => handleShowModalComponent(false)}
          selections={[
            {text:'Past Week', action: () => console.log("edit")},
            {text:'Last 10', action: () => console.log("copy")},
          ]}
        />
      )
    }

    const getDaysList = () => {
      const dates = [];      

      const getLastSunday = () => {
        let today = new Date();
        let day = today.getDay();

        // Calculate how many days to add to reach the next Sunday
        let daysToAddForLastSunday = day - 6;
        let lastSunday = new Date(today.getTime() + daysToAddForLastSunday * 24 * 60 * 60 * 1000);
        return lastSunday;
      }

      for (let i = 0; i <= 6; i++) {
        const pastDate = new Date();
        pastDate.setDate(getLastSunday().getDate() + i);
        dates.push(pastDate.toISOString().split('T')[0]); // Format the date as YYYY-MM-DD
      }

      const dayComparator = (d1:string, d2:string) => {
        const getDatePriority = (date:string):number => {
          const day = dateToWD(new Date(date));
          switch (day){
            case 'Sunday': return 7;
            case 'Monday': return 6;
            case 'Tuesday': return 5;
            case 'Wednesday': return 4;
            case 'Thursday': return 3;
            case 'Friday': return 2;
            case 'Saturday': return 1;
            default: throw new Error(`Invalid day: ${day}`);
          }
        }
        
        return(getDatePriority(d2) - getDatePriority(d1));
      }
      dates.sort(dayComparator)
      
      return dates;
    }

    const days = getDaysList();

    const buildDayToWorkoutMap = (inactiveWorkouts:any, days:any) => {
      const map:any = {};
      for (const day of days) {
        if (!map[day]){
          map[day] = {
            workouts:[],
            id: new Date(day).getDay(),
            day: day
          }
        }
        for (const inactiveWorkout of inactiveWorkouts) {
          if (dateToWD(new Date(day)) === dateToWD(new Date(inactiveWorkout.workoutDate))) {
            map[day].workouts.push(inactiveWorkout)
          }
        }
      }
      return map;
    };
    const dayWorkoutMap = buildDayToWorkoutMap(inactiveWorkouts, days);

    const determineWorkoutString = (dayWorkout:any) => {
      if (!dayWorkout || !dayWorkout.workouts || !dayWorkout.workouts[0])
        return "";
      if (dayWorkout.workouts.length > 1) {
        return "(" + dayWorkout.workouts.length + ") workouts";
      }

      return dayWorkout.workouts[0].workoutName;
    }
  return (
    <>
      <View style={styles.widgetHeader}>
        <Text style={styles.h3}>Recent Workouts</Text>
        <InitActionModalButton onPress={() => handleShowModalComponent(true)} showing={true} text={'Time Frame'}  />
      </View>
      <View style={recents.widgetBody}>
        {dayWorkoutMap && days.map((day:any, index:any) => {
          console.log(new Date(day).getTime())
          const dayWorkout = dayWorkoutMap[day];
          return (
            <>
              <View key={new Date(day).getDay()}>
                <DayCard
                  onPress={() => {}}
                  day={dateToWD(new Date(day))}
                  workoutName={determineWorkoutString(dayWorkout)}
                  date={dateToDDMMYY(new Date(day))}
                />
                {index + 1 !== days.length && <View style={styles.divider} />}
              </View>
            </>
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