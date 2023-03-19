import React, { FunctionComponent } from 'react'
import { View, Text, Image, TouchableOpacity, Pressable } from 'react-native'
import { Fontisto } from '@expo/vector-icons'; 
import { Link, Stack } from "expo-router";
import styles from "../../style";
import colors from "../../colors";
const Welcome: FunctionComponent = () => {

    return (
        <View style={styles.welcomeBackground}>
            <Stack.Screen options={{ headerShown: false }}/>

            <Text style={styles.h3}>FitTrackr</Text>
            <Image
                  style={{ height:150, aspectRatio: 1}}
                  source={require('./ARM.png')}
            />
            <View style={{ width: '90%' }}>
                <Text style={[styles.h4, {fontFamily: "Lato-Light"}]}>Using FitTrackr{"\n"}
                    Start tracking your fitness{"\n"}journey today!</Text>
            </View>

            <Link href="/screens/home/home" asChild>
                <TouchableOpacity style={{
                    backgroundColor: colors.black,
                    borderRadius: 50,
                    flexDirection: 'row',
                    alignItems: "center",
                    justifyContent: 'space-between',
                    paddingVertical: 24,
                    paddingHorizontal: 32,
                    width: '90%',
                    borderColor: colors.white,
                    borderWidth: 1,
                    
                }}>
                    <Text style={styles.h5}>Add new workout</Text>
                    <Fontisto name="arrow-right" size={24} color="white" />
                </TouchableOpacity >
            </Link>
        </View>

  )
}

export default Welcome;



