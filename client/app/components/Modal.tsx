import { Modal, Platform, TouchableOpacity, View, StyleSheet, Text, TouchableHighlight, Dimensions, StyleProp, TextStyle } from "react-native";
import colors from "../colors";
import styles from "../style";
import { Feather, Entypo } from '@expo/vector-icons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export type Selection = {
  text: string,
  action?: () => void,
  textStyle?: StyleProp<TextStyle>
}

interface ActionSelectionModalProps {
  title: string;
  selections: Selection[];
  onExitPress: () => void;
}

export const ActionSelectionModal: React.FunctionComponent<ActionSelectionModalProps> = ({ title, selections, onExitPress }) => {
  return (
    <>
      <View
        onTouchEnd={onExitPress}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: windowWidth,
          height: windowHeight * 100,
          backgroundColor: 'rgba(0, 0, 0, 0.25)'
        }}
      />
      <Modal animationType="none" transparent={true}>
        <View style={modal.modalContainer}>
          <View style={modal.modalHeader}>
            <Text style={styles.h3}>{title}</Text>
            <Feather name="x" size={36} color="white" onPress={onExitPress} style={{borderRadius:14}}/>
          </View>
          {selections &&
            <View style={modal.modalBodyContainer}>
              {selections.map((selection, index) => {
                return (
                  <TouchableHighlight
                    key={selection.text + "_" + index}
                    style={[modal.selection]}
                    underlayColor={colors.darker}
                    onPress={() => {
                      selection.action && selection.action();
                      onExitPress();
                    }}>
                    <Text style={[styles.h4, styles.lighterFont, selection.textStyle]}>{selection.text}</Text>
                  </TouchableHighlight>
                );
              })}
            </View>
          }
        </View>
      </Modal>
    </>
  );
};

interface InitActionModalButtonProps {
  onPress: () => void;
  showing: boolean;
  text: string;
}

export const InitActionModalButton: React.FunctionComponent<InitActionModalButtonProps> = ({ onPress, showing, text }) => {
  return (
    <TouchableOpacity style={[styles.flexRow, {  margin: 0, paddingVertical: 7 }]} onPress={onPress}>
      <Text style={[styles.p, styles.lighterFont, { paddingRight: 3.5 }]}> {text}</Text>
      <Entypo name={showing ? "chevron-thin-up" : "chevron-thin-down"} size={12} color={colors.lighter} />
    </TouchableOpacity>
  );
};

const modal = StyleSheet.create({
  modalContainer: {
    width: '100%',
    backgroundColor: colors.primary,
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    position: 'absolute',
    bottom: 0,
    paddingBottom: 60,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14
  },
  modalBodyContainer: {
    borderTopWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 1,
    borderColor: colors.darker,
  },
  selection: {
    paddingVertical: 14,
    paddingHorizontal: 14
  }
})

