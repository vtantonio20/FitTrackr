import { Stack, useRouter } from "expo-router";
import colors from './colors';
import { Ionicons  } from '@expo/vector-icons'; 
import { TouchableOpacity, Text, View } from "react-native";
import style from "./style";
const Header = () => {
    return (
        <View
            style={{
                backgroundColor: colors.primary,
                height: 100,
                flexDirection: 'row',
                justifyContent: "space-between",
                alignItems: "flex-end",
                padding:20
            }}>
            <Title/>
            <SettingsIcon/>
        </View>  
    );
}
const SettingsIcon = () => {
    return (
        <TouchableOpacity>
            <Ionicons  name="settings-outline" size={28} color="white" />
        </TouchableOpacity>
    );
}
const Title = () => {
    return (
        <Text style={style.h2}>FitTrackr</Text>
    )
}
export default () => {
    const router = useRouter();
    return (
        <Stack
            screenOptions={{
                headerBackVisible: false,
                headerShadowVisible: false,
                headerTintColor: colors.white,
                headerStyle: { backgroundColor: colors.primary },
                header: () => <Header/>,
            }}
        >
        </Stack>

    );
}