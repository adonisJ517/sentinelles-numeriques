import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import { RootStackParamList } from './src/components/BottomNav';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import PaymentsScreen from './src/screens/PaymentsScreen';
import TravelRulesScreen from './src/screens/TravelRulesScreen';
import AirportServicesScreen from './src/screens/AirportServicesScreen';
import AnonIncidentScreen from './src/screens/AnonIncidentScreen';
import BaggageIssueScreen from './src/screens/BaggageIssueScreen';
import FlightTrackingScreen from './src/screens/FlightTrackingScreen';
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';
import AdminIncidentsScreen from './src/screens/AdminIncidentsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const scheme = useColorScheme();

  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Payments" component={PaymentsScreen} />
        <Stack.Screen name="TravelRules" component={TravelRulesScreen} />
        <Stack.Screen name="AirportServices" component={AirportServicesScreen} />
        <Stack.Screen name="AnonIncident" component={AnonIncidentScreen} />
        <Stack.Screen name="BaggageIssue" component={BaggageIssueScreen} />
        <Stack.Screen name="FlightTracking" component={FlightTrackingScreen} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
        <Stack.Screen name="AdminIncidents" component={AdminIncidentsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
