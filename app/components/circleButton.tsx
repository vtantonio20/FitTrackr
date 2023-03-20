import { View, Pressable, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { FunctionComponent } from 'react';
import { GestureResponderEvent } from "react-native";

interface Props {
  focused?: boolean,
  
  onPress: (event: GestureResponderEvent) => void
}
const CircleButton: FunctionComponent<Props> = (props:Props) => {
  return (
    <View >
      <Pressable style={styles.circleButton} onPress={props.onPress}>
        <MaterialIcons name="add" size={20} color="#25292e" />
      </Pressable>
    </View>
  )
}
const styles = StyleSheet.create({
  circleButtonContainer: {
    width: 24,
    height: 24,
    borderWidth: 4,
    borderColor: "#ffd33d",
    borderRadius: 42,
    padding: 3,
  },
  circleButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 42,
    backgroundColor: "#fff",
  },
});


export default CircleButton;