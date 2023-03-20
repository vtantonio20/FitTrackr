import { View, Pressable, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { FunctionComponent } from 'react';
import { GestureResponderEvent } from "react-native";
import colors from '../colors';

interface Props {
  focused: boolean,
  icon: React.ReactNode,
  onPress: (event: GestureResponderEvent) => void
}
const TabButton: FunctionComponent<Props> = (props:Props) => {
  return (
    <View style={props.focused ? styles.focused : styles.unfocused}>
      <Pressable style={styles.circleButton} onPress={props.onPress}>
        {props.icon}
      </Pressable>
    </View>
  )
}
const styles = StyleSheet.create({
  unfocused: {

  },
  focused: {
    backgroundColor: colors.white,
  },
  circleButtonContainer: {
    width: 24,
    height: 24,
    borderWidth: 4,
    borderColor: "#ffd33d",
    borderRadius: 42,
    padding: 3,
  },
  circleButton: {

  },
});


export default TabButton;