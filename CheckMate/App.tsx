import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import Toast from 'react-native-toast-message';

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useEffect } from "react";
import CustomTabBar from "./src/components/CustomTabBar";
import NoInternetOverlay from "./src/components/NoInternetOverlay";
import { toastConfig } from "./src/config/toastConfig";
import AddScreen from "./src/pages/add/AddScreen";
import Home from "./src/pages/home/home";
import Login from "./src/pages/login/Login";
import ProfileScreen from "./src/pages/profile/ProfileScreen";
import { notificationService } from "./src/services/notificationService";


// ... importlar (aynı)

export type RootStackParamList = {
  Login: { logout?: boolean } | undefined;
  MainTabs: { user?: string }; // Burası kilit nokta
  AddModal: { user?: string } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function MainTabs({ route }: any) {
  const user = route.params?.user;
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={Home} initialParams={{ user }} />
      <Tab.Screen name="Add" component={AddScreen} initialParams={{ user }} />
      <Tab.Screen name="Profile" component={ProfileScreen} initialParams={{ user }} />
    </Tab.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    notificationService.configure();
  }, []);
  const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, 
      staleTime: 1000 * 60 * 5, 
    },
  },
});

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Login"
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="MainTabs" component={MainTabs} />
              <Stack.Screen name="AddModal" component={AddScreen} />
            </Stack.Navigator>
            <Toast config={toastConfig}/>
            <NoInternetOverlay />
          </NavigationContainer>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}