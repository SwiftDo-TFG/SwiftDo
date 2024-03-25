import React, { useRef, useState } from "react";
import { TouchableOpacity, View, Platform, useColorScheme  } from "react-native"
import { addButtonStyle } from "../../styles/globalStyles"
import { FontAwesome5 } from '@expo/vector-icons';
import { useDrawerStatus } from '@react-navigation/drawer';

const AddButton = ({onPress, onLongPress}) => {
    const [isPressed, setIsPressed] = useState(false)
    const drawerStatus = useDrawerStatus();
    const timerRef = useRef(null);
    
    const theme = useColorScheme();
    const addButton = addButtonStyle(theme);

    const activePress = () => {
        setIsPressed(true)
    }
    const inactivePress = () => {
        setIsPressed(false)
    }

    const handleShortPress = () => {
        clearTimeout(timerRef.current); // Reseteamos el contador
        if (onPress) {
            onPress();
        }
    }
    
    
    const handleLongPress = () => {
        clearTimeout(timerRef.current); // Reseteamos el contador
        if (onLongPress) {
            onLongPress();
        }
    };
  
    return (
        <TouchableOpacity 
            activeOpacity={0.9} 
            onPressIn={activePress} onPressOut={inactivePress}
            onPress={handleShortPress}
            onLongPress={handleLongPress}
            style={[addButton.container, isPressed && addButton.buttonPressed, {
                ...Platform.select({
                  ios: {
                    shadowColor: 'black',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.4,
                    shadowRadius: 2,
                  },
                  android: {
                    elevation: 4,
                  },
                })}]}>
                <View style={addButton.iconContainer}>
                    <FontAwesome5 name={'plus'} size={20} color="white" />
                    {drawerStatus === 'open' && <FontAwesome5 name="question" size={10} color="white" style={addButton.questionIcon} />}
                </View>
        </TouchableOpacity>
    )
}

export default AddButton;