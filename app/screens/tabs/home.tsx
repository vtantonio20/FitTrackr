import React, { FunctionComponent, useContext, useState, useMemo } from 'react'
import { Modal, Image, View, Text, StyleSheet, TouchableOpacity, GestureResponderEvent, Platform, TouchableHighlight, ScrollView } from 'react-native'
import colors from '../../colors';
import styles from "../../style"
import { MaterialIcons, Feather, Entypo , AntDesign, FontAwesome} from '@expo/vector-icons'; 
import { useRouter, useNavigation, useRootNavigation } from 'expo-router';
import { dateToDDMMYY, fakeData } from '../../utilities';
import { WorkoutContext } from '../../contexts/workoutContext';
import { BottomModal } from '../../components/smallModal';
//import Blank from '../../assets/images/svgs/blank.svg'
import  MuscleMap from '../../assets/svgs/muscleMap.svg'
import { MUSCLEMAP } from '../../utilities';

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
interface MuscleProps {
  ass: string;
  neck: string;
}
const ActiveWidget: FunctionComponent = () => {
  const { inActiveWorkout, workoutName, workoutDate, targetMuscles } = useContext(WorkoutContext);
  const [muscles, setMuscles] = useState(['ass', 'chest']);
  const router = useRouter();
  
  const onWidgetPress = () => {
    if (!inActiveWorkout)
      router.push('/screens/modals/workout')
  }


  const dynamicProps = {
    [`ass`]: colors.red,
    [`neck`]: colors.red,
    [`fill`]: '#2B2B2B',
    [`border`]:Platform.OS === 'ios' ? colors.primary : 'ccc#2B2B2B'
  }



  return (
    <>
      <View style={styles.widgetHeader}>
        <Text style={styles.h3}>Active Workout</Text>
      </View>
      <TouchableOpacity style={recents.widgetBody} onPress={() => onWidgetPress()}>
            <View >
              {inActiveWorkout ? 
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 14, }}>
                  <View style={{}}>
                    <Text style={[styles.h3a]}>{workoutName}</Text>
                    <Text style={[styles.h4, styles.lighterFont, { lineHeight: 28 }]}>{workoutDate}</Text> 
                  </View>
                  <MuscleMap width={150} height={150} {...dynamicProps} />
                    {/*<Blank {...{ hair:colors.red, pecs:colors.red}}/>*/}

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
  const [isDayModalVisible, setIsDayModalVisible] = useState(false);
  const [dayCount, setDayCount] = useState(0);
  
  console.log(dayCount)
  const handleDaySwitchModalVisibility = () => {
    setIsDayModalVisible(!isDayModalVisible);
  }

  const handleDayCount = (i: number) => {
    setDayCount(i);
  }

  const daysCount = [3, 7, 14]
  return (
    <>

      <View style={recents.widgetHeader}>
        <Text style={styles.h3}>Recent Workouts</Text>
        <TouchableOpacity style={recents.widgetModalButton} onPress={() => handleDaySwitchModalVisibility()} >
          <Text style={[styles.p, styles.lighterFont]}> Show {daysCount[dayCount]} </Text>
          <Entypo name="chevron-thin-down" size={14} color={colors.lighter} />
        </TouchableOpacity>
      </View>
  
      <View style={recents.widgetBody}>
        {fakeData.slice(0,daysCount[dayCount] ).map((workOut, index) => {
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
      {isDayModalVisible &&
        <BottomModal
          onSelectionPress={(selectionIndex) => handleDayCount(selectionIndex)}
          onExitPress={() => handleDaySwitchModalVisibility()}
          selections={['Previous 3 days', 'Previous 7 days', 'Previous 14 days']}
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