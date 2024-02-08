import { useState } from 'react';
import { TextInput, View, Button, Text, ActivityIndicator, TouchableOpacity, SafeAreaView} from 'react-native';
import AuthContext from '../../services/auth/context/authContext';
import authService from "../../services/auth/auth"
import { textStyle, formStyle } from '../../styles/globalStyles';
import LoginImg from '../../components/common/ImageComponent';
import ConfirmButton from '../../components/common/ConfirmButton';


function SingUpScren({navigation}){
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState({isError: false, msg:''})
    const handlePress = async () => {
        setError({isError: false, msg:''})
        
        try {
            if(username.length === 0 || email.length === 0 || password.length === 0){
                setError({isError: true, msg:'Rellene todos los campos'});
                setTimeout(()=>{
                    setError({isError: false, msg:''})
                }, 1500)
            }else if(password === password2){
                const res = await authService.signup({ name: username, email: email, password: password });

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
        } catch (error) {
          console.error('Error al iniciar sesión:', error);
        }
    };
    return(
        <View style={formStyle.container}>
            <SafeAreaView>
                <LoginImg/>
                <View style={formStyle.textWrapper}>
                    <Text style={[textStyle.largeText, {fontWeight: 'bold', textAlign: 'center'}]}>Domina el caos, conquista tu día.</Text>
                </View>
                
                {error.isError && <Text style={textStyle.textError}>{error.msg}</Text>}
                <View>
                    <TextInput 
                        placeholder="Usuario"
                        value={username}
                        onChangeText={setUsername}
                        style={formStyle.textInput}
                    />
                    <TextInput 
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        style={formStyle.textInput}
                    />
                    <TextInput
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        style={formStyle.textInput}
                        secureTextEntry 
                    />
                    <TextInput
                        placeholder="Repeat Password"
                        value={password2}
                        onChangeText={setPassword2}
                        style={formStyle.textInput}
                        secureTextEntry
                    />
                </View>
                    
                <View style={formStyle.linkContainer} >
                    <Text style={textStyle.smallText}>¿Ya tienes cuenta?</Text>
                    <TouchableOpacity style={formStyle.linkContainer} onPress={()=>{navigation.navigate('SignIn')}}>
                        <Text style={[textStyle.smallText, textStyle.linkText]}>Inicia sesión</Text>
                    </TouchableOpacity>
                </View>

                <ConfirmButton onPress={handlePress} text="Registrar"/>
            </SafeAreaView>
        </View>
    )
}

export default SingUpScren;