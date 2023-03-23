import { StyleSheet, Text, View } from "react-native";
import Welcome from "./screens/welcome/welcome";
import { useFonts } from "expo-font";
import Loading from "./screens/loading/loading";
import { StatusBar } from "expo-status-bar";

export default function Page() { 
  <StatusBar style="light" />

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
    <Welcome/>
  );
}
