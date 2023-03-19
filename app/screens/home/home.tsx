import { Stack } from 'expo-router';
import React, { FunctionComponent } from 'react'
import { Image, View, Text, SafeAreaView, ScrollView, StyleSheet, FlatList } from 'react-native'
import colors from '../../colors';
import styles from "../../style"
import { AntDesign } from '@expo/vector-icons'; 
import { Feather } from '@expo/vector-icons'; 

const DayCard: FunctionComponent = (props: any) => {
  return (
    <View style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderColor: colors.white,
      borderWidth: StyleSheet.hairlineWidth,
      marginVertical: 7,
      paddingVertical: 7,
      paddingHorizontal: 14,
      marginHorizontal: 14,
      borderRadius: 7
    }}>
      <View>
        <Text style={[styles.h3]}>Monday</Text>
        <Text style={[styles.h3, {fontFamily:"Lato-Light"}]}>Legs</Text>
      </View>
      <View>
        <Text style={[styles.h3, {fontFamily:"Lato-Light"}]}>3/19/23</Text>
      </View>
      <Feather name="info" size={24} color="white" />
    </View>
  );
}
const Logo: FunctionComponent = (props:any) => {
  return (
    <Image
      style={{ height:40, width:40, aspectRatio: 1}}
      source={require('./ARM.png')}    />
    /*<AntDesign name="user" size={32} color="white" />*/
  );
}

const Title: FunctionComponent = (props: any) => {
  return (
    <View>
      <Text style={[styles.h3]}>Hello Michael</Text>
      <Text style={[styles.p, {color:colors.white, fontFamily:"Lato-Light", paddingVertical: 7}]}>Welcome back</Text>
    </View>
  )
}

const Home: FunctionComponent = (props:any) => {
  return (
    <>
      <Stack.Screen
        options={{
          headerBackVisible: false,
          headerTitle: '',
          headerStyle: { backgroundColor: colors.primary },
          contentStyle: { backgroundColor: colors.primary, paddingVertical: 7 },
          headerLeft: (props:any) => <Title {...props} />,
          headerRight: (props: any) => <Logo {...props} />,
        }}
        
      />
      {//<View style={{ borderBottomColor: colors.secondary, borderBottomWidth: StyleSheet.hairlineWidth }} />
      }
      <View style={styles.container}>
        <View>
          <Text style={[ styles.h2, { paddingLeft: 14, paddingTop: 10 }]}>Workout History</Text>
          <Text style={{ color:colors.white, paddingLeft: 14, paddingTop: 7, fontFamily: "Lato-Light" }}>Previous 7 Days</Text>
        
          <DayCard/>
          <DayCard />
          <DayCard />
          <DayCard />
          <DayCard />
          <DayCard/>
        </View>
      </View>
    </>
  )
}


interface CardProps {
  headerText: string,
  image?: string,
  bodyText: string
}


export default Home;
/*

const Card = (props:any) => {
  return (
    <View style={{
      borderWidth: 1,
      borderRadius: 2,
      borderColor: '#ddd',
      borderBottomWidth: 0,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
      marginLeft: 5,
      marginRight: 5,
      marginTop: 10
    }}>
    </View>
  );
}
<Stack.Screen
  options={{

    title: "Home",
    headerBackVisible: false,
  }} 
/>
        */