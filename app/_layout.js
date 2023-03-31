import { Stack, useRouter, Slot } from "expo-router";
import colors from './colors';
import { FontAwesome5, AntDesign } from '@expo/vector-icons'; 
import { TouchableOpacity, Text, View } from "react-native";
import { useFonts } from "expo-font";
import Loading from "./screens/loading/loading";
import React, { useState } from 'react'
import { WorkoutContext } from "./contexts/workoutContext";
import { fonts } from "./utilities";

const WorkoutIcon = () => {
    return (
        <TouchableOpacity onPress={() => handle()}>
            <View style={{ paddingHorizontal: 10 }}>
                <FontAwesome5 name="dumbbell" size={22} color={colors.yellow} />
                <AntDesign name="plus" size={11} color={colors.yellow}
                    style={{
                        position: "absolute",
                        top: 0,
                        right: 0
                    }}
                />
            </View>
        </TouchableOpacity>
    );
}
export default () => {
    const [inActiveWorkout, setInActiveWorkout] = useState();
    const [workoutName, setWorkout] = useState();
    const [workoutDate, setWorkoutDate] = useState();
    const [targetMuscles, setTargetMuscles] = useState();

    
    const [fontsLoaded] = useFonts(fonts);
    if (!fontsLoaded) {
        return  <Loading/>
    }
    return (
        <WorkoutContext.Provider
            value={{
                workoutName, setWorkout,
                inActiveWorkout, setInActiveWorkout,
                workoutDate, setWorkoutDate,
                targetMuscles, setTargetMuscles
            }}>
            <Stack
                screenOptions={{
                    headerBackVisible: false,
                    headerShadowVisible: false,
                    headerTintColor: colors.white,
                    headerStyle: { backgroundColor: colors.darker },
                    headerTitleStyle: { fontFamily: "Nunito-Regular" },
                    contentStyle: { fontFamily: "Nunito-Regular"},
                    headerLargeTitleStyle: { fontFamily: "Nunito-Regular"},
                    headerBackTitleStyle: { fontFamily: "Nunito-Regular"},
                    headerTitleStyle: {
                        fontFamily: "Nunito-Regular",
                        fontSize: 24,
                    },
                    headerBackTitle: ' ',
                    headerRight: () => <WorkoutIcon/>
                }}
            />
        </WorkoutContext.Provider>
    );
}