import { Tabs } from 'expo-router';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'; 
import colors from '../../colors';
import CircleButton from '../../components/circleButton';
import TabButton from '../../components/tabButton';
const onAddSticker = () => {
  // we will implement this later
};

export default () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.yellow,
        tabBarInactiveTintColor: colors.white,
        tabBarStyle: {
          paddingTop: 7,
          borderTopWidth:0,
          backgroundColor: colors.primary,
  
        },
        tabBarLabelStyle: {
          paddingBottom:7
        }
      }}>
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabButton
            focused={focused}
            onPress={onAddSticker()}
            icon={<FontAwesome name="home" size={20} color={focused ? colors.yellow : colors.white} />}  
          />
          }
        }
      />

      <Tabs.Screen
        name="workout"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            <FontAwesome5 name="dumbbell" size={20} color={focused ? colors.yellow : colors.white} />
        }}
      />

      <Tabs.Screen
        name="account"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            <FontAwesome name="user" size={20} color={focused ? colors.yellow : colors.white} />
        }}
      />
    </Tabs>
  );
}
/*
{
  <FontAwesome name="home" size={20} color={focused ? colors.yellow : colors.white} />
}
*/