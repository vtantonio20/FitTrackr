import { FunctionComponent } from "react";
import { TouchableOpacity, Text } from "react-native";
import colors from "../colors";

interface BubbleProps{ name:string, onPress: () => void, textStyle: any}
export const Bubble: FunctionComponent<BubbleProps> = (props:BubbleProps) => {
  return (
    <TouchableOpacity onPress={props.onPress}
      style={{
        backgroundColor: colors.primary,
        padding: 7,
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 14,
        marginRight: 1.5
      }}
    >
      <Text style={props.textStyle}>{props.name}</Text>
    </TouchableOpacity>
  );
}

