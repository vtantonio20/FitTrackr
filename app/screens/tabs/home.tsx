import React, { FunctionComponent, useContext, useState, useMemo, useEffect } from 'react'
import { Modal, Image, View, Text, StyleSheet, TouchableOpacity, GestureResponderEvent, Platform, TouchableHighlight, ScrollView } from 'react-native'
import colors from '../../colors';
import styles from "../../style"
import { MaterialIcons, Feather, Entypo , AntDesign, FontAwesome} from '@expo/vector-icons'; 
import { useRouter, useNavigation, useRootNavigation } from 'expo-router';
import { dateToDDMMYY, dateToWD, dateToWDDDMMYY, fakeData, muscleSvgProps } from '../../utilities';
import { WorkoutContext } from '../../contexts/workoutContext';
import  BottomModal, { ModalButton }  from '../../components/smallModal';
//import Blank from '../../assets/images/svgs/blank.svg'
import MuscleMap from '../../assets/svgs/muscleMap.svg'
import { useMuscleSvg } from '../../hooks/useMuscleSvg';
import { useModal } from '../../hooks/useModal';



const Home: FunctionComponent = () => {
  return (
    <>
      <ScrollView style={styles.tabContainer}>
        <View style={styles.containerWrapper}>
          <ActiveWidget/>
          <RecentsWidget />
        </View>
      </ScrollView>
  </>  
  )
}

const ActiveWidget: FunctionComponent = () => {
  const { inActiveWorkout, workoutName, workoutDate, targetMuscles } = useContext(WorkoutContext);
  const router = useRouter();
  const muscleMapSvg = useMuscleSvg(targetMuscles)

  /*
  const [muscleMapSvg, setMuscleMapSvg] = useState({});
  useEffect(() => {
    if (targetMuscles) {
      const temp = muscleSvgProps(targetMuscles);
      setMuscleMapSvg(temp);
    }
  }, [inActiveWorkout, targetMuscles])*/

  const handleWidgetPress = () => {
    if (inActiveWorkout)
      router.push('/screens/modals/log')
    else
      router.push('/screens/modals/createWorkout')
  }

  return (
    <>
      <View style={styles.widgetHeader}>
        <Text style={styles.h3}>Active Workout</Text>
      </View>
      <TouchableOpacity style={styles.widgetBody} onPress={() => handleWidgetPress()}>
            <View >
              {(inActiveWorkout) ? 
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

const RecentsWidget: FunctionComponent = () => {
  const router = useRouter();
  const modal = useModal(['Previous 3 days', 'Previous 7 days', 'Previous 14 days'], [3,7,14]);

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
                onPress={() => router.push('/screens/modals/details')}
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