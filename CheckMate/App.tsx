import { createNavigationContainerRef, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import Toast from 'react-native-toast-message';

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import CustomTabBar from "./src/components/CustomTabBar";
import NoInternetOverlay from "./src/components/NoInternetOverlay";
import { toastConfig } from "./src/config/toastConfig";
import AddScreen from "./src/pages/add/AddScreen";
import Home from "./src/pages/home/home";
import Login from "./src/pages/login/Login";
import ProfileScreen from "./src/pages/profile/ProfileScreen";


const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// 1. Bir istemci (client) oluşturuyoruz
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Veri çekme hatalarında kullanıcıya çaktırmadan 2 kez daha dene
      retry: 2, 
      // Çekilen veri 5 dakika boyunca "taze" sayılsın (gereksiz yere tekrar çekmesin)
      staleTime: 1000 * 60 * 5, 
    },
  },
});

export type RootStackParamList = {
  Login: { logout?: boolean } | undefined;
  Home: { user?: string };
};

const HomeWrapper = (props: any) => <Home {...props} />;
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

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
      <Tab.Screen name="Add" component={AddScreen} initialParams={{ user }} />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ user }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
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
            
            <Stack.Screen name="Home" component={MainTabs} />
          </Stack.Navigator>
          <Toast config={toastConfig}/>
          <NoInternetOverlay />
        </NavigationContainer>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
    </QueryClientProvider>
  );
}






