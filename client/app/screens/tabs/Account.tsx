import React,{ FunctionComponent, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, } from 'react-native';
import styles from "../../style"
import { useUser } from '../../contexts/UserContext';
import { form } from '../modals/Workout';
import colors from '../../colors';
import { ActionSelectionModal } from '../../components/Modal';
import { useRouter } from 'expo-router';

const Account: FunctionComponent = () => {
  const { user, setUser } = useUser();
  const router = useRouter();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const handleLogout = () => {
    setUser(null);
    router.push({pathname:'/screens/welcome/Welcome'})
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
          <TouchableOpacity style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding:14 }}>
            <Text style={styles.h4}>Unit of Measurement</Text>
            <Text style={styles.p}> Imperial </Text>
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
    </ScrollView>
  );
}

export default Account;
