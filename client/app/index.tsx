import { useFonts } from "expo-font";
import Loading from "./screens/loading/Loading";
import { StatusBar } from "expo-status-bar";
import { fonts } from "./utilities";
import Welcome from "./screens/welcome/Welcome";

export default function Page() { 

  <StatusBar style="light" />
  const [fontsLoaded] = useFonts(fonts);
  if (!fontsLoaded) {
    return  <Loading/>
  }
  return (
    <>
      <Welcome />
    </>
  ) 
}
