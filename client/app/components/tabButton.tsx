import { View, Pressable, StyleSheet } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons'; 

import { FunctionComponent } from 'react';
import { Text } from "react-native";
import colors from '../colors';

const buttonHeight = 32
interface Props {  
  onPress: () => void,
  icon: React.ReactNode,
  name: string,
  focused: boolean,

}

export const TabButton: FunctionComponent<Props> = (props:Props) => {
  return (
    <Pressable style={{width:70, height:50}} onPress={props.onPress}>
      <View style={styles.circleButtonContainer}>
        <View style={styles.circleButton}>
          {props.icon}
        </View>
      </View>
      <Text style={{alignSelf:"center", color: props.focused ? colors.yellow : colors.white}}>{props.name}</Text>
    </Pressable>
  )
}
const styles = StyleSheet.create({
  circleButtonContainer: {
    width: buttonHeight,
    height: buttonHeight,
    alignSelf: 'center',
    
  },
  circleButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 42,
  },
  text: {
    color: colors.white
  }
});


