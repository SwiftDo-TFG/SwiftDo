import * as React from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { registerRootComponent } from 'expo';
import AuthState from './services/auth/context/authState';
import FilterState from './services/filters/FilterState';
import Router from './components/navigation/Router';
import { SafeAreaView, StatusBar, useColorScheme } from 'react-native';

export default function App() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <AuthState>
      <FilterState>
        <NavigationContainer theme={theme}>
          <StatusBar backgroundColor={theme.colors.background} barStyle={theme === 'dark' ? 'light-content' :'dark-content'}/>
          <Router />
        </NavigationContainer>
      </FilterState>
    </AuthState>
  );
}

registerRootComponent(App);
