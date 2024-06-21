import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { FunctionComponent, useState } from "react";
import { Platform, TouchableOpacity, View, Text, StyleSheet} from "react-native";
import styles from "../style";
import colors from "../colors";
import { dateToWDDDMMYY } from "../utilities";
import { Bubble } from "./Bubble";
import { Fontisto } from '@expo/vector-icons'; 



interface DatePickerProps{
  editable: boolean,
  parentDate: (data: Date) => void,
  focused?: (is: boolean) => void
}
export const DatePicker: FunctionComponent<DatePickerProps> = (props: DatePickerProps) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const ios = Platform.OS === 'ios';
  const android = Platform.OS === 'android';

  const toggleFocus = (to:boolean) => {
    if (props.focused)
      props.focused(to);
  }

  const onSubmitDate = () => {
    if (ios) {
      setShowDatePicker(false)
    }
    props.parentDate(date);
    toggleFocus(false);
  }

  const onChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    if (android && event.type == "set") {
      setShowDatePicker(false)
      onSubmitDate();
    } 
    setDate(selectedDate || new Date());
  }

  const handleButtonClick = () => {
    if (props.editable) {
      setShowDatePicker(true)
      toggleFocus(true);
    }
  }

  return (
    <>
      {showDatePicker ?
        (
          <View>
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
              <TouchableOpacity style={[{ flexDirection:"row", alignItems: "center"}]} onPress={handleButtonClick}>
                <Fontisto name="date" size={24} color={colors.yellow} />
                <Text style={[styles.p, { color: colors.lighter, paddingLeft:7 }]}>{dateToWDDDMMYY(date)}</Text>
              </TouchableOpacity> 
            ) }
          </View>
        )
        :
        (
          <TouchableOpacity style={[{ flexDirection:"row", alignItems: "center"}]} onPress={handleButtonClick}>
            <Fontisto name="date" size={24} color={colors.yellow} />
            <Text style={[styles.p, { color: colors.lighter, paddingLeft:7 }]}>{dateToWDDDMMYY(date)}</Text>
          </TouchableOpacity>
        )
      }
    </>
  );
}


const datePicker = StyleSheet.create({
  dateButton: {
    color: colors.lighter,
  },
  iosStyle: {

    
  }
  
})

