import { Stack, useRouter } from "expo-router";
import colors from './colors';
import { FontAwesome5, AntDesign } from '@expo/vector-icons'; 
import { TouchableOpacity, Text, View } from "react-native";
import style from "./style";
import { useFonts } from "expo-font";
import Loading from "./screens/loading/loading";



const WorkoutIcon = () => {
    const router = useRouter();

    return (
        <TouchableOpacity>
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
    const [fontsLoaded] = useFonts({
        "Lato-Bold": require("../assets/fonts/Lato/Lato-Bold.ttf"),
        "Lato-Regular": require("../assets/fonts/Lato/Lato-Regular.ttf"),
        "Lato-Light": require("../assets/fonts/Lato/Lato-Light.ttf"),
        "Nunito-Regular": require("../assets/fonts/Nunito/Nunito-Regular.ttf"),
        "Nunito-Light": require("../assets/fonts/Nunito/Nunito-Light.ttf"),
        "Nunito-Bold": require("../assets/fonts/Nunito/Nunito-Bold.ttf"),
        "Inter-Regular": require("../assets/fonts/Inter/static/Inter-Regular.ttf"),
        "Inter-Light": require("../assets/fonts/Inter/static/Inter-Light.ttf"),
        "Inter-Bold": require("../assets/fonts/Inter/static/Inter-Bold.ttf"),
      });
    
      if (!fontsLoaded) {
        return  <Loading/>
      }

      return (
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
    );
    


}