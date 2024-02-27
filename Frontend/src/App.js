import 'react-native-gesture-handler';
import * as React from 'react';
import { KeyboardAvoidingView, Platform, View, Text, SafeAreaView, Appearance } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { registerRootComponent } from 'expo';
import AuthState from './services/auth/context/authState';
import Router from './components/navigation/Router';




export default function App() {
  const theme = Appearance.getColorScheme();
  console.log(theme);

  return (
    
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <AuthState>
        <NavigationContainer>
          <Router />
        </NavigationContainer>
      </AuthState>
    </KeyboardAvoidingView>
    // <SafeAreaView>
    //   <View>
    //     <Text>Gola</Text>
    //   </View>
    // </SafeAreaView>
    
  );
}

registerRootComponent(App);
