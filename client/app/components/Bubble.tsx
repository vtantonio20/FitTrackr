import { FunctionComponent } from "react";
import { TouchableOpacity, Text, View } from "react-native";
import colors from "../colors";

interface BubbleProps{ name:string, onPress: () => void, textStyle: any}
export const Bubble: FunctionComponent<BubbleProps> = (props:BubbleProps) => {
  return (
    <TouchableOpacity onPress={props.onPress}
      style={{
        backgroundColor: colors.primary,
        padding: 7,
        borderRadius: 3.5,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 1.5
      }}
    >
      <Text style={props.textStyle}>{props.name}</Text>
    </TouchableOpacity>
  );
}

interface InfoBubbleProps{ name:string, textStyle: any}
export const InfoBubble: FunctionComponent<InfoBubbleProps> = (props:InfoBubbleProps) => {
  return (
    <View
      style={{
        backgroundColor: colors.primary,
        padding: 7,
        borderRadius: 3.5,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 1.5
      }}
    >
      <Text style={props.textStyle}>{props.name}</Text>
    </View>
  );
}