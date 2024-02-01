import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native"
import { addButton } from "../../styles/globalStyles"
import { FontAwesome5 } from '@expo/vector-icons';
import { useDrawerStatus } from '@react-navigation/drawer';

const AddButton = () => {
    const [isPressed, setIsPressed] = useState(false)
    const drawerStatus = useDrawerStatus();
    const activePress = () => {
        setIsPressed(true)
    }
    const inactivePress = () => {
        setIsPressed(false)
    }

    const handleButtonPress = () => {
        if(drawerStatus === 'open'){
            console.log("Accion A")
        }
        else{
            console.log("Accion B")
        }
    }

    return (
        <TouchableOpacity 
            activeOpacity={0.9} 
            onPressIn={activePress} onPressOut={inactivePress}
            onPress={handleButtonPress}
            style={[addButton.container, isPressed && addButton.buttonPressed]}>
                <View style={addButton.iconContainer}>
                    <FontAwesome5 name={'plus'} size={20} color="white" />
                    {drawerStatus === 'open' && <FontAwesome5 name="question" size={10} color="white" style={addButton.questionIcon} />}
                </View>
        </TouchableOpacity>
    )
}

export default AddButton;