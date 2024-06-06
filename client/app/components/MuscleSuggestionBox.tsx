import { useEffect } from "react";
import { useSelectionModal } from "../hooks/useSelectionModal";
import { useSuggested } from "../hooks/useSuggestions";
import { FlatList, TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { SimpleLineIcons  } from '@expo/vector-icons'; 
import colors from "../colors";
import styles from "../style";
import { ModalButton } from "./smallModal";
import { Bubble } from "./bubbleButton";

/*
props.muscleMap = musclMap
props.focused = (focusOn === 'targetMuscles')
props.removeMuscle
props.appendMuscle
props.value
*/
export const MuscleSuggestionBox = (props:any) => {
    // A list of the muscle group names
    const muscleGroups = props.muscleMap.keys();
    // This selection modal will be the a modal to from the list of group names
    const selectionModal = useSelectionModal(muscleGroups);
    // The suggested muscles determined by the current group selected
    const suggestedMuscles = useSuggested(muscleGroups[selectionModal.selected]);
    useEffect(() => {
      suggestedMuscles.setNewSuggestions(muscleGroups[selectionModal.selected])
    }, [selectionModal.selected])

    return (
      <>
        <View style={[form.element, { paddingBottom: 0 }]}>
          <View style={styles.flexRow}>
            <Text style={form.elementHeader}>Target Muscles: <Text style={styles.p}>(optional)</Text></Text>
            <ModalButton onPress={() => selectionModal.toggleOpen()} text={selectionModal.selected} />
          </View>

          <View style={[form.formTextArea, props.focused && styles.focusedInput]}>
            <FlatList
              horizontal={true}
              data={props.value}
              keyExtractor={(item => item["targetMuscle"])}
              renderItem={({ item, index }) =>
                <TouchableOpacity
                  style={styles.suggestion}
                  onPress={() => props.removeMuscle(item["targetMuscle"], index)}
                >
                  <Text style={[styles.p, { paddingRight: 1.5 }]}>{item["targetMuscle"]}</Text>
                  <SimpleLineIcons name="close" size={12} color={colors.lighter} />
                </TouchableOpacity>
              }
            />
          </View>
          <FlatList
            horizontal
            data={suggestedMuscles.unselectedSuggestions}
            renderItem={({ item }) => <Bubble textStyle={[styles.p, { padding: 1.5 }]} name={item.replace(/_/g, " ")} onPress={() => props.appendMuscle(item)} />}
            keyExtractor={item => item}
            style={{ margin: 0 }}
          />
        </View>
      </>
    )
}

const form = StyleSheet.create({
  submitContainer: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 50,
    paddingVertical: 14,
  },
  element: {
    paddingBottom: 14
  },
  elementHeader: {
    ...styles.h4,
    paddingBottom: 7,
    color: colors.white
  },
  formTextArea: {
    color: colors.lighter,
    minHeight: 48,
    paddingHorizontal: 7,
    borderColor: colors.primary,
    borderWidth:1,
    borderRadius: 7,
  },
  suggestion: {
    backgroundColor: colors.primary,
    borderRadius: 7,
    paddingHorizontal: 7,
    margin: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  toggleActiveArea: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 1.5,
    paddingBottom: 14
  }
})

/*
<MuscleSuggestionBox
  muscleMap={muscleMap}
  focused={focusOn === 'targetMuscles'}
  removeMuscle={removeMuscle}
  appendMuscle={appendMuscle}
  value={value}
/>
*/