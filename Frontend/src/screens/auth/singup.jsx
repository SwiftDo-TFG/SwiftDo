import { useState } from 'react';
import { TextInput, View, Button, Text, ActivityIndicator, TouchableOpacity, SafeAreaView, useColorScheme } from 'react-native';
import AuthContext from '../../services/auth/context/authContext';
import authService from "../../services/auth/auth"
import { textStyles, formStyles } from '../../styles/globalStyles';
import LoginImg from '../../components/common/ImageComponent';
import ConfirmButton from '../../components/common/ConfirmButton';
import AuthTextInput from '../../components/auth/AuthTextInput';
import ErrorBadge from '../../components/auth/ErrorBadge';
import Colors from '../../styles/colors';


function parseErrors(errors) {
    let error = {}

    errors.forEach(e => {
        error[e.path] = e.msg;
    })

    return error
}

function SingUpScren({ navigation }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState({ isError: false, msg: '' })
    const theme = useColorScheme();
    const textStyle = textStyles(theme);
    const formStyle = formStyles(theme);

    function emptyValuesError(){
        let error = {}

        if(username.length === 0){
            error.user = "Campo obligatorio"
        }
        if(email.length === 0){
            error.email = "Campo obligatorio"
        }
        if(password.length === 0){
            error.password = "Campo obligatorio"
        }

        if(password2.length === 0){
            error.password2 = "Campo obligatorio"
        }

        return error;
    }

    const handlePress = async () => {
        setError({ isError: false, msg: '' })

        try {
            if (username.length === 0 || email.length === 0 || password.length === 0) {
                const errs = emptyValuesError();
                setError({ isError: true, msg: '', errors: errs });
            } else if (password === password2) {
                const res = await authService.signup({ name: username, email: email, password: password });

                if (!res) {
                    setError({ isError: true, msg: 'Algo fue mal...', errors: {} });
                } else if (res.errors) {
                    const errs = parseErrors(res.errors)
                    setError({ isError: true, msg: '', errors: errs });
                } else {
                    navigation.navigate('SignIn')
                }

            } else {
                setError({ isError: true, msg: '', errors: { password: 'Las contraseñas no coinciden', password2: 'Las contraseñas no coinciden' } });
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
        }
    };


    const onChangePassword = (inputKey, value) => {
        let auxPass = password
        let auxPass2 = password2;

        if (inputKey === "password") {
            setPassword(value);
            auxPass = value
        } else if (inputKey === "password2") {
            setPassword2(value);
            auxPass2 = value
        }

        if (auxPass === auxPass2 && error.isError && (error.errors.password || error.errors.password2)) {
            const newErrors = error.errors;
            delete newErrors.password;
            delete newErrors.password2;
            setError({ ...error, errors: newErrors })
        }
    }


    return (
        <View style={formStyle.container}>
            <SafeAreaView>
                <LoginImg />
                <View style={formStyle.textWrapper}>
                    <Text style={[textStyle.largeText, { fontWeight: 'bold', textAlign: 'center', color: Colors[theme].white }]}>Domina el caos, conquista tu día.</Text>
                </View>

                {error.isError && error.msg.length > 0 && <ErrorBadge msg={error.msg} />}
                <View>
                    <AuthTextInput
                        placeholder="Usuario"
                        value={username}
                        inputKey="user"
                        onChangeText={setUsername}
                        // style={formStyle.textInput}
                        error={error}
                        setError={setError}
                    />
                    <AuthTextInput
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        inputKey="email"
                        setError={setError}
                        error={error}
                    />
                    <AuthTextInput
                        placeholder="Password"
                        value={password}
                        onChangeText={(value)=>{onChangePassword("password", value)}}
                        secureTextEntry
                        inputKey="password"
                        error={error}
                        setError={setError}
                    />
                    <AuthTextInput
                        placeholder="Repeat Password"
                        value={password2}
                        onChangeText={(value)=>{onChangePassword("password2", value)}}
                        inputKey="password2"
                        secureTextEntry
                        error={error}
                        setError={setError}
                    />
                </View>

                <View style={formStyle.linkContainer} >
                    <Text style={[textStyle.smallText, {color: Colors[theme].white}]}>¿Ya tienes cuenta?</Text>
                    <TouchableOpacity style={formStyle.linkContainer} onPress={() => { navigation.navigate('SignIn') }}>
                        <Text style={[textStyle.smallText, textStyle.linkText]}> Inicia sesión</Text>
                    </TouchableOpacity>
                </View>

                <ConfirmButton onPress={handlePress} text="Registrar" />
            </SafeAreaView>
        </View>
    )
}

export default SingUpScren;