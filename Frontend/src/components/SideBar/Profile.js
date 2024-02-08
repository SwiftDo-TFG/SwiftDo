import React, { useState, useEffect } from "react";
import { View, Image, Text, TouchableOpacity, Animated } from "react-native";
import { sideBar, textStyle } from "../../styles/globalStyles";
import { AntDesign } from '@expo/vector-icons';
import Colors from "../../styles/colors";
import contextService from '../../services/context/contextService';


const Profile = ({ name, formattedDate }) => {
    const [mostrarAreas, setMostrarAreas] = useState(false);
    const [animatedHeight] = useState(new Animated.Value(0));
    const [iconRotation] = useState(new Animated.Value(0));
    const [userContext, setUserContext] = useState(['hola', 'adios', 'buenas']);


    useEffect(() => {
        async function getAreas() {
            // const userContext = await contextService.showContextsByUser();

        }
        getAreas();
    }, [])

    const toggleAreas = () => {
        if (mostrarAreas) {
            Animated.timing(animatedHeight, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }).start(() => setMostrarAreas(!mostrarAreas));
            Animated.timing(iconRotation, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            setMostrarAreas(!mostrarAreas);
            Animated.timing(animatedHeight, {
                toValue: 100, // Ajusta el valor según sea necesario para mostrar todo el contenido
                duration: 300,
                useNativeDriver: false,
            }).start();
            Animated.timing(iconRotation, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    };

    const rotateIcon = iconRotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '90deg'],
    });

    return (
        <>
            <View style={sideBar.profileContainer}>
                <Image
                    style={sideBar.profileImage}
                    source={require('../../assets/perfil.png')}
                />
                <View style={{ marginLeft: 15 }}>
                    <Text style={[textStyle.largeText, { fontWeight: '600', paddingBottom: 5 }]}>{name}</Text>
                    <Text style={[textStyle.smallText, { color: Colors.grey }]}>{formattedDate}</Text>
                </View>
            </View>
            <TouchableOpacity onPress={toggleAreas}>
                <View style={{ flexDirection: 'column' }}>
                    <View style={sideBar.areaContainer}>
                        <Text style={sideBar.areaText}>Áreas</Text>
                        <Animated.View style={{ transform: [{ rotate: rotateIcon }] }}>
                            <AntDesign name="caretright" size={24} color="#272c34" />
                        </Animated.View>
                    </View>
                    {mostrarAreas && (
                        <Animated.View style={{ height: animatedHeight, overflow: 'hidden', paddingHorizontal: 22 }}>
                            {userContext.map((context, index) => (
                                <View key={index} style={{ marginVertical: 5, marginLeft: 15, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <AntDesign name="caretdown" size={16} color="#272c34" />
                                    <Text style={{ fontSize: 16, marginLeft: 15 }}>{context}</Text>
                                </View>
                            ))}
                        </Animated.View>
                    )}
                </View>
            </TouchableOpacity>
        </>
    );
};

export default Profile;
