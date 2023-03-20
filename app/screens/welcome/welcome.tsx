import React, { FunctionComponent } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { Fontisto, MaterialCommunityIcons } from '@expo/vector-icons'; 
import { Link, Stack } from "expo-router";
import styles from "../../style";
import colors from "../../colors";


const Welcome: FunctionComponent = () => {

    return (
        <View style={styles.welcomeBackground}>
            <Stack.Screen options={{ headerShown: false }}/>

            <Text style={[styles.h1, styles.lighterFont]}>FitTrackr</Text>
            {/*<Image
                  style={{ height:150, aspectRatio: 1}}
                  source={require('./dumbbell.png')}
            />*/}
            <MaterialCommunityIcons
                name="lightning-bolt-outline"
                size={96}
                color={colors.yellow}
                style={{ 
                    transform: [{rotate: '120deg'}]
                }}
            />
            <View style={{ width: '90%' }}>
                <Text style={[styles.h2, styles.lighterFont]}>Using FitTrackr{"\n"}
                    Start tracking your fitness{"\n"}journey today!</Text>
            </View>

            <Link href="/screens/tabs/_navigator" asChild>
                <TouchableOpacity style={{
                    backgroundColor: colors.primary,
                    borderRadius: 50,
                    flexDirection: 'row',
                    alignItems: "center",
                    justifyContent: 'space-between',
                    paddingVertical: 24,
                    paddingHorizontal: 32,
                    width: '90%',
                    borderColor: colors.black,
                    borderWidth: StyleSheet.hairlineWidth,
                }}>
                    <Text style={[styles.h3, {fontFamily:"Inter-Bold"}]}>Add new workout</Text>
                    <Fontisto name="arrow-right" size={24} color="white" />
                </TouchableOpacity >
            </Link>
        </View>
  )
}

export default Welcome;



