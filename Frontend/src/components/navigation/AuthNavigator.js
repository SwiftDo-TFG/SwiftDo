import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from '../../screens/auth/login';
import SingUpScren from '../../screens/auth/singup';
import SplashScreen from '../../screens/auth/splash';

const LoginStack = createNativeStackNavigator();


const AuthNavigator = ({state}) =>{
    
    return(
        <LoginStack.Navigator>
            { state.isLoading && 
                <LoginStack.Screen
                name="SplashScreen"
                component={SplashScreen}
                options={{
                    title: 'SplashScreen',
                    // When logging out, a pop animation feels intuitive
                    animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                    headerShown: false
                }}
                />
            }
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
    );

}

export default AuthNavigator;