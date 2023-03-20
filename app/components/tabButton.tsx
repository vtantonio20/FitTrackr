import { View, Pressable, StyleSheet } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons'; 

import { FunctionComponent } from 'react';
import { Text } from "react-native";
import colors from '../colors';
import { TouchableHighlight } from 'react-native';

const buttonHeight = 48
interface Props {  
  onPress: () => void,
  icon: React.ReactNode,
  name: string,
  focused: boolean,

}
/*
<View style={{alignItems:'center'}}>
<View style={styles.circleButtonContainer}>
  <TouchableHighlight style={styles.circleButton}  onPress={props.onPress}>
    {props.icon}
  </TouchableHighlight>
</View>
<Text style={{color: props.focused ? colors.yellow : colors.white}}>{props.name}</Text>
</View>
*/
const CircleButton: FunctionComponent<Props> = (props:Props) => {
  return (
    <View style={{alignItems:'center'}}>
      <View style={styles.circleButtonContainer}>
        <Pressable style={styles.circleButton}  onPress={props.onPress}>
          {props.icon}
        </Pressable>
      </View>
      <Text style={{color: props.focused ? colors.yellow : colors.white}}>{props.name}</Text>
    </View>
  )
}
const styles = StyleSheet.create({
  circleButtonContainer: {
    width: buttonHeight,
    height: buttonHeight,
    padding: buttonHeight * 0.05,
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


export default CircleButton;