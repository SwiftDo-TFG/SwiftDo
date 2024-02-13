import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator, useWindowDimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { registerRootComponent } from 'expo';
import CustomButton from './components/buttons/Button';
import SignInScreen from './screens/auth/login';
import SingUpScren from './screens/auth/singup';
import AuthState from './services/auth/context/authState';
import AuthContext from './services/auth/context/authContext';
import EjemploScreen from './screens/ejemplo';
import Inbox from './screens/actions/inbox';
import CuantoAntes from './screens/actions/cuantoAntes';
// import Project from './screens/actions/project';
import Programadas from './screens/programadas/programadas';
// ICONS
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import SideBar from './components/SideBar/SideBar';
// import ProjectScreen from './screens/project/project';
import Archivadas from './screens/actions/archivadas';
import { sideBar } from './styles/globalStyles';
import projectService from './services/project/projectService';
import Project from './screens/actions/project';
// import Project from './screens/project/project';

const Drawer = createDrawerNavigator();
const LoginStack = createNativeStackNavigator();


function Router() {
  const state = React.useContext(AuthContext);
  const dimensions = useWindowDimensions();
  const [projects, setProjects] = React.useState([])

  console.log("THIS IS THE AUTH STATE", state, state.userToken != null)
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
    async function fetchData() {
      const projectData = await projectService.showProjectsByUser();
      setProjects(projectData)
      console.log("[DATA]: ", projectData)
    }
    fetchData();
  }, []);
  const addProjects = () => {

    return projects && Array.isArray(projects) ? projects.map((project, i) => (
          <Drawer.Screen
            key={i}
            name={project.title}
            initialParams={{id:project.project_id, color: project.color, description: project.description}}
            component={Project}
            options={{
              title: project.title,
              headerShown: false
            }}
          />)) : console.log("Projects no es un array")
};
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
      drawerStyle={sideBar.dims}
      drawerContent={(props) => state.userToken != null ? <SideBar {...props} /> : <></>}
      gestureEnabled={state.userToken != null}
      screenOptions={{
        drawerType: (dimensions.width >= 768 && state.userToken != null) ? 'permanent' : 'front',
      }}
    >
      {state.userToken == null ? (
        // No token found, user isn't signed in
        <>
          <Drawer.Screen options={{ headerShown: false }} name='Test' component={HomeNotLogged} />
        </>
      ) : (
        // User is signed in
        <>
        {/* Actions: */}
          <Drawer.Screen
            name="Inbox"
            component={Inbox}
            options={{
              title: 'Inbox',
              drawerIcon: () => (
                <FontAwesome5 name="inbox" size={24} color={'orange'} />
              ),
              headerShown: false
            }}
          />
          <Drawer.Screen
            name="CuantoAntes"
            component={CuantoAntes}
            options={{
              title: 'Cuanto antes',
              headerShown: false
            }}
          />
          <Drawer.Screen
            name="Archivadas"
            component={Archivadas}
            options={{
              title: 'Archivadas',
              headerShown: false
            }}
          />
         {/* Proyectos: */}
          <Drawer.Screen
            name="Programadas"
            component={Programadas}
            options={{
              title: 'Programadas',
              drawerIcon: () => (
                <FontAwesome5 name="calendar" size={24} color={'cyan'} />
              ),
              headerShown: false
            }}
          />
          {addProjects()}
        </>
      )}
    </Drawer.Navigator>
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

registerRootComponent(App);
