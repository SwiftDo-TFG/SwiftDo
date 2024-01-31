import { TouchableOpacity, Text, View } from "react-native";
import {buttonStyle} from "../../styles/globalStyles";


const ConfirmButton = ({ onPress, text}) =>{
    return (
        <View style={buttonStyle.container}>
            <TouchableOpacity style={buttonStyle.confirmButton} onPress={onPress}>
                <Text style={buttonStyle.buttonText} > {text} </Text>
            </TouchableOpacity>
        </View>
        
    )
}

export default ConfirmButton