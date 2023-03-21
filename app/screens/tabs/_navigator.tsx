import React, { FunctionComponent, useState } from 'react'
import { View, StyleSheet, Platform } from 'react-native'
import Account from './account'
import Home from './home'
import Workout from './workout'
import { AntDesign, Feather, Entypo , FontAwesome5, FontAwesome} from '@expo/vector-icons'; 
import { useRouter } from 'expo-router';
import TabButton from '../../components/tabButton'
import colors from '../../colors'
import { StatusBar } from 'expo-status-bar'


const Navigator: FunctionComponent = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderTab = () => {
    if (activeTab === 'home')
      return <Home />
    if (activeTab === 'account')
      return <Account />
    if (activeTab === 'workout')
      return <Workout />
  }

  return (
    <>
      <StatusBar style="light"/>
      {renderTab()}
      <View style={styles.optionsContainer}>
        <View style={styles.optionsRow}>

          <TabButton
            onPress={() => setActiveTab('home')}
            icon={<FontAwesome5 name="home" size={24} color={'home' === activeTab ? colors.yellow : colors.white} />} 
            name='Home'
            focused={'home' === activeTab}
          />
          <TabButton
            onPress={() => setActiveTab('workout')}
            icon={<FontAwesome5 name="dumbbell" size={24} color={'workout' === activeTab ? colors.yellow : colors.white} />} 
            name='New Workout'
            focused={'workout' === activeTab}
          />
          <TabButton
            onPress={() => setActiveTab('account')}
            icon={<FontAwesome name="user" size={24} color={'account' === activeTab ? colors.yellow : colors.white} />} 
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
    height:  85,
    bottom: 0,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.primary,
    height: "100%",
    paddingBottom: Platform.OS === 'ios' ? 25 : 0
  },
})


export default Navigator;