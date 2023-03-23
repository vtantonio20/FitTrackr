import React, { FunctionComponent, useState } from 'react'
import { Modal, Image, View, Text, StyleSheet, TouchableOpacity, GestureResponderEvent, Platform, TouchableHighlight, ScrollView } from 'react-native'
import colors from '../../colors';
import styles from "../../style"
import { MaterialIcons, Feather, Entypo , AntDesign, FontAwesome} from '@expo/vector-icons'; 
import { StatusBar } from 'expo-status-bar';
import CircleButton from '../../components/circleButton';
import TabButton from '../../components/tabButton';
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import BottomModal from '../../components/smallModal';

interface WorkoutProps {
  workoutName: string,
  day: string,
  date: Date,
  onPress: () => void
}

const DayCard: FunctionComponent<WorkoutProps> = (props: WorkoutProps) => {
  return (
    <View style={{
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 7,
      paddingHorizontal: 14,
    }}>
      <View style={{ width:'40%'}}>
        <Text style={[styles.h4]}>
          {props.day}
        </Text>
        <Text style={[styles.p, styles.lighterFont]}>
          {props.date.toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' })}
        </Text>
      </View>
      <View style={{ width: '50%' }}>
        <Text style={[styles.h4]}>{props.workoutName }</Text>
      </View>
      <TouchableOpacity  onPress={props.onPress}>
        <Feather name="info" size={24} color={colors.yellow} />
      </TouchableOpacity>
    </View>
  );
}

const RecentsWidget: FunctionComponent = () => {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const changeDays = () => {
    if (!isModalVisible)
      setIsModalVisible(true)
  }
  const daysCount = [3, 7, 14]
  const days = ['Past 3 days', 'Past 7 days', 'Past 14 days']
  const [index, setIndex] = useState(0);

  return (
    <>
      <View style={recents.widgetHeader}>
        <Text style={styles.h3}>Recent Workouts</Text>
        <TouchableOpacity style={recents.widgetModalButton} onPress={() => changeDays()} >
          <Text style={[styles.p, styles.lighterFont]}> Show {daysCount[index]} </Text>
          <Entypo name="chevron-thin-down" size={14} color={colors.lighter} />
        </TouchableOpacity>
      </View>
  
      <View style={recents.widgetBody}>
        {data.slice(0,daysCount[index] ).map((workOut, i) => {
          return (
            <View key={workOut.id}>
              <DayCard
                onPress={() => router.push('/screens/modals/details')}
                day={workOut.day}
                workoutName={workOut.workoutName}
                date={workOut.date}
              />
              {i + 1 !== data.length && <View style={styles.divider} />}
          </View>
          );
        })}
      </View>
      {isModalVisible &&
        <BottomModal
        header={
          <View style={recents.widgetModalHeader}>
            <Text style={[styles.h3, { paddingRight:7 }]}>Set Range</Text>
            <MaterialIcons name="date-range" size={24} color="white" />
          </View>
        }
        onExitPress={() => setIsModalVisible(false)}
        selections={days}
        onSelectionPress={setIndex}
        />
      }
    </>
  );
}

const ActiveWidget: FunctionComponent = () => {
  const [inActiveWorkout, setInActiveWorkout] = useState(true);
  const router = useRouter();
  return (
    <>
      <View style={styles.widgetHeader}>
        {inActiveWorkout ?
          <Text style={styles.h3}>Active Workout</Text>
          :
          <Text style={styles.h3}>Todays Workout</Text>
        }
      </View>

      <TouchableOpacity style={recents.widgetBody} onPress={() => router.push('/screens/modals/workout')}>
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent:"center",
          paddingVertical: 14,
          paddingHorizontal: 14,
        }}>
          <Text style={[styles.h4, {lineHeight:28}]}>Begin new workout</Text>
          <AntDesign name="plus" size={28} color={colors.yellow} />
        </View>
      </TouchableOpacity>
    </>
  );
}

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

const data = [
  { day: 'Monday', workoutName: 'Quads & Glutes', date: new Date(), id:'1' },
  { day: 'Wednesday', workoutName: 'Chest & Bi', date: new Date(), id:'2' },
  { day: 'Friday', workoutName: 'Shoulders', date: new Date(), id: '3' },
  { day: 'Thursday', workoutName: 'ASS DAY', date: new Date(), id: '4' },
  { day: 'Tuesday', workoutName: 'Legs', date: new Date(), id: '5' },
  { day: 'Monday', workoutName: 'Back & Bi', date: new Date(), id: '6' },
  { day: 'Monday', workoutName: 'Quads & Glutes', date: new Date(), id:'7' },
  { day: 'Wednesday', workoutName: 'Chest & Bi', date: new Date(), id:'8' },
  { day: 'Friday', workoutName: 'Shoulders', date: new Date(), id: '9' },
  { day: 'Thursday', workoutName: 'ASS DAY', date: new Date(), id: '10' },
  { day: 'Tuesday', workoutName: 'Legs', date: new Date(), id: '50' },
  { day: 'Monday', workoutName: 'Back & Bi', date: new Date(), id: '60' },
  { day: 'Monday', workoutName: 'Back & Bi', date: new Date(), id: '66' },
  { day: 'Monday', workoutName: 'Back & Bi', date: new Date(), id: '65' }


];


export default Home;

const recents = StyleSheet.create({
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


/*

const Card = (props:any) => {
  return (
    <View style={{
      borderWidth: 1,
      borderRadius: 2,
      borderColor: '#ddd',
      borderBottomWidth: 0,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
      marginLeft: 5,
      marginRight: 5,
      marginTop: 10
    }}>
    </View>
  );
}
<Stack.Screen
  options={{

    title: "Home",
    headerBackVisible: false,
  }} 
/>


        */