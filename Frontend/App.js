import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomButton from './components/buttons/Button';
import SignInScreen from './screens/auth/login';
import AuthState from './screens/auth/authState';
import AuthContext from './screens/auth/authContext';

const Drawer = createDrawerNavigator();
// const AuthContext = React.createContext();

function SplashScreen() {
  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}

function Router() {
  const state = React.useContext(AuthContext);

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;
  
      try {
        // Restore token stored in `SecureStore` or any other encrypted storage
        // userToken = await SecureStore.getItemAsync('userToken');
      } catch (e) {
        // Restoring token failed
      }
  
      // After restoring token, we may need to validate it in production apps
  
      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      state.signOut();
    };
  
    bootstrapAsync();
  }, []);

  return (
      <Drawer.Navigator>
      {state.isLoading ? (
          // We haven't finished checking for the token yet
          <Drawer.Screen name="Splash" component={SplashScreen} />
        ) : state.userToken == null ? (
          // No token found, user isn't signed in
          <Drawer.Screen
            name="SignIn"
            component={SignInScreen}
            options={{
              title: 'Sign in',
              // When logging out, a pop animation feels intuitive
              animationTypeForReplace: state.isSignout ? 'pop' : 'push',
            }}
          />
        ) : (
          // User is signed in
          <Drawer.Screen name="Home" component={HomeScreen} />
        )}
      </Drawer.Navigator>
  );
}

const HomeScreen = ({navigation}) => {
  const state = React.useContext(AuthContext);
  
  return (
    <View style={styles.container}>
      <Text>Welcome to TFG-GTD APP!</Text>
      <CustomButton
        text="Logout"
        handler={() => state.signOut()}
      />
      <StatusBar style="auto" />
    </View>
  );
}

export default function App() {
  return (
    <AuthState>
      <NavigationContainer>
        <Router/>
      </NavigationContainer>
    </AuthState>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
