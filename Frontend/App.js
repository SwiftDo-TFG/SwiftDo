import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomButton from './components/buttons/Button';
import SignInScreen from './screens/auth/login';
import EjemploScreen from './screens/ejemplo';
import Inbox from './screens/inbox';
// import AuthState from './screens/auth/authState';
import AuthContext from './screens/auth/authContext';

// ICONS
import { FontAwesome5 } from '@expo/vector-icons'; 

const Drawer = createDrawerNavigator();
// const AuthContext = React.createContext();

function SplashScreen() {
  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}

const HomeScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text>Welcome to TFG-GTD APP!</Text>
      <CustomButton
        text="Go to Login"
        handler={() => navigation.navigate('Login')}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const InfoScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text>Aqui iria la informacion</Text>
      <CustomButton
        text="Go to Login"
        handler={() => navigation.navigate('Login')}
      />
      <StatusBar style="auto" />
    </View>
  );
}

export default function App() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

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
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };
  
    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async (data) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
    }),
    []
  );
  
  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Drawer.Navigator>
        {/* {state.isLoading ? (
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
            )} */}
            <Drawer.Screen name="Home" component={HomeScreen} />
            <Drawer.Screen name="Info" component={InfoScreen} />
            <Drawer.Screen name="Ejemplo" component={EjemploScreen}/>
            <Drawer.Screen 
                name="Inbox" 
                component={Inbox} 
                options={{
                  title:'Inbox',
                  drawerIcon: () => (
                    <FontAwesome5 name="inbox" size={24} color={'orange'} />
                  ),
                }}
            />
        </Drawer.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
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
