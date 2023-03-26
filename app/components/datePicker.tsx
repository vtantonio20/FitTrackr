import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { FunctionComponent, useState } from "react";
import { Platform, TouchableOpacity, View, Text, StyleSheet} from "react-native";
import styles from "../style";
import colors from "../colors";
import { dateToWDDDMMYY } from "../utilities";
import { Bubble } from "./bubbleButton";



interface DatePickerProps{ editable:boolean}
export const DatePicker: FunctionComponent<DatePickerProps> = (props:DatePickerProps) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const ios = Platform.OS === 'ios';
  const android = Platform.OS === 'android';



  
  const DateButton: FunctionComponent = () => {
    return ( 
      <TouchableOpacity style={[datePicker.dateButton, { justifyContent: "center" }]} onPress={() => props.editable && setShowDatePicker(true)}>
        <Text style={[styles.p, { color: colors.lighter }]}>{dateToWDDDMMYY(date)}</Text>
      </TouchableOpacity> 
    );
  }
  const onChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    if (android && event.type == "set")
      setShowDatePicker(false)
    setDate(selectedDate || date);
  }

  const handleShowDatePicker = () => {
    if (props.editable)
      setShowDatePicker(!showDatePicker); 
  }
  
  return (
    <>
      {showDatePicker ?
        (
          <View style={ios && datePicker.iosStyle}>
            <DateTimePicker
              testID='dateTimePicker'
              value={date}
              mode={'date'}
              display={'inline'}
              onChange={onChange}
              accentColor={colors.yellow}    
            />
            {ios && <Bubble name={'Set Date'} textStyle={styles.h4} onPress={() => props.editable && setShowDatePicker(!showDatePicker)} />}
            {android && <DateButton/> }
          </View>
        )
        :
        (
          <DateButton/>
        )
      }
    </>
  );
}


const datePicker = StyleSheet.create({
  dateButton: {
    color: colors.lighter,
    height: 36,
    paddingHorizontal: 7,
    borderColor: colors.primary,
    borderWidth:1,
    borderRadius: 7,
  },
  iosStyle: {
    paddingHorizontal: 7,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 7,
  }
  
})

