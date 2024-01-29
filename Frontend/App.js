import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomButton from './components/buttons/Button';
import SignInScreen from './screens/auth/login';
import SingUpScren from './screens/auth/singup';
import AuthState from './services/auth/context/authState';
import AuthContext from './services/auth/context/authContext';
import EjemploScreen from './screens/ejemplo';
import Inbox from './screens/inbox/inbox';
import Programadas from './screens/programadas/programadas'

// ICONS
import { FontAwesome5 } from '@expo/vector-icons';
import SideBar from './components/SideBar/SideBar';

const Drawer = createDrawerNavigator();
const LoginStack = createNativeStackNavigator();


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
      state.checkSession();
    };

    bootstrapAsync();
  }, []);

  function HomeNotLogged() {
    return (
      <LoginStack.Navigator>
        <LoginStack.Screen
          name="SignIn"
          component={SignInScreen}
          options={{
            title: 'SignIn',
            // When logging out, a pop animation feels intuitive
            animationTypeForReplace: state.isSignout ? 'pop' : 'push',
            headerShown: false
          }}
        />
        <LoginStack.Screen
          name="SignUp"
          component={SingUpScren}
          options={{
            title: 'SignUp',
            // When logging out, a pop animation feels intuitive
            animationTypeForReplace: state.isSignout ? 'pop' : 'push',
            headerShown: false
          }}
        />
      </LoginStack.Navigator>
    )
  }

  return (
    <Drawer.Navigator
    // drawerContent={(props) => <SideBar {...props}/>}
    >
      {state.userToken == null ? (
        // No token found, user isn't signed in
        <>
          {/* <Drawer.Screen
            name="SignIn"
            component={SignInScreen}
            options={{
              title: 'SignIn',
              // When logging out, a pop animation feels intuitive
              animationTypeForReplace: state.isSignout ? 'pop' : 'push',
            }}
          />
          <Drawer.Screen
            name="SignUp"
            component={SingUpScren}
            options={{
              title: 'SignUp',
              // When logging out, a pop animation feels intuitive
              animationTypeForReplace: state.isSignout ? 'pop' : 'push',
            }}
          /> */}
          <Drawer.Screen options={{headerShown: false}} name='Test' component={HomeNotLogged}/>
        </>
      ) : (
        // User is signed in
        <>
          <Drawer.Screen name="Home" component={HomeScreen} />
          <Drawer.Screen name="About" component={AboutScreen} />
          <Drawer.Screen name="Ejemplo" component={EjemploScreen} />
          <Drawer.Screen
            name="Inbox"
            component={Inbox}
            options={{
              title: 'Inbox',
              drawerIcon: () => (
                <FontAwesome5 name="inbox" size={24} color={'orange'} />
              ),
            }}
          />
          <Drawer.Screen 
            name="Programadas" 
            component={Programadas} 
            options={{
              title:'Programadas',
              drawerIcon: () => (
                <FontAwesome5 name="calendar" size={24} color={'cyan'} />
              ),
            }}
          />
        </>
      )}
    </Drawer.Navigator>
  );
}

const HomeScreen = ({ navigation }) => {
  const state = React.useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text>Welcome to TFG-GTD APP!</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <CustomButton
          text="About"
          handler={() => navigation.navigate('About')}
        />
        <View style={styles.verticleLine}></View>
        <CustomButton
          text="Logout"
          handler={() => state.signOut()}
        />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const AboutScreen = ({ navigation }) => {
  const state = React.useContext(AuthContext);

  return (
    <View style={styles.aboutContainer}>
      <Text style={{ marginBottom: 10, fontWeight: 'bold' }}>About TFG-GTD APP</Text>
      <Text style={{ textAlign: 'justify' }}>The Productivity Methodology "Getting Things Done" (GTD), created by David Allen is one of the most effective methods for personal task organization. Its objective is to maximize productivity through the consolidation of all tasks, projects and activities in one place.</Text>
      <CustomButton
        text="Go to Home"
        handler={() => navigation.navigate('Home')}
      />
      <StatusBar style="auto" />
    </View>
  );
}

export default function App() {
  return (
    <AuthState>
      <NavigationContainer>
        <Router />
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
  aboutContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  verticleLine: {
    padding: 10
  }
});
