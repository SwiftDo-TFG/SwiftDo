import { TouchableOpacity, Text, View, useColorScheme } from "react-native";
import {buttonStyles} from "../../styles/globalStyles";


const ConfirmButton = ({ onPress, text}) =>{
    const theme = useColorScheme();
    const buttonStyle = buttonStyles(theme);
    return (
        <View style={buttonStyle.container}>
            <TouchableOpacity style={buttonStyle.confirmButton} onPress={onPress}>
                <Text style={buttonStyle.buttonText} > {text} </Text>
            </TouchableOpacity>
        </View>
        
    )
}

export default ConfirmButton