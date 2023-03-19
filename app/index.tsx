import { StyleSheet, Text, View } from "react-native";
import Welcome from "./screens/welcome/welcome";
import { useFonts } from "expo-font";
import 'react-native-gesture-handler';
import Loading from "./screens/loading/loading";

export default function Page() { 
  const [fontsLoaded] = useFonts({
    "Lato-Bold": require("../assets/fonts/Lato-Bold.ttf"),
    "Lato-Regular": require("../assets/fonts/Lato-Regular.ttf"),
    "Lato-Light": require("../assets/fonts/Lato-Light.ttf")
  });

  if (!fontsLoaded) {
    return  <Loading/>
  }
  return (
    <Welcome/>
  );
}
