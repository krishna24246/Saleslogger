import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

import { 
  LoginScreen, 
  VisitListScreen, 
  CreateEditVisitScreen, 
  VisitDetailsScreen, 
  SyncSettingsScreen 
} from '../screens';
import SplashScreen from '../screens/SplashScreen';

import { useStore } from '../store/useStore';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const [showSplash, setShowSplash] = React.useState(true);
  const user = useStore((state) => state.user);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="VisitList" component={VisitListScreen} />
            <Stack.Screen name="CreateEditVisit" component={CreateEditVisitScreen} />
            <Stack.Screen name="VisitDetails" component={VisitDetailsScreen} />
            <Stack.Screen name="SyncSettings" component={SyncSettingsScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
