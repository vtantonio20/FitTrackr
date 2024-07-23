import React, { FunctionComponent, useEffect } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { Fontisto, FontAwesome5,AntDesign } from '@expo/vector-icons'; 
import { Link, Stack, useRouter } from "expo-router";
import styles from "../../style";
import colors from "../../colors";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
WebBrowser.maybeCompleteAuthSession();


const Welcome: FunctionComponent = () => {
  
  const androidClientId = process.env.ANDROID_CLIENT_ID
  const iosClientId = process.env.IOS_CLIENT_ID

  const config = {
    androidClientId,
    iosClientId
  }

  const [request, response, promptAsync] = Google.useAuthRequest(config);
  
  const handleToken = () => {
    if (response?.type === 'success') {
      const {authentication} = response;
      const token = authentication?.accessToken;
      console.log("access token" , token)
    }
  }

  useEffect(() => {
    handleToken();
  }, [response]);

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



