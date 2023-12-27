import { useState, useContext } from 'react';
import { TextInput, View, Button, Text, ActivityIndicator } from 'react-native';
import styles from './login.styles'
import AuthContext from '../../services/auth/context/authContext';


function LoadingIndicator() {
    return (
      <View style={styles.loadingIndicator}>
         <ActivityIndicator size="large" />
      </View>
    );
}

function SignInScreen({navigation}) {
    const [email, setEmail] = useState('pepe@ucm.es');
    const [password, setPassword] = useState('Pepe@123');
    const [error, setError] = useState(false)

    const authState = useContext(AuthContext);
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login Into TFG-GTD App</Text>
            {authState.isLoading && <LoadingIndicator />}
            {error && <Text style={styles.textError}>Correo o contraseña no válidos</Text>}
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.textInput}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                style={styles.textInput}
                secureTextEntry
            />
            <Button title="Sign in" onPress={async () => {
                setError(false)
                const res = await authState.signIn({ email, password })

                if(res === -1){
                    setError(true);
                }

                setTimeout(()=>{
                    setError(false)
                }, 1500)
            }} />
        </View>
    );
}

export default SignInScreen;