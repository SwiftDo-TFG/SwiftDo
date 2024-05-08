import 'react-native-gesture-handler';
import * as React from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { registerRootComponent } from 'expo';
import AuthState from './services/auth/context/authState';
import FilterState from './services/filters/FilterState';
import ThemeState from './services/theme/ThemeState';
import Router from './components/navigation/Router';
import { SafeAreaView, StatusBar, useColorScheme } from 'react-native';
import { useContext } from 'react';
import ThemeContext from './services/theme/ThemeContext';
import configStorage from './services/configStorage/configStorage';

export default function App() {

  return (
    <AuthState>
      <FilterState>
        <ThemeState>
          <AppContainer/>
        </ThemeState>
      </FilterState>
    </AuthState>
  );
}

const AppContainer = () => {
  const themeContext = useContext(ThemeContext);
  // const theme = useColorScheme();
  const sistemTheme = themeContext.theme;
  const theme = sistemTheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={theme}>
      <StatusBar backgroundColor={theme.colors.background} barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      <Router />
    </NavigationContainer>
  )
}

registerRootComponent(App);
