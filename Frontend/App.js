import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomButton from './components/buttons/Button';
import SignInScreen from './screens/auth/login';


const Drawer = createDrawerNavigator();

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

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Login" component={SignInScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
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
