import React, { FunctionComponent, useEffect, useState } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, Button } from 'react-native'
import { Fontisto, FontAwesome5,AntDesign } from '@expo/vector-icons'; 
import { Link, Stack, useRouter } from "expo-router";
import styles from "../../style";
import colors from "../../colors";
import * as WebBrowser from "expo-web-browser";
import { GoogleSignin, GoogleSigninButton, User, statusCodes } from '@react-native-google-signin/google-signin';
import * as AuthSession from "expo-auth-session";

import AsyncStorage from '@react-native-async-storage/async-storage';
const Welcome: FunctionComponent = () => {
    const router = useRouter;
    // const [userInfo, setUserInfo] = React.useState(null);
    // const redirectUri = AuthSession.makeRedirectUri({
    //     native:'exp://fit_trackr',
    //     preferLocalhost:true
    // })
    // const [request, response, promptAsync] = Google.useAuthRequest({
    //     androidClientId: "324981128836-nagdhtog3ai8h09dpc5jd09cgd9astn3.apps.googleusercontent.com",
    //     iosClientId: "324981128836-vd4fiuvh0nnmr8pbratf0ajmgupmb9ua.apps.googleusercontent.com",
    //     redirectUri: redirectUri,
    //     scopes: ['profile', 'email'],
    // })
    
    // useEffect(() => {
    //     handleSignInWithGoogle();
    // }, [response]);

    // const handleSignInWithGoogle = async () => {
    //     const user = await AsyncStorage.getItem("@user")

    //     if (!user) {
    //         if (response?.type === "success") {
    //             await getUserInfo(response.authentication?.accessToken)
    //         }
    //     } else {
    //         setUserInfo(JSON.parse(user));
    //     }
    // }

    // const getUserInfo = async (token:any) => {
    //     console.log(token)
    //     if(!token) return;
    //     try {
    //         const response = await fetch(
    //             "https://www.googleapis.com/userinfo/v2/me",
    //             {
    //                 headers: { Authorization: `Bearer ${token}`},
    //             }
    //         );

    //         const user = await response.json();
    //         await AsyncStorage.setItem("@user", JSON.stringify(user));
    //         setUserInfo(user);
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    const [error, setError] = useState<string | null>();
    const [userInfo, setUserInfo] = React.useState<User | null>(null);

    const configureGoogleSignIn = () => {
        GoogleSignin.configure({
          webClientId:
            "72307864794-vrqf4k859s84o77u52b06l2btc1ap73o.apps.googleusercontent.com",
          androidClientId:
            "72307864794-v5k7ua1dkhnb3f8s1ccnru8b5gfa70ck.apps.googleusercontent.com",
          iosClientId:
            "72307864794-1vuq2apibl4tg6on2f2nmoq5vul3ltvq.apps.googleusercontent.com",
        });
      };
    
      useEffect(() => {
        configureGoogleSignIn();
      });

    const signIn = async () => {
        console.log("Pressed Sign in")

        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            setUserInfo(userInfo);
            setError(null);
        } catch (error:any) {
            setError(JSON.stringify(error))
        }
    };

    return (
        <View style={styles.welcomeBackground}>
            <Stack.Screen options={{ headerShown: false }}/>
            {/* <Text>{JSON.stringify(userInfo)}</Text> */}
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
                    Start tracking your fitness{"\n"}journey today!</Text>
            </View>

            {/* <GoogleSigninButton size={GoogleSigninButton.Size.Standard} color={GoogleSigninButton.Color.Dark} onPress={signIn}/> */}
            {/* <Button title='Sign in with Google' onPress={() => {}}/> */}
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



