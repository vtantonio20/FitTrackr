import { Stack } from 'expo-router';
import React, { FunctionComponent } from 'react'
import { Image, View, Text, SafeAreaView, ScrollView, StyleSheet, FlatList } from 'react-native'
import colors from '../../colors';
import styles from "../../style"
import { AntDesign } from '@expo/vector-icons'; 

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
      <Text style={styles.h5}>Hello Michael</Text>
      <Text style={{color:colors.white, fontFamily:"Lato-Light"}}>Welcome back</Text>
    </View>
  )
}


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

const Home: FunctionComponent = (props:any) => {
  return (
    <>
      <Stack.Screen
        options={{
          headerBackVisible: false,
          headerTitle: '',
          headerStyle: { backgroundColor: colors.primary },
          headerLeft: (props:any) => <Title {...props} />,
          headerRight: (props: any) => <Logo {...props} />
        }}
      />
      <Card>

      </Card>

      <View style={styles.container}>
        <Text style={[styles.h5, { padding: 10 }]}>Workout History</Text>
      </View>
    </>

  )
}
export default Home;
/*
<Stack.Screen
  options={{

    title: "Home",
    headerBackVisible: false,
  }} 
/>
        */