import React, { FunctionComponent, useEffect, useState } from 'react'
import { View, Text, Platform, Button } from 'react-native'
import colors from '../../colors';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useExerciseSuggestionsFromMuscle } from '../../queries/SuggestionQueries';

const Calender:FunctionComponent = () => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(Platform.OS === 'ios' ? true :false);
  const [text, setText] = useState('Empty');

  const onChange = (event:DateTimePickerEvent, selectedDate: Date |undefined) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios')
    setDate(currentDate);

    let tempDate = new Date(currentDate);
    let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
    setText(fDate);
    console.log(fDate)

    exerciseSuggestionData.changeMuscle(21)
    console.log(JSON.stringify(exerciseSuggestionData.exerciseData));
  }

  // const muscleSuggestionData = useMuscleSuggestionData();
  // console.log(JSON.stringify(muscleSuggestionData.muscleMap));
  const exerciseSuggestionData = useExerciseSuggestionsFromMuscle(1);
  console.log(JSON.stringify(exerciseSuggestionData.exerciseData));


  return (
    <View>
      <Text>{text}</Text>

      {Platform.OS === 'android' && <Button title='DatePicker' onPress={() => setShow(true)}/>}
      {show && (
        <DateTimePicker
          testID='dateTimePicker'
          value={date}
          mode={'date'}
          is24Hour={false}
          display={'default'}
          onChange={onChange}
        />
      )}

    </View>
  );
};
export default Calender;