import { Platform, Text, TextInput, useColorScheme } from "react-native";
import { formStyles } from "../../styles/globalStyles";
import { useContext } from "react";
import ThemeContext from "../../services/theme/ThemeContext";

const AuthTextInput = (props) => {
    const isError = props.error.isError && props.error.errors[props.inputKey];
    const errMsg = isError ? props.error.errors[props.inputKey] : '';
    //Theme
    const themeContext = useContext(ThemeContext);
    // const theme = useColorScheme();
    const theme = themeContext.theme;
    const formStyle = formStyles(theme);
    return (
        <>
            <TextInput
                placeholder={props.placeholder}
                value={props.value}
                onChangeText={props.onChangeText}
                style={[isError ? formStyle.textInputError : formStyle.textInput, props.addstyle]}
                onFocus={() => {
                    //Si tiene error, desaparece al hacer focus
                    if (isError) {
                        const newErrors = props.error.errors;
                        delete newErrors[props.inputKey];
                        props.setError({ ...props.error, errors: newErrors })
                    }
                }}
                {...props}
            />
            {isError && <Text style={formStyle.textInputErrorText}>{errMsg}</Text>}
        </>
    )
}

export default AuthTextInput