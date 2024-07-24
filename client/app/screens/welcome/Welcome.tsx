import React, { FunctionComponent, useEffect } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { Fontisto, FontAwesome5,AntDesign } from '@expo/vector-icons'; 
import { Link, Stack, useRouter } from "expo-router";
import styles from "../../style";
import colors from "../../colors";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { User, useUser } from '../../contexts/UserContext';

WebBrowser.maybeCompleteAuthSession();

const Welcome: FunctionComponent = () => {

  const { setUser } = useUser();
  
  const androidClientId = process.env.ANDROID_CLIENT_ID
  const iosClientId = process.env.IOS_CLIENT_ID

  const config = {
    androidClientId,
    iosClientId
  }

  const [request, response, promptAsync] = Google.useAuthRequest(config);
  
  const getUserProfile = async (token:string | undefined) => {
    if(!token) return;
    try {
      const response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: {Authorization: `Bearer ${token}`}
      })
      const userData = await response.json();
      const user:User = {
        id:userData.id,
        name:userData.name,
        email:userData.email
      }
      setUser(user);
    } catch(e) {
      console.log(e)
    }
  }

  const handleToken = () => {
    if (response?.type === 'success') {
      const {authentication} = response;
      const token = authentication?.accessToken;
      getUserProfile(token)
    }
  }

  useEffect(() => {
    handleToken();
  }, [response]);

  const promptTestUser = () => {
    const user:User = {
      id: 'tester',
      name: 'Mr. Test',
      email: 'testing@email.com'
    }
    setUser(user)
  }


  return (
      <View style={styles.welcomeBackground}>
        <Stack.Screen options={{ headerShown: false }}/>

        <Text style={[styles.h1, styles.lighterFont]}>FitTrackr</Text>
        {/*<Image
              style={{ height:150, aspectRatio: 1}}
              source={require('./dumbbell.png')}
        />*/}
        <View style={{ paddingHorizontal: 40 }}>
          <FontAwesome5 name="dumbbell" size={88} color={colors.yellow} />
          <AntDesign name="plus" size={44} color={colors.yellow}
            style={{
              position: "absolute",
              top: 0,
              right: 0
            }}
          />
        </View>
        <View style={{ width: '90%' }}>
          <Text style={[styles.h3, styles.lighterFont]}>Using FitTrackr{"\n"}
            Start tracking your fitness{"\n"}journey today!
          </Text>
        </View>

        <TouchableOpacity onPress={() => promptAsync()}>
            <Text style={{color:colors.white}}>Login with google</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => promptTestUser()}>
          <Text style={{color:colors.white}}>Login with a Test User</Text>
        </TouchableOpacity>
        <Link replace href="/screens/tabs/_navigator" asChild>
          <TouchableOpacity style={{
            backgroundColor: colors.primary,
            borderRadius: 50,
            flexDirection: 'row',
            alignItems: "center",
            justifyContent: 'space-between',
            paddingVertical: 24,
            paddingHorizontal: 32,
            width: '90%',
            borderColor: colors.darker,
            borderWidth: StyleSheet.hairlineWidth,
          }}>
            <Text style={[styles.h3, ]}>Next</Text>
            <Fontisto name="arrow-right" size={24} color="white" />
          </TouchableOpacity >
        </Link>
    </View>
  )
}

export default Welcome;



