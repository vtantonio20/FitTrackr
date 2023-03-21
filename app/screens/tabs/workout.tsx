import React, { FunctionComponent } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from "../../style";
import colors from "../../colors";
import { StatusBar } from 'expo-status-bar';
import CircleButton from '../../components/circleButton';
const onAddSticker = () => {
  // we will implement this later
};

interface SuggestionProps{
  name:string
}
const Suggestion: FunctionComponent<SuggestionProps> = (props:SuggestionProps) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: colors.primary,
        padding: 7,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={styles.p}>{props.name}</Text>
    </TouchableOpacity>
  );
}

const Workout:FunctionComponent = () => {  
  return (
    <>
      <StatusBar style="light" />
      <View style={[styles.container]}>
        <View
          style={{
            margin:14
          }}>
          <Text style={[styles.h3, {paddingVertical: 14}]}>Start new workout</Text>
          
          <Text style={[styles.p, { paddingBottom: 7 }]}>Workout name:</Text>
          <TextInput
            style={{
              color: colors.white,
              height: 36,
              padding: 7,
              borderColor: colors.primary,
              borderWidth:1,
              borderRadius: 7
            }}
          />
          <View style={[styles.flexRow, {marginTop:7}]}>
            <Suggestion name={'Chest, Shoulders & Triceps'} />
            <Suggestion name={'Chest & Biceps'}/>
            <Suggestion name={'Legs'}/>

          </View>
          
        </View>
        
      </View>

      
    </>
  );
}
export default Workout;