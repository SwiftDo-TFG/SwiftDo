import { useState, useContext } from 'react';
import { TextInput, View, Text, ActivityIndicator, TouchableOpacity, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import AuthContext from '../../services/auth/context/authContext';
import { formStyle, textStyle } from '../../styles/globalStyles';
import ConfirmButton from '../../components/common/ConfirmButton';
import LoginImg from '../../components/common/ImageComponent';
import AuthTextInput from '../../components/auth/AuthTextInput';
import ErrorBadge from '../../components/auth/ErrorBadge';


function LoadingIndicator() {
    return (
        <View style={formStyle.loadingIndicator}>
            <ActivityIndicator size="large" />
        </View>
    );
}

function SignInScreen({ navigation }) {
    const [email, setEmail] = useState('pepe@ucm.es');
    const [password, setPassword] = useState('Pepe@123');
    const [error, setError] = useState({ isError: false, msg: '' })

    const authState = useContext(AuthContext);


    function emptyValuesError() {
        let error = {}

        if (email.length === 0) {
            error.email = "Campo obligatorio"
        }
        if (password.length === 0) {
            error.password = "Campo obligatorio"
        }

        return error;
    }

    const handlePress = async () => {
        setError(false);

        try {
            if (email.length > 0 && password.length > 0) {
                const res = await authState.signIn({ email, password });

                if (res === -1) {
                    setError({ isError: true, msg: 'Correo o contraseña no válidos', errors: {} });
                }
            }else{
                const errs = emptyValuesError();
                setError({ isError: true, msg: '', errors: errs });
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
        }
    };
    return (

        <View style={formStyle.container}>
            <SafeAreaView>
                <LoginImg />
                <View style={formStyle.textWrapper}>
                    <Text style={[textStyle.largeText, { fontWeight: 'bold', textAlign: 'center' }]}>Domina el caos, conquista tu día.</Text>
                </View>

                {authState.isLoading && <LoadingIndicator />}
                {error.isError && error.msg.length > 0 && <ErrorBadge msg={error.msg} />}
                <View style={{ justifyContent: 'center' }}>
                    <AuthTextInput
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        inputKey="email"
                        error={error}
                        setError={setError}
                    />
                    <AuthTextInput
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        inputKey="password"
                        error={error}
                        setError={setError}
                    />
                </View>

                <View style={formStyle.linkContainer} >
                    <Text style={textStyle.smallText}>¿Aun no tienes cuenta?</Text>
                    <TouchableOpacity onPress={() => { navigation.navigate('SignUp') }}>
                        <Text style={[textStyle.smallText, textStyle.linkText]}>Registrate</Text>
                    </TouchableOpacity>
                </View>

                <ConfirmButton onPress={handlePress} text="Iniciar sesión" />
            </SafeAreaView>
        </View>


    );
}

export default SignInScreen;