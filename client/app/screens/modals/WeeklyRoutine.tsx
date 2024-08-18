import { TouchableOpacity } from "react-native-gesture-handler";
import { ScrollView, Text, View } from "react-native";
import { Stack } from "expo-router";
import { WorkoutIcon } from "../../_layout";
import styles from "../../style";
import colors from "../../colors";
import { Workout } from "../../queries/WorkoutQueries";
import { form } from "./Workout";

interface WorkoutDay {
  day:string;
  workouts:Workout[];
}

const WeeklyRoutine = () => {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  const map: Record<string, WorkoutDay> = {};
  for (const day of daysOfWeek) {
    // if (!workouts[day] {

    // })
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerBackVisible: true,
          title: 'Workout Routine',
          headerRight: () => <WorkoutIcon enabled={false}/>
        }}
      />
      <ScrollView style={styles.modalContainer}>
        <View style={styles.containerWrapper}>

          <View style={[styles.widgetHeader, {marginVertical:7, paddingVertical:7}]}>
            <Text style={styles.h3}>Set a Routine</Text>
          </View>
 
          <View style={styles.widgetBody}>
            { daysOfWeek.map((day:string, index:number) => {
                return (
                  <View key={day}>
                    <TouchableOpacity>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding:28}}>
                        <Text style={styles.h4}>{day}</Text>
                        <View>
                          <Text style={styles.p}>Rest Day</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    {index + 1 !== daysOfWeek.length && <View style={[styles.divider, { borderColor: colors.darker}]} />}
                  </View>

                )
              })
            }
          </View>
          <TouchableOpacity style={[form.submitContainer, {marginVertical:14}]} onPress={() => {}}>
            <Text style={[styles.h3, {lineHeight:28}]}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  )
}

export default WeeklyRoutine;