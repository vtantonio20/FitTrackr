import { Stack, Tabs,useRouter } from "expo-router";
import colors from './colors';
import { Ionicons  } from '@expo/vector-icons'; 
import { TouchableOpacity } from "react-native";

const SettingsIcon = () => {
    return (
        <TouchableOpacity>
            <Ionicons  name="settings-outline" size={28} color="white" />
        </TouchableOpacity>
    );
}

export default () => {
    const router = useRouter();
    return (
        <Stack
            screenOptions={{
                headerBackVisible: false,
                headerShadowVisible: false,
                headerTitle: 'FitTrackr',
                headerTintColor: colors.white,
                headerStyle: { backgroundColor: colors.primary },
                headerRight: () => <SettingsIcon/>
            }}
        >
        </Stack>

    );
}