import React, { FunctionComponent } from 'react'
import { Image, View, Text,  TouchableOpacity } from 'react-native'
import colors from '../../colors';
import styles from "../../style"
import { AntDesign, Feather, Entypo } from '@expo/vector-icons'; 
import { StatusBar } from 'expo-status-bar';

interface Workout {
  workoutName: string,
  day: string,
  date: Date
}

const DayCard: FunctionComponent<Workout> = (props: Workout) => {
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
        <Text style={[styles.h4, {}]}>{props.workoutName }</Text>
      </View>
      <TouchableOpacity>
        <Feather name="info" size={24} color={colors.yellow} />
      </TouchableOpacity>
    </View>
  );
}

const Home: FunctionComponent = () => {
  return (
    <>
      <StatusBar style="light"/>
      <View style={styles.container}>
        <View style={{ paddingHorizontal: 14 }}>
          <View style={[styles.flexRow, {paddingVertical: 14}]}>
            <View>
              <Text style={[styles.h3]}>Recent Workouts</Text>
              <Text style={[styles.p, styles.lighterFont, { paddingVertical: 1.5}]}>Previous 3 Days</Text>
            </View>

            <View style={styles.flexRow}>
              <TouchableOpacity style={[styles.flexRow, { marginRight: 14}]}>
                <Text style={styles.p}>Past 3 days</Text>
                <Entypo name="chevron-down" size={24} color={colors.white} />
              </TouchableOpacity>
              <TouchableOpacity>
                <AntDesign name="calendar" size={24} color={colors.white} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={[ {backgroundColor:colors.primary, borderRadius: 7 }]}>
            {data.map((workOut, index) => {
              return (index + 1 != data.length) ?
                <View key={workOut.day}>
                  <DayCard day={workOut.day} workoutName={workOut.workoutName} date={workOut.date} />
                  <View style={styles.divider} />
                </View>
              :
                <DayCard key={workOut.day} day={workOut.day} workoutName={workOut.workoutName} date={workOut.date} />
            })}
          </View>
        </View>
      </View>
    </>
  )
}
let data: Workout[] = [
  { day: 'Monday', workoutName: 'Quads & Glutes', date: new Date() },
  { day: 'Wednesday', workoutName: 'Chest & Bi', date: new Date() },
  { day: 'Friday', workoutName: 'Back & Tri', date: new Date() }
];
export default Home;
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