import * as React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { registerRootComponent } from 'expo';
import AuthState from './services/auth/context/authState';
import Router from './components/navigation/Router';



export default function App() {
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <AuthState>
        <NavigationContainer>
          <Router />
        </NavigationContainer>
      </AuthState>
    </KeyboardAvoidingView>
  );
}

registerRootComponent(App);
