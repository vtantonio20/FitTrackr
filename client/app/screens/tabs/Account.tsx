import React,{ FunctionComponent, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, } from 'react-native';
import styles from "../../style"
import { useUser } from '../../contexts/UserContext';
import { form } from '../modals/Workout';
import colors from '../../colors';
import { ActionSelectionModal } from '../../components/Modal';
import { useRouter } from 'expo-router';
import Loading from '../loading/Loading';

const Account: FunctionComponent = () => {
  const { user, setUser, measureType, toggleMeasureType} = useUser();
  const router = useRouter();

  const [showAboutModal, setShowAboutModal] = useState(false);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const handleLogout = () => {
    setUser(null);
    router.push({pathname:'/screens/welcome/Welcome'})
  }

  const handleManageWeeklyRoutinePress = () => {
    router.push({pathname:'/screens/modals/WeeklyRoutine'})
  }
  if (!user) {
    return <Loading/>
  }

  return (
    <ScrollView style={styles.tabContainer}>
      <View style={[styles.containerWrapper, {paddingVertical:14}]}>
        {user && 
          <Text style={[form.elementHeader, styles.h3]}>Account: 
            <Text style={form.formTextArea}> {user.email}</Text>
          </Text>
        }
        {/* <View style={styles.widgetHeader}>
          <Text style={form.elementHeader}>Preferences:</Text>
        </View> */}

        <View style={[styles.divider, {backgroundColor:colors.primary, borderTopLeftRadius: 7, borderTopRightRadius:7}]}>
          <TouchableOpacity onPress={() => setShowAboutModal(true)} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding:14 }}>
            <Text style={styles.h4}>About</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.divider, {backgroundColor:colors.primary}]}>
          <TouchableOpacity onPress={() => handleManageWeeklyRoutinePress()} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding:14 }}>
            <Text style={styles.h4}>Manage weekly routine</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.divider, {backgroundColor:colors.primary}]}>
          <TouchableOpacity onPress={() => toggleMeasureType()} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding:14 }}>
            <Text style={styles.h4}>Unit of Measurement</Text>
            <Text style={styles.p}> {measureType} </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.divider, {backgroundColor:colors.primary, borderBottomLeftRadius: 7,  borderBottomRightRadius:7}]}>
          <TouchableOpacity onPress={() => setShowLogoutModal(true)} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding:14 }}>
            <Text style={[styles.h4, {color:colors.red}]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
      {showLogoutModal && (
          <ActionSelectionModal
          title={"Are you sure you want to logout?"}
          onExitPress={() => setShowLogoutModal(false)}
          selections={[
            {text:'Confirm Logout', textStyle:{color:colors.red}, action:() => {handleLogout()}},
            {text:'Cancel', action: () => console.log("Cancel")}
          ]}
        />
      )}
      {showAboutModal && (
        <ActionSelectionModal
          title={"About FitTrackr"}
          onExitPress={() => setShowAboutModal(false)}
          selections={[
            {text:'FitTrackr created in 2024'},
            {text:'Close'}
          ]}
        />
      )}
    </ScrollView>
  );
}

export default Account;
