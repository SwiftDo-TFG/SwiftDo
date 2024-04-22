import { TouchableOpacity, Text, View, useColorScheme } from "react-native";
import {buttonStyles} from "../../styles/globalStyles";
import { useContext } from "react";
import ThemeContext from "../../services/theme/ThemeContext";


const ConfirmButton = ({ onPress, text}) =>{
    const themeContext = useContext(ThemeContext);
    // const theme = useColorScheme();
    const theme = themeContext.theme;
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