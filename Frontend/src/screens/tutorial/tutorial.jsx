import React, { useState } from 'react';
import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

// Array con las rutas de las imágenes
const tutorialImages = [
    require('../../assets/tutorial/tutorial_1.png'),
    require('../../assets/tutorial/tutorial_2.png'),
    require('../../assets/tutorial/tutorial_3.png'),
    require('../../assets/tutorial/tutorial_4.png'),
    require('../../assets/tutorial/tutorial_5.png'),
    require('../../assets/tutorial/tutorial_6.png'),
    require('../../assets/tutorial/tutorial_7.png'),
    require('../../assets/tutorial/tutorial_8.png'),
    require('../../assets/tutorial/tutorial_9.png'),
    require('../../assets/tutorial/tutorial_10.png'),
    require('../../assets/tutorial/tutorial_11.png'),
    require('../../assets/tutorial/tutorial_12.png'),
    require('../../assets/tutorial/tutorial_13.png'),
];

function Tutorial(props) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const onNextImage = () => {
        if (currentImageIndex < tutorialImages.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
        }
    };

    const onPrevImage = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        }
    };

    return (
        <ImageBackground source={tutorialImages[currentImageIndex]} style={{ flex: 1 }}>
            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <View style={{ height: '50%', paddingTop: 10 }}>
                    <TouchableOpacity onPress={() => {
                        setCurrentImageIndex(0);
                        props.navigation.navigate("Inbox");
                    }}>
                        <Text style={{ color: '#FEA500', fontSize: 16, textShadowColor: '#FEA500', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10, opacity: 0.8, textDecorationLine: 'underline' }}>
                            Saltar
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', height: '50%', width: '100%', paddingHorizontal: 10 }}>
                    <TouchableOpacity onPress={onPrevImage} disabled={currentImageIndex === 0}>
                        <AntDesign name="leftcircle" size={40} color={currentImageIndex === 0 ? '#CCCCCC' : '#FEA500'} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onNextImage} disabled={currentImageIndex === tutorialImages.length - 1}>
                        <AntDesign name="rightcircle" size={40} color={currentImageIndex === tutorialImages.length - 1 ? '#CCCCCC' : '#FEA500'} />
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
}

export default Tutorial;
