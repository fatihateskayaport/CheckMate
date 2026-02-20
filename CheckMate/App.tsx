import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import AddScreen from "./app/Screens/AddScreen";
import Home from "./app/Screens/home";
import Login from "./app/Screens/Login";
import ProfileScreen from "./app/Screens/ProfileScreen";
import CustomTabBar from "./components/CustomTabBar";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

export type RootStackParamList = {
  Login: { logout?: boolean } | undefined;
  Home: { user?: string };
};

const HomeWrapper = (props: any) => <Home {...props} />;

function MainTabs({ route }: any) {
  const user = route.params?.user;

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        name="Home"
        component={HomeWrapper}
        initialParams={{ user }}
      />
      <Tab.Screen name="Add" component={AddScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Home" component={MainTabs} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
