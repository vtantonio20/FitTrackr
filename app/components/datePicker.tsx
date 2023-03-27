import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { FunctionComponent, useState } from "react";
import { Platform, TouchableOpacity, View, Text, StyleSheet} from "react-native";
import styles from "../style";
import colors from "../colors";
import { dateToWDDDMMYY } from "../utilities";
import { Bubble } from "./bubbleButton";



interface DatePickerProps{ editable:boolean, parentDate: (data:Date) => void}
export const DatePicker: FunctionComponent<DatePickerProps> = (props:DatePickerProps) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const ios = Platform.OS === 'ios';
  const android = Platform.OS === 'android';


  const onSubmitDate = () => {
    if (Platform.OS === 'ios') {
      setShowDatePicker(false)
    }
    props.parentDate(date);
  }

  const onChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    if (Platform.OS === 'android' && event.type == "set") {
      setShowDatePicker(false)
      onSubmitDate();
    }
    setDate(selectedDate || new Date());
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
            {ios && <Bubble name={'Set Date'} textStyle={styles.h4} onPress={() => props.editable && onSubmitDate()} />}
            {android && (
              <TouchableOpacity style={[datePicker.dateButton, { justifyContent: "center" }]} onPress={() => props.editable && setShowDatePicker(true)}>
                <Text style={[styles.p, { color: colors.lighter }]}>{dateToWDDDMMYY(date)}</Text>
              </TouchableOpacity> 
            ) }
          </View>
        )
        :
        (
          <TouchableOpacity style={[datePicker.dateButton, { justifyContent: "center" }]} onPress={() => props.editable && setShowDatePicker(true)}>
            <Text style={[styles.p, { color: colors.lighter }]}>{dateToWDDDMMYY(date)}</Text>
          </TouchableOpacity>
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

