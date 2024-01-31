import { useState, useContext } from 'react';
import { TextInput, View, Text, ActivityIndicator, TouchableOpacity, SafeAreaView, KeyboardAvoidingView} from 'react-native';
import AuthContext from '../../services/auth/context/authContext';
import { formStyle, textStyle } from '../../styles/globalStyles';
import ConfirmButton from '../../components/common/ConfirmButton';
import LoginImg from '../../components/common/ImageComponent';





function LoadingIndicator() {
    return (
      <View style={formStyle.loadingIndicator}>
         <ActivityIndicator size="large" />
      </View>
    );
}

function SignInScreen({navigation}) {
    const [email, setEmail] = useState('pepe@ucm.es');
    const [password, setPassword] = useState('Pepe@123');
    const [error, setError] = useState(false)

    const authState = useContext(AuthContext);
    
    const handlePress = async () => {
        setError(false); 
        
        try {
          const res = await authState.signIn({ email, password });
      
          if (res === -1) {
            setError(true);
            
            setTimeout(() => {
              setError(false);
            }, 1500);
          }
        } catch (error) {
          console.error('Error al iniciar sesión:', error);
        }
    };
    return (
        
            <View style={formStyle.container}>
                <SafeAreaView>
                    <LoginImg/>
                    <View style={formStyle.textWrapper}>
                        <Text style={[textStyle.largeText, {fontWeight: 'bold'}]}>Domina el caos, conquista tu día.</Text>
                    </View>
                    
                    {authState.isLoading && <LoadingIndicator />}
                    {error && <Text style={textStyle.textError}>Correo o contraseña no válidos</Text>}
                    <View>
                        <TextInput 
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            style={[formStyle.textInput, { marginBottom: 16}]}
                        />
                        <TextInput
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            style={formStyle.textInput}
                            secureTextEntry 
                        />
                    </View>
                        
                    <View style={formStyle.linkContainer} >
                        <Text style={textStyle.smallText}>¿Aun no tienes cuenta?</Text>
                        <TouchableOpacity onPress={()=>{navigation.navigate('SignUp')}}>
                            <Text style={[textStyle.smallText, textStyle.linkText]}>Registrate</Text>
                        </TouchableOpacity>
                    </View>

                    <ConfirmButton onPress={handlePress} text="Iniciar sesión"/>
                </SafeAreaView>
            </View>
        
        
    );
}

export default SignInScreen;