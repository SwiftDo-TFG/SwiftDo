import React, { useState, useEffect } from "react";
import { View, Image, Text, TouchableOpacity, Animated, TextInput, ActivityIndicator  } from "react-native";
import { sideBar, textStyle } from "../../styles/globalStyles";
import { AntDesign, Entypo, FontAwesome } from '@expo/vector-icons';
import Colors from "../../styles/colors";
import contextService from '../../services/context/contextService';


const Profile = ({ name, formattedDate }) => {
    const [mostrarAreas, setMostrarAreas] = useState(false);
    const [animatedHeight] = useState(new Animated.Value(0));
    const [iconRotation] = useState(new Animated.Value(0));
    const [userContext, setUserContext] = useState([]);
    const [newContextName, setNewContextName] = useState('');
    const [isSaving, setIsSaving] = useState(false);



    useEffect(() => {
        async function getAreas() {
            const userContext = await contextService.showContextsByUser();
            setUserContext(userContext);
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
                toValue: (Object.keys(userContext).length + 1) * 31,
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

    const handleNewContextSubmit = async () => {
        setIsSaving(true);
        await contextService.createContext({ name: newContextName });
        setUserContext([...userContext, { name: newContextName }]);
        setNewContextName('');
        setIsSaving(false);
        Animated.timing(animatedHeight, {
            toValue: (Object.keys(userContext).length + 2) * 31,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    return (
        <>
            <View style={sideBar.profileContainer}>
                <Image
                    style={sideBar.profileImage}
                    source={require('../../assets/icon.png')}
                />
                <View style={{ marginLeft: 15 }}>
                    <Text style={[textStyle.largeText, { fontWeight: '600', paddingBottom: 5 }]}>{name}</Text>
                    <Text style={[textStyle.smallText, { color: Colors.grey }]}>{formattedDate}</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'column' }}>
                <TouchableOpacity onPress={toggleAreas}>
                    <View style={sideBar.areaContainer}>
                        <Text style={sideBar.areaText}>Áreas</Text>
                        <Animated.View style={{ transform: [{ rotate: rotateIcon }] }}>
                            <AntDesign name="caretright" size={22} color="#272c34" />
                        </Animated.View>
                    </View>
                </TouchableOpacity>
                {mostrarAreas && (
                    <Animated.View style={{ height: animatedHeight, overflow: 'hidden', paddingHorizontal: 22 }}>
                        {Object.keys(userContext).map((key, index) => (
                            <View key={index} style={{ marginVertical: 5, marginLeft: 15, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <AntDesign name="caretdown" size={16} color="#272c34" />
                                <Text style={{ fontSize: 16, marginLeft: 15 }}>{userContext[key].name}</Text>
                            </View>
                        ))}
                        <View style={{ marginVertical: 5, marginLeft: 15, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <FontAwesome name="plus-square" size={17} color="#272c34" />
                            <TextInput
                                style={{ fontSize: 16, marginLeft: 15, width: '60%' }}
                                placeholder="Nueva área"
                                value={newContextName}
                                onChangeText={text => setNewContextName(text)}
                            />
                            {newContextName.length > 0 && (
                                <TouchableOpacity onPress={handleNewContextSubmit}>
                                    {isSaving ? (
                                        <ActivityIndicator color="#272c34" size="small" />
                                    ) : (
                                        <FontAwesome name="cloud-upload" size={17} color="#272c34" />
                                    )}
                                </TouchableOpacity>
                            )}
                        </View>
                    </Animated.View>
                )}
            </View>
        </>
    );
};

export default Profile;
