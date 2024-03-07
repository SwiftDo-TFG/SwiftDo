import { Text, TextInput } from "react-native";
import { formStyle } from "../../styles/globalStyles";

const AuthTextInput = (props) => {
    const isError = props.error.isError && props.error.errors[props.inputKey];
    const errMsg = isError ? props.error.errors[props.inputKey] : '';

    return (
        <>
            <TextInput
                placeholder={props.placeholder}
                value={props.value}
                onChangeText={props.onChangeText}
                style={isError ? formStyle.textInputError : formStyle.textInput}
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