import React, { useState, useEffect, useContext } from "react";
import { View, Image, Text, TouchableOpacity, Animated, TextInput, ActivityIndicator, useColorScheme } from "react-native";
import { sidebarStyles, textStyles } from "../../styles/globalStyles";
import { AntDesign, Entypo, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from "../../styles/colors";
import contextService from '../../services/context/contextService';
import FilterContext from "../../services/filters/FilterContext";
import ThemeContext from "../../services/theme/ThemeContext";


const Profile = ({ name, formattedDate, contexts, navigation }) => {
    const [mostrarAreas, setMostrarAreas] = useState(false);
    const [animatedHeight] = useState(new Animated.Value(0));
    const [iconRotation] = useState(new Animated.Value(0));
    const [userContext, setUserContext] = useState([]);
    const [newContextName, setNewContextName] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const filterContext = useContext(FilterContext);

    //Theme
    const themeContext = useContext(ThemeContext);
    // const theme = useColorScheme();
    const theme = themeContext.theme;
    const sideBar = sidebarStyles(theme);
    const textStyle = textStyles(theme);


    useEffect(() => {
        async function getAreas() {
            const userContext = await contextService.showContextsByUser();
            setUserContext(userContext);
        }
        // getAreas();
        setUserContext(contexts);
    }, [contexts])

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
        if(newContextName.length > 0){
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
        }
    };

    return (
        <>
            <View style={sideBar.profileContainer}>
                <Image
                    style={sideBar.profileImage}
                    source={require('../../assets/icon.png')}
                />
                <View style={{ marginLeft: 15 }}>
                    {name.length === 0 ?
                        <ActivityIndicator style={{ margin: 5 }} color="#272c34" size="small" /> :
                        <Text style={[textStyle.largeText, { color: Colors[theme].white, fontWeight: '600', paddingBottom: 5 }]}>{name}</Text>
                    }
                    <Text style={[textStyle.smallText, { color: Colors[theme].white }]}>{formattedDate}</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'column' }}>
                <TouchableOpacity onPress={toggleAreas}>
                    <View style={sideBar.areaContainer}>
                        <Text style={[sideBar.areaText, { color: Colors[theme].white }]}>Contextos</Text>
                        <Animated.View style={{ transform: [{ rotate: rotateIcon }] }}>
                            <AntDesign name="caretright" size={22} color={Colors[theme].white} />
                        </Animated.View>
                    </View>
                </TouchableOpacity>
                {mostrarAreas && (
                    <Animated.View style={{ height: animatedHeight, overflow: 'hidden', paddingHorizontal: 22 }}>
                        {Object.keys(userContext).map((key, index) => (
                            <TouchableOpacity key={index} onPress={() => {
                                filterContext.applyFilter(userContext[key])
                                navigation.closeDrawer();
                            }}>
                                <View style={{ marginVertical: 5, marginLeft: 15, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    {/* <AntDesign name="caretdown" size={16} color="#272c34" /> */}
                                    <MaterialCommunityIcons name="home-city-outline" size={16} color=/*"#272c34"*/ {Colors[theme].white} />
                                    <Text style={{ color: Colors[theme].white, fontSize: 16, marginLeft: 15 }}>{userContext[key].name}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                        <View style={{ marginVertical: 5, marginLeft: 15, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <TouchableOpacity onPress={handleNewContextSubmit}>
                                {isSaving ? (
                                    <ActivityIndicator color="#272c34" size="small" />
                                ) : (
                                    <FontAwesome name="plus-square" size={17} color={Colors[theme].white} />
                                )}
                            </TouchableOpacity>
                            <TextInput
                                style={{ color: Colors[theme].white, fontSize: 16, marginLeft: 15, width: '60%' }}
                                placeholder="Nueva área"
                                maxLength={20}
                                placeholderTextColor={Colors[theme].white}
                                value={newContextName}
                                onChangeText={text => setNewContextName(text)
                                }
                            />
                        </View>
                    </Animated.View>
                )}
            </View>
        </>
    );
};

export default Profile;
