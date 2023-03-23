import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { FunctionComponent, useState } from 'react'
import { Pressable, Platform, View, Text, TouchableOpacity, TextInput, FlatList, StyleSheet, ScrollView, TextStyle, StyleProp } from 'react-native';
import colors from '../../colors';
import styles from "../../style";
import DateTimePicker, { DateTimePickerEvent, DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { alignItems } from 'react-native-wind/dist/styles/flex/align-items';
import { dateToWDDDMMYY } from '../../utilities';

interface BubbleProps{ name:string, onPress?: () => void, textStyle: any}
const Bubble: FunctionComponent<BubbleProps> = (props:BubbleProps) => {
  return (
    <TouchableOpacity onPress={props.onPress}
      style={{
        backgroundColor: colors.primary,
        padding: 7,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical:14
      }}
    >
      <Text style={props.textStyle}>{props.name}</Text>
    </TouchableOpacity>
  );
}

const DatePicker: FunctionComponent = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());

  const onChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    if (Platform.OS === 'android' && event.type == "set")
      setShowDatePicker(false)
    setDate(selectedDate || date);
  }
  
  return (
    <>
      {Platform.OS === 'ios' ?
        (
          <>{/*ios*/}
            {showDatePicker ?
              (
                <View style={{ paddingHorizontal: 7, borderColor: colors.primary, borderWidth: 1, borderRadius: 7, }}>
                  <DateTimePicker
                    testID='dateTimePicker'
                    value={date}
                    mode={'date'}
                    display={'inline'}
                    onChange={onChange}
                    accentColor={colors.yellow}    
                  />
                  <Bubble name={'Set Date'} textStyle={styles.h4} onPress={() => setShowDatePicker(!showDatePicker)} />
                </View>
              )
              :
              (
                <TouchableOpacity style={[form.formTextArea, { justifyContent: "center" }]} onPress={() => setShowDatePicker(true)}>
                  <Text style={[styles.p, { color: colors.lighter }]}>{dateToWDDDMMYY(date)}</Text>
                </TouchableOpacity>
              )
            }
          </>
        )
        :
        (
          <>{/*android*/}
            <TouchableOpacity style={[form.formTextArea, { justifyContent: "center" }]} onPress={() => setShowDatePicker(true)}>
              <Text style={[styles.p, { color: colors.lighter }]}>{dateToWDDDMMYY(date)}</Text>
            </TouchableOpacity>
            {showDatePicker && 
              <DateTimePicker
                testID='dateTimePicker'
                value={date}
                mode={'date'}
                display={'inline'}
                onChange={onChange}
                accentColor={colors.yellow}    
              />
            }  
          </>
        )
      }
    </>
  );
}

export const Workout = () => {
  return (
    <>
      <Stack.Screen
        options={{
          headerBackVisible: true,
          title: 'New Workout'
        }}
      />

      <ScrollView style={[styles.modalContainer]}>
        <View style={styles.containerWrapper}>
          <View style={styles.widgetHeader}>
            <Text style={styles.h3}>Set Details</Text>
          </View>
          
          <View style={form.element}>
            <Text style={form.elementHeader}>Workout Name: </Text>
            <TextInput style={form.formTextArea}/>
          </View>

          
          <View style={form.element}>
            <Text style={form.elementHeader}>Workout Date: </Text>
            <DatePicker/>
          </View>
          
          <View style={form.element}>
            <Text style={form.elementHeader}>Target Muscles <Text style={styles.p}>(optional)</Text></Text>
            <TextInput style={form.formTextArea}/>
            <FlatList 
              horizontal={true}
              data={DATA}
              renderItem={({ item }) => <Bubble textStyle={styles.p} name={item.name} />}
              keyExtractor={item => item.id}
            />          
          </View>


          
          {/*Submit Button */}
          <TouchableOpacity style={form.submitContainer}>
            <Text style={[styles.h3, {lineHeight:28}]}>Start Logging</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

    </>
  )
}
const form = StyleSheet.create({
  submitContainer: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 50,
    paddingVertical: 14,
  },
  element: {
    paddingBottom:7
  },
  elementHeader: {
    ...styles.h4,
    paddingBottom: 7,
    color: colors.white
  },
  formTextArea: {
    color: colors.lighter,
    height: 36,
    paddingHorizontal: 7,
    borderColor: colors.primary,
    borderWidth:1,
    borderRadius: 7,
  }
  
})
export default Workout;



const DATA = [
  {
    id: '1',
    name: 'Chest'
  },
  {
    id: '2',
    name: 'Back'
  },
  {
    id: '3',
    name: 'Arms'
  },
  {
    id: '4',
    name: 'Legs'
  },
  {
    id: '5',
    name: 'Shoulders'
  },
  {
    id: '6',
    name: 'Abs'
  },
  
  {
    id: '7',
    name: 'Calves'
  },
  
  {
    id: '8',
    name: 'Hamstrings'
  },
  {
    id: '9',
    name: 'Quads'
  },
  {
    id: '10',
    name: 'ASS'
  },
  {
    id: '11',
    name: 'Bi'
  },
  {
    id: '12',
    name: 'Tri'
  },
  
  {
    id: '13',
    name: 'Forearms'
  },
  {
    id: '14',
    name: 'Traps'
  },
  {
    id: '15',
    name: 'Lats'
  },
]

