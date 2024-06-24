import React, { FunctionComponent, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import colors from '../../colors';
import styles from "../../style"
import { Feather , AntDesign } from '@expo/vector-icons'; 
import { useRouter } from 'expo-router';
import { dateToDDMMYY, dateToWD } from '../../utilities';
import MuscleMap from '../../assets/svgs/muscleMap.svg'
import { useMuscleSvg } from '../../hooks/useMuscleSvg';
import { ActionSelectionModal, InitActionModalButton } from '../../components/Modal';
import { Workout, useWorkoutsData } from '../../queries/WorkoutQueries';

interface HomeWidgetProps {
  onRenderModal:any;
  onToggleModal:any;
  showing:any;
}

interface ActiveWidgetProps extends HomeWidgetProps {
  activeWorkout:Workout,
}

interface RecentsWidgetProps extends HomeWidgetProps {
  inactiveWorkouts:Workout[]
}

const Home: FunctionComponent = () => {
  const router = useRouter();

  const [modalComponent, setModalComponent] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const workoutsData = useWorkoutsData();

  if (workoutsData.isLoading) {
    return <View><Text>Loading...</Text></View>;
  }

  if (workoutsData.error) {
    console.error('Error fetching workout data:', workoutsData.error);
    return <View><Text>Error loading data</Text></View>;
  }

  return (
    <>
      <ScrollView style={styles.tabContainer}>
        <View style={styles.containerWrapper}>
          {workoutsData.activeWorkout ?
            <ActiveWidget activeWorkout={workoutsData.activeWorkout} onRenderModal={(modal:any) => setModalComponent(modal)} onToggleModal={(show:boolean) => setShowModal(show)} showing={showModal}/>
          :
          <TouchableOpacity style={[styles.widgetBody,{marginTop:14}]} onPress={() => router.push('/screens/modals/Workout')}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 14, }}>
                <Text style={[styles.h4, { lineHeight: 28 }]}>Begin new workout</Text>
                <AntDesign name="plus" size={28} color={colors.yellow} />
              </View>
            </TouchableOpacity> 
          }
          <RecentDaysWidget inactiveWorkouts={workoutsData.inactiveWorkouts} onRenderModal={(modal:any) => setModalComponent(modal)} onToggleModal={(show:boolean) => setShowModal(show)} showing={showModal}/>
        </View>
      </ScrollView>
      {showModal && modalComponent}
  </>  
  )
}

const ActiveWidget: FunctionComponent<any> = (props:ActiveWidgetProps) => {
  const router = useRouter();
  const workoutsData = useWorkoutsData();
  // The active workout. Could prolly change this to not be a prop.
  const activeWorkout = props.activeWorkout; 
  // The muscle map
  const muscleMapSvg = useMuscleSvg(activeWorkout.targetMuscles || []);

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
          {text:'Edit Workout Details', action: () =>  router.push({pathname:'/screens/modals/Workout', params:{workoutId:activeWorkout.id}})},
          {text:'Deactivate Details', action: () => console.log("edit")},
          {text:'Delete Workout', action: () => setShowDeleteModal(true)}
        ]}
      />
    ) 
  }

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const renderDeleteModal = () => {
    return (
      <ActionSelectionModal
        title={"Are you sure you want to delete this Workout?"}
        onExitPress={() => setShowDeleteModal(false)}
        selections={[
          {text:'Confirm Delete', textStyle:{color:colors.red}, action: () => {workoutsData.deleteActiveWorkout()}},
          {text:'Cancel', action: () => console.log("Cancel")}
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
      <TouchableOpacity style={styles.widgetBody} onPress={() => router.push({ pathname: '/screens/modals/Log', params: {workoutId:activeWorkout.id}})}>
        <View >
          {activeWorkout.isActive ? 
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 14, }}>
              <View style={{}}>
                <Text style={[styles.h3]}>{activeWorkout.name && activeWorkout.name}</Text>
                <Text style={[styles.h4, styles.lighterFont, { lineHeight: 28 }]}>{activeWorkout.date && dateToWD(activeWorkout.date)}</Text> 
                <Text style={[styles.h4, styles.lighterFont, { }]}>{activeWorkout.date && dateToDDMMYY(activeWorkout.date)}</Text> 
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

        {showDeleteModal && renderDeleteModal()}

      </TouchableOpacity>
    </>
  );
}

interface WorkoutDay {
  id: number,
  workouts: Workout[],
  day: string
}

const RecentDaysWidget: FunctionComponent<any> = (props:RecentsWidgetProps) => {
  const inactiveWorkouts = props.inactiveWorkouts;
  const router = useRouter();
  
  // Getting the days of the week
  const getDaysList = () => {
    const dates = [];
    const getLastSunday = () => {
      const today = new Date();
      const currentDay = today.getDay();
      const offsetToLastSunday = (currentDay + 7) % 7;
      const lastSundayDate = new Date(today);
      lastSundayDate.setDate(today.getDate() - offsetToLastSunday);
      return lastSundayDate;
    }
    for (let i = 0; i <= 6; i++) {
      const pastDate = new Date();
      pastDate.setDate(getLastSunday().getDate() + i);
      dates.push(pastDate.toISOString().split('T')[0]);
    }

    dates.sort((d1,d2) => {
      return(new Date(d1).getDate() - new Date(d2).getDate());
    })
    return dates;
  }

  const buildDayToWorkoutMap = (inactiveWorkouts:Workout[], days:string[]) => {
    const map: Record<string, WorkoutDay> = {};
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
          props.onRenderModal(
            <ActionSelectionModal
              title={dateToWD(new Date(dayWorkout.day))}
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
      <View style={styles.widgetHeader}>
        <Text style={styles.h3}>This Week</Text>
        <View style={{flexDirection:'row'}} >
          <TouchableOpacity>
            <AntDesign style={{paddingHorizontal:3.5}} name="leftcircleo" size={20} color={colors.lighter} />
          </TouchableOpacity>
          <TouchableOpacity>
            <AntDesign style={{paddingHorizontal:3.5}} name="rightcircleo" size={20} color={colors.lighter} />
          </TouchableOpacity>
        </View>
        {/* <InitActionModalButton onPress={() =>  {}} showing={true} text={'Time Frame'}  /> */}
      </View>
      <View style={[styles.divider, {borderColor:colors.primary, borderRadius: 7}]}>
        {dayWorkoutMap && days.map((day:string, index:number) => {
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
                {index + 1 !== days.length && <View style={[styles.divider, { borderColor: colors.primary,}]} />}
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
