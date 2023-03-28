import React, { FunctionComponent, useState, useContext } from 'react'
import { View, StyleSheet, Platform, Settings } from 'react-native'
import Account from './account'
import Home from './home'
import { AntDesign, Feather, Ionicons  , FontAwesome5, FontAwesome} from '@expo/vector-icons'; 
import { Stack, useRouter } from 'expo-router';
import colors from '../../colors'
import { StatusBar } from 'expo-status-bar'
import Calender from './calender'
import Setting from './setting'
import { TabButton } from '../../components/tabButton';


const Navigator: FunctionComponent = () => {
  const [activeTab, setActiveTab] = useState('home');
  const renderTab = () => {
    if (activeTab === 'home')
      return <Home />
    if (activeTab === 'account')
      return <Account />
    if (activeTab === 'settings')
      return <Setting />
    if (activeTab === 'calendar')
      return <Calender />
  }

  return (
    <>
      <Stack.Screen options={{ title: 'FitTrackr',}}/>
      <StatusBar style="light"/>
      {renderTab()}
      <View style={styles.optionsContainer}>
        <View style={styles.optionsRow}>

          <TabButton
            onPress={() => setActiveTab('home')}
            icon={<FontAwesome5 name="home" size={28} color={'home' === activeTab ? colors.yellow : colors.white} />} 
            name='Home'
            focused={'home' === activeTab}
          />
          {/*
          <TabButton
            onPress={() => setActiveTab('workout')}
            icon={<FontAwesome5 name="dumbbell" size={24} color={'workout' === activeTab ? colors.yellow : colors.white} />} 
            name='New Workout'
            focused={'workout' === activeTab}
          />*/}


          <TabButton
            onPress={() => setActiveTab('calendar')}
            icon={<FontAwesome  name="calendar" size={28} color={'calendar' === activeTab ? colors.yellow : colors.white} />} 
            name='Calender'
            focused={'calendar' === activeTab}
          />

          <TabButton
            onPress={() => setActiveTab('account')}
            icon={<FontAwesome name="user" size={28} color={'account' === activeTab ? colors.yellow : colors.white} />} 
            name='Account'
            focused={'account' === activeTab}
          />


        </View>
      </View>
    </>
  )
}


const styles = StyleSheet.create({
  optionsContainer: {
    position: "absolute",
    width: "100%",
    height:  Platform.OS === 'ios' ? 95 : 85,
    bottom: 0,
    borderTopWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 1
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.darker,
    height: "100%",
    paddingBottom: Platform.OS === 'ios' ? 25 : 0
  },
})


export default Navigator;