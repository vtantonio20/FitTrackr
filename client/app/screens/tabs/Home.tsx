import React, { FunctionComponent, useMemo, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import colors from '../../colors';
import styles from "../../style"
import { Feather , AntDesign, Ionicons } from '@expo/vector-icons'; 
import { useRouter } from 'expo-router';
import { dateToDDMMYY, dateToWD, getDateNumberOfDaysApart, getLastSundayFromDate, getNumberOfWeeksBetweenDates } from '../../utilities';
import MuscleMap from '../../assets/svgs/muscleMap.svg'
import { useMuscleSvg } from '../../hooks/useMuscleSvg';
import { ActionSelectionModal, InitActionModalButton } from '../../components/Modal';
import { Workout, useActiveWorkoutData, useInactiveWorkoutData } from '../../queries/WorkoutQueries';

interface HomeWidgetProps {
  onRenderModal:any;
  onToggleModal:any;
  showing:any;
}

const Home: FunctionComponent = () => {
  const [modalComponent, setModalComponent] = useState(null)
  const [showModal, setShowModal] = useState(false)
  return (
    <>
      <ScrollView style={styles.tabContainer}>
        <View style={styles.containerWrapper}>
          <ActiveWidget onRenderModal={(modal:any) => setModalComponent(modal)} onToggleModal={(show:boolean) => setShowModal(show)} showing={showModal}/>
          <RecentDaysWidget onRenderModal={(modal:any) => setModalComponent(modal)} onToggleModal={(show:boolean) => setShowModal(show)} showing={showModal}/>
        </View>
      </ScrollView>
      {showModal && modalComponent}
  </>  
  )
}

const ActiveWidget: FunctionComponent<any> = (props:HomeWidgetProps) => {
  const router = useRouter();
  const workoutsData = useActiveWorkoutData();
  const activeWorkout = workoutsData.activeWorkout; 
  // The muscle map
  const muscleMapSvg = useMuscleSvg((activeWorkout && activeWorkout.targetMuscles) ? activeWorkout.targetMuscles : []);

  // Edit, Clone, Delete Routes
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isShowingModal, setIsShowingModal] = useState(false)
  const handleShowModalComponent = (show:boolean) => {
    if (!activeWorkout) return
    setIsShowingModal(show);
    props.onToggleModal(show);
    props.onRenderModal(
      <ActionSelectionModal
        title={'Active Workout Options'}
        onExitPress={() => handleShowModalComponent(false)}
        selections={[
          {text:'Edit Workout Details', action: () =>  router.push({pathname:'/screens/modals/Workout', params:{workoutId:activeWorkout.id}})},
          {text:'Deactivate Details', action: () => console.log("edit")},
          {text:'Delete Workout', action: () => setShowDeleteModal(true)}
        ]}
      />
    ) 
  }

  if (!activeWorkout) {
    return (
      <>
        <TouchableOpacity style={[styles.widgetBody,{marginTop:14}]} onPress={() => router.push('/screens/modals/Workout')}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 14, }}>
            <Text style={[styles.h4, { lineHeight: 28 }]}>Begin new workout</Text>
            <AntDesign name="plus" size={28} color={colors.yellow} />
          </View>
        </TouchableOpacity> 
      </>
    )
  }

  return (
    <>
      <View style={styles.widgetHeader}>
        <Text style={[styles.h3, {paddingVertical:7}]}>Active Workout</Text>
        <InitActionModalButton onPress={() => handleShowModalComponent(true)} showing={isShowingModal} text={'Options'}  />
      </View>
      <TouchableOpacity style={styles.widgetBody} onPress={() => router.push({ pathname: '/screens/modals/Log', params: {workoutId:activeWorkout.id}})}>
        <View >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 14, }}>
            <View style={{}}>
              <Text style={[styles.h3]}>{activeWorkout.name && activeWorkout.name}</Text>
              <Text style={[styles.h4, styles.lighterFont, { lineHeight: 28 }]}>{activeWorkout.date && dateToWD(activeWorkout.date)}</Text> 
              <Text style={[styles.h4, styles.lighterFont, { }]}>{activeWorkout.date && dateToDDMMYY(activeWorkout.date)}</Text> 
            </View>
            <MuscleMap width={150} height={150}  {...muscleMapSvg} />
          </View>
        </View>
      </TouchableOpacity>

      {showDeleteModal && (
          <ActionSelectionModal
          title={"Are you sure you want to delete this Workout?"}
          onExitPress={() => setShowDeleteModal(false)}
          selections={[
            {text:'Confirm Delete', textStyle:{color:colors.red}, action: () => {workoutsData.deleteActiveWorkout()}},
            {text:'Cancel', action: () => console.log("Cancel")}
          ]}
        />
      )}

    </>
  );
}


interface WorkoutDay {
  id: number,
  workouts: Workout[],
  day: string
}

const RecentDaysWidget: FunctionComponent<any> = (props:HomeWidgetProps) => {
  const router = useRouter();
  const inactiveWorkoutData = useInactiveWorkoutData();
  const inactiveWorkouts = inactiveWorkoutData.inactiveWorkouts;
  const [week, setWeek] = useState(getLastSundayFromDate(new Date()));

  // Getting the days of the week
  const daysList = useMemo(() => {
    const dates = [];
    const pastSundayFromWeek = getLastSundayFromDate(week);
    for (let i = 0; i <= 6; i++) {
      const dayOfWeek = getDateNumberOfDaysApart(pastSundayFromWeek, i);
      dates.push(dayOfWeek);
    }

    dates.sort((d1, d2) => {
      return(d1.getTime() - d2.getTime());
    })
    
    inactiveWorkoutData.changeTimeFrame(dates[0], dates[6]);
    return dates;
  }, [week])

  const dayWorkoutMap = useMemo(() => {
    const map: Record<string, WorkoutDay> = {};
    if (!inactiveWorkouts) return map;
    for (const day of daysList) {
      if (!map[day.toDateString()]){
        map[day.toDateString()] = {
          workouts:[],
          id: new Date(day).getDay(),
          day: day.toDateString()
        }
      }
      for (const inactiveWorkout of inactiveWorkouts) {
        if (new Date(day).getDay() === new Date(inactiveWorkout.date).getDay()) {
          map[day.toDateString()].workouts.push(inactiveWorkout)
        }
      }
    }
    return map;
  }, [inactiveWorkoutData])

  const handleRecentsHeaderTitle = useMemo(() => {
    const thisWeek = getLastSundayFromDate(new Date());
    const numberOfWeeksBetween = getNumberOfWeeksBetweenDates(thisWeek, week);

    if (numberOfWeeksBetween < 0)
      return Math.abs(numberOfWeeksBetween) + " weeks ago";
    else if (numberOfWeeksBetween > 0) {
      return numberOfWeeksBetween + " weeks from now";
    } else {
      return "This week";
    }
    
  }, [week]);

  const handleDisableDecrement = () => {
    return getDateNumberOfDaysApart(new Date(), - 85).getTime() > week.getTime();
  }

  const handleDisableIncrement = () => {
    return getDateNumberOfDaysApart(new Date(), 6).getTime() < week.getTime();
  }

  const handleIncrementWeek = () => {
    setWeek(getDateNumberOfDaysApart(week, 7))    
  }
  
  const handleDecrementWeek = () => {
    setWeek(getDateNumberOfDaysApart(week, - 7))
  }

  const handleWorkoutOnPress = (dayWorkout:WorkoutDay) => {
    const numberOfWorkouts = dayWorkout.workouts.length;

    if (numberOfWorkouts === 0) {
      return;
    }
    if (numberOfWorkouts === 1) {
      const singleWorkoutForDay = dayWorkout.workouts[0];
      router.push({ 
        pathname: '/screens/modals/Log', 
        params: { workoutId:singleWorkoutForDay.id }
      });
      return;
    }
    // This will be the choose workout modal if a day is pressed with multiple workotus
    if (numberOfWorkouts > 1) {
      const handleShowModalComponent = (show:boolean, dayWorkout?:WorkoutDay) => {
        props.onToggleModal(show);
        if (dayWorkout) {
          const modalTitle = dateToWD(new Date(dayWorkout.day)) + ", " + dateToDDMMYY(new Date(dayWorkout.day))
          props.onRenderModal(
            <ActionSelectionModal
              title={modalTitle}
              onExitPress={() => handleShowModalComponent(false)}
              selections={dayWorkout.workouts.map((w: Workout) => {
                return {
                  text: w.name, action: () => {
                    router.push({ 
                      pathname: '/screens/modals/Log', 
                      params: { workoutId:w.id }
                    });
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
    {/* Header and Forward and Back Arrows */}
      <View style={[styles.widgetHeader, {marginVertical:7}]}>
        <Text style={styles.h3}>{ handleRecentsHeaderTitle }</Text>
        <View style={{flexDirection:'row'}} >
          <TouchableOpacity disabled={ handleDisableDecrement() } onPress={handleDecrementWeek} style={{backgroundColor:colors.primary, padding:7, borderTopLeftRadius:7, borderBottomLeftRadius: 7, opacity:handleDisableDecrement() ? 0.25 : 1}}>
            <Ionicons name="chevron-back-outline" size={32} color={colors.lighter} />
          </TouchableOpacity>
          <TouchableOpacity disabled={ handleDisableIncrement() } onPress={handleIncrementWeek} style={{backgroundColor: colors.primary, padding:7, borderTopRightRadius:7, borderBottomRightRadius: 7, opacity:handleDisableIncrement() ? 0.25 : 1}}>
            <Ionicons name="chevron-forward-outline" size={32} color={colors.lighter} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Day Cards */}
      <View style={[styles.divider, {borderColor:colors.primary, borderRadius: 7}]}>
        {dayWorkoutMap &&  Object.keys(dayWorkoutMap).map((day:string, index:number) => {
          const determineWorkoutString = (dayWorkout:WorkoutDay) => {
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
                {index + 1 !== Object.keys(dayWorkoutMap).length && <View style={[styles.divider, { borderColor: colors.primary,}]} />}
              </>
            </TouchableOpacity>
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


// const RecentsWidget: FunctionComponent<any> = (props:any) => {
//   const selectionModal = useSelectionModal(['Previous 3 days', 'Previous 7 days', 'Previous 14 days'], [3,7,14]);
//   const router = useRouter();

//   const inactiveWorkouts = useMemo(() => {
//     return props.inactiveWorkouts
//       ? props.inactiveWorkouts.map((inactiveWorkoutData: any) => ({
//           workoutName: inactiveWorkoutData.name,
//           workoutDate: new Date(inactiveWorkoutData.date),
//           isActive: inactiveWorkoutData.is_active,
//           id: inactiveWorkoutData.id
//         }))
//       : [];
//   }, [props.inactiveWorkouts]);

//   const handleShowModalComponent = (show:boolean) => {
//     selectionModal.setModalOpen(show);
//     props.onToggleModal(show);
//     if (show){
//       props.onRenderModal(
//         <BottomModal
//           onSelectionPress={(selectionIndex:number) => selectionModal.changeIndex(selectionIndex)}
//           onExitPress={() => handleShowModalComponent(false)}
//           selections={selectionModal.selections}
//           header={
//             <View style={recents.widgetModalHeader}>
//               <Text style={[styles.h3, { paddingRight:7 }]}>Set Range</Text>
//               <MaterialIcons name="date-range" size={24} color="white" />
//             </View>
//           }
//         />
//       )
//     }
//   }

//   return (
//     <>
//       <View style={styles.widgetHeader}>
//         <Text style={styles.h3}>Recent Workouts</Text>
//         <ModalButton onPress={() => handleShowModalComponent(true)} showing={selectionModal.modalOpen} text={'Show ' + selectionModal.numericValue } />
//       </View>
  
//       <View style={recents.widgetBody}>
//         {inactiveWorkouts.slice(0, selectionModal.numericValue).map((workout:any, index:any) => {
//           return (
//             <View key={workout.id}>
//               <DayCard
//                 onPress={() => router.push('/screens/modals/Details')}
//                 day={dateToWD(workout.workoutDate)}
//                 workoutName={workout.workoutName}
//                 date={dateToDDMMYY(workout.workoutDate)}
//               />
//               {index + 1 !== inactiveWorkouts.length && <View style={styles.divider} />}
//           </View>
//           );
//         })}
//       </View>
//     </>
//   );
// }
