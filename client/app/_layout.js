import { QueryClient, QueryClientProvider } from 'react-query';
import { Stack, useRouter, Slot } from "expo-router";
import colors from './colors';
import { FontAwesome5, AntDesign } from '@expo/vector-icons'; 
import { TouchableOpacity, Text, View } from "react-native";
import { useFonts } from "expo-font";
import Loading from "./screens/loading/Loading";
import React from 'react'
import { fonts } from "./utilities";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { UserProvider } from './contexts/UserContext';

export const WorkoutIcon = (props) => {
  const router = useRouter();
  const handleWidgetPress = () => props.enabled && router.push('/screens/modals/Workout');
  const iconColor = props.enabled ? colors.yellow : colors.secondary;
  
  return (
    <TouchableOpacity onPress={handleWidgetPress}>
      <View style={{ paddingHorizontal: 10 }}>
        <FontAwesome5 name="dumbbell" size={22} color={iconColor} />
        <AntDesign name="plus" size={11} color={iconColor}
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

const queryClient = new QueryClient();

export default () => {
    const [fontsLoaded] = useFonts(fonts);
    if (!fontsLoaded) {
        return  <Loading/>
    }
    return (
      <UserProvider>
        <QueryClientProvider client={queryClient}>
            <GestureHandlerRootView >
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
                        headerRight: () => <WorkoutIcon enabled={true}/>
                    }}
                />
            </GestureHandlerRootView>

        </QueryClientProvider>
      </UserProvider>
    );
}