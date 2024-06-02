import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Navigator from "./screens/tabs/_navigator";
import { useFonts } from "expo-font";
import Loading from "./screens/loading/loading";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Stack } from "expo-router";
import colors from "./colors";
import { FontAwesome5, AntDesign } from '@expo/vector-icons'; 
import { fonts } from "./utilities";
import Welcome from "./screens/welcome/welcome";

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
