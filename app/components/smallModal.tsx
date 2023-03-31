import { FunctionComponent, useMemo } from "react";
import { TouchableHighlight, StyleSheet, Text, Modal, View, Platform, Dimensions, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import colors from "../colors";
import styles from "../style";
import { Feather, Entypo } from '@expo/vector-icons'; 
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

/*
  Here is working example of calling this in a parent
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [selection, setSelection] = useState(0);

  const modalSelections = ['Count of 1', 'Count of 2', 'Count of 3']
  return (
    <>
      <Text>{modalSelections[selection]}</Text>
      {isModalVisible &&
        <BottomModal
        title='hello'
        onExitPress={() => setIsModalVisible(false)}
        selections={modalSelections}
        onSelectionPress={setSelection}
      />}
    </>
  )
*/
interface BottomModalProps {
  title?: string,
  header?: React.ReactNode, //If want an image?
  selections?: string[],
  body?: React.ReactNode,
  onExitPress: () => void,
  onSelectionPress:(index: number) => void
}


const BottomModal: FunctionComponent<BottomModalProps> = (props: BottomModalProps) => {
  const handleSelect = (selectionsIndex: number) => {
    props.onSelectionPress(selectionsIndex)
  }
  return (
    <>

      <View
        style={{
          position:'absolute',
          top: 0,
          left:0,
          width: windowWidth,
          height: windowHeight,
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}
      />
      <Modal  animationType="slide" transparent={true} >
      <View style={modal.modalContainer}>
        {/*Header*/}
        {props.header &&
          <View style={modal.modalHeader}>
            {props.header}
            <Feather name="x" size={36} color="white" onPress={() => props.onExitPress()} />
          </View>
        }
        {props.title &&
          <View style={modal.modalHeader}>
            <Text style={styles.h3 }>{props.title}</Text>
          <Feather name="x" size={36} color="white" onPress={() => props.onExitPress()} />
        </View>
        }
        
        {/*Body*/}
        {props.body &&
          <>
          { props.body }
          </>
        }
        {props.selections &&
          <View style={modal.modalBodyContainer}>
            {props.selections.map((text, index) => {
              return (
                <TouchableHighlight
                  key={text}
                  style={[modal.selection]}
                  underlayColor={colors.darker}
                  onPress={() => {
                    handleSelect(index);
                    props.onExitPress();
                  }}>
                  <Text style={[styles.h4, styles.lighterFont]}>{text}</Text>
                </TouchableHighlight>
              );
            })}
          </View>
        }
      </View>
    </Modal>
  </>
    
  );
}

interface ModalButtonProps {
  text: string,
  onPress: () => void;
} 
export const ModalButton = (props:ModalButtonProps) => {
  return (
    <TouchableOpacity style={styles.flexRow} onPress={ props.onPress }>
      <Text style={[styles.p, styles.lighterFont, {paddingRight:3.5}]}> { props.text }</Text>
      <Entypo name="chevron-thin-down" size={14} color={colors.lighter} />
    </TouchableOpacity>
  );
}
const modal = StyleSheet.create({
  modalContainer: {
    width: '100%',
    backgroundColor: colors.primary,
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    position: 'absolute',
    bottom: 0,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14 
  },
  modalBodyContainer: {
    borderTopWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 1,
    borderColor: colors.darker
  },
  selection: {
    paddingVertical: 14,
    paddingHorizontal:14
  }
})

export default BottomModal;