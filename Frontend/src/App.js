// import 'react-native-gesture-handler';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as React from 'react';
import { KeyboardAvoidingView, Platform, View, Text, SafeAreaView, Appearance } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
// import { registerRootComponent } from 'expo';
// import { StatusBar } from 'expo-status-bar';
import AuthState from './services/auth/context/authState';
import Router from './components/navigation/Router';



function App() {
  const theme = Appearance.getColorScheme();
  console.log("EL TEMA DE COLOR DEL SISTEMA ES:",theme);

  return (
    // <GestureHandlerRootView style={{ flex: 1 }}>
    // </GestureHandlerRootView>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {/* <StatusBar style="auto" /> */}
        <AuthState>
          <NavigationContainer>
            <Router />
          </NavigationContainer>
        </AuthState>
      </KeyboardAvoidingView>
    // <View>
    //   <Text>Gola Buenas Tardes</Text>
    // </View>
    
  );
}

export default App;

// registerRootComponent(App);
