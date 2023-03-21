import { Stack } from 'expo-router';
import React from 'react'
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import colors from '../../colors';
import styles from '../../style';
import { Entypo, AntDesign } from '@expo/vector-icons'; 

const Title = () => {
  return (
      <Text style={styles.h3}></Text>
  )
}

const WorkoutDetails = () => {
  return (
    <>
    <Stack.Screen
      options={{
        headerBackVisible: true,
      }}
    />
      <View style={[styles.container]}>
        <View style={[styles.flexRow, { paddingVertical: 14 }]}>
          <View>
            <Text style={[styles.h3]}>Recent Workouts</Text>
            <TouchableOpacity style={[styles.flexRowLeft, { paddingTop: 7}]}>
              <Text style={[styles.h4, styles.lighterFont]}>Previous 3 Days</Text>
              <Entypo name="chevron-down" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
              <AntDesign name="calendar" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </>

  )
}

export default WorkoutDetails;