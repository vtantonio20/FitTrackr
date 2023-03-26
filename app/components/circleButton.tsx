import { View, Pressable, StyleSheet } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons'; 

import { FunctionComponent } from 'react';
import { Text } from "react-native";
import colors from '../colors';

const buttonHeight = 48
interface Props {  
  onPress: () => void,
  icon: React.ReactNode,
  name: string

}
export const CircleButton: FunctionComponent<Props> = (props:Props) => {
  return (
    <View style={{alignItems:'center'}}>
      <View style={styles.circleButtonContainer}>
        <Pressable style={styles.circleButton} onPress={props.onPress}>
          {props.icon}
        </Pressable>
      </View>
      <Text style={styles.text}>{props.name}</Text>
    </View>

  )
}
const styles = StyleSheet.create({
  circleButtonContainer: {
    width: buttonHeight,
    height: buttonHeight,
    borderRadius: 42,
  },
  circleButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 42,
    backgroundColor: colors.white,
  },
  text: {
    color: colors.white
  }
});


