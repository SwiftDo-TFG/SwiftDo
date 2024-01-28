import { useState } from 'react';
import { TextInput, View, Button, Text, ActivityIndicator, TouchableOpacity} from 'react-native';
import AuthContext from '../../services/auth/context/authContext';
import authService from "../../services/auth/auth"
import styles from './login.styles'

function SingUpScren({navigation}){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState({isError: false, msg:''})

    return(
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to TFG-GTD App!</Text>
            {error.isError && <Text style={styles.textError}>{error.msg}</Text>}
            <Text style={styles.formTitle}>Sign Up Into TFG-GTD App</Text>
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
            <TextInput
                placeholder="Repeat Password"
                value={password2}
                onChangeText={setPassword2}
                style={styles.textInput}
                secureTextEntry
            />
            <TouchableOpacity style={styles.linkContainer} onPress={()=>{navigation.navigate('SignIn')}}>
                <Text style={styles.linkText}>Already have an account? Sign in</Text>
            </TouchableOpacity>
            <Button title="Sign Up" color="blue" onPress={async () => {
                setError({isError: false, msg:''})

                if(password === password2){
                    const res = await authService.signup({ email: email, password: password });
    
                    if(!res){
                        setError({isError: true, msg:'Algo fue mal...'});
                        setTimeout(()=>{
                            setError({isError: false, msg:''})
                        }, 1500)
                    }
                    navigation.navigate('SignIn')
    
                }else{
                    setError({isError: true, msg:'Las contraseñas no coinciden'});
                    setTimeout(()=>{
                        setError({isError: false, msg:''})
                    }, 1500)
                }

            }} />
        </View>
    )
}

export default SingUpScren;