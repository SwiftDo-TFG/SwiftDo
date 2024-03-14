// import 'react-native-gesture-handler';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as React from 'react';
import { KeyboardAvoidingView, Platform, View, Text, Appearance } from 'react-native';
// import { registerRootComponent } from 'expo';
// import { StatusBar } from 'expo-status-bar';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import AuthState from './services/auth/context/authState';
import Router from './components/navigation/Router';
import { SafeAreaView, StatusBar, useColorScheme } from 'react-native';

function App() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    // <GestureHandlerRootView style={{ flex: 1 }}>
    // </GestureHandlerRootView>
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* <StatusBar style="auto" /> */}
      <AuthState>
        <NavigationContainer theme={theme}>
          <StatusBar backgroundColor={theme.colors.background} />
          <Router />
        </NavigationContainer>
      </AuthState>
    </KeyboardAvoidingView>
    // <View>
    //   <Text>Gola Buenas Tardes</Text>
    // </View>
  )
}
export default App;

// registerRootComponent(App);
