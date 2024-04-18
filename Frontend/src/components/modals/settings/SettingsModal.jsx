
import { View, ScrollView, TouchableWithoutFeedback, Image, SafeAreaView, TouchableOpacity, Modal, useColorScheme, Text, StyleSheet } from "react-native";
import { useState, useEffect } from 'react';
import styles from '../../../screens/tasks/actionScreen.styles'
import { createDrawerNavigator } from '@react-navigation/drawer';
import Colors from "../../../styles/colors";
import AuthTextInput from '../../../components/auth/AuthTextInput';
import CustomButton from "../../buttons/Button";
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import contextService from "../../../services/context/contextService";
import tagService from "../../../services/tag/tagService";
const SettingsDrawer = createDrawerNavigator();

const DatosPersonales = () => {
    // const [email, setEmail] = useState('pepe@ucm.es');
    // const [user, setUser] = useState('Pepe');
    const [error, setError] = useState({ isError: false, msg: '' })
    function emptyValuesError() {
        let error = {}

        if (email.length === 0) {
            error.email = "Campo obligatorio"
        }
        if (password.length === 0) {
            error.password = "Campo obligatorio"
        }

        return error;
    }

    const handlePress = async () => {
        setError(false);

        try {
            if (email.length > 0 && password.length > 0) {
                const res = await authState.signIn({ email, password });

                if (res === -1) {
                    setError({ isError: true, msg: 'Correo o contraseña no válidos', errors: {} });
                }
            } else {
                const errs = emptyValuesError();
                setError({ isError: true, msg: '', errors: errs });
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
        }
    };
    return (
        <View style={{ flex: 1, marginHorizontal: 10, alignItems: 'center', justifyContent: 'center' }}>
            <SafeAreaView>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                        style={{ width: 65, height: 65, borderRadius: 15, marginBottom: 15 }}
                        source={require('../../../assets/icon.png')}
                    />
                    <AuthTextInput
                        placeholder="User"
                        // value={user}
                        // onChangeText={setUser}
                        secureTextEntry
                        inputKey="user"
                        error={error}
                        setError={setError}
                    />
                    <AuthTextInput
                        placeholder="Email"
                        // value={email}
                        // onChangeText={setEmail}
                        inputKey="email"
                        error={error}
                        setError={setError}
                    />
                    <CustomButton onPress={handlePress} text="Editar" />
                </View>
            </SafeAreaView>
        </View>
    )
}

const ConfigAPI = () => {
    return (
        <View style={{ padding: 20, justifyContent: 'center', alignContent: 'center' }}>
            <Text style={settingStyles.sideSettingsText}>
                Configuracion api
            </Text>
        </View>
    )
}
const Tema = () => {
    return (
        <View style={{ padding: 20, justifyContent: 'center', alignContent: 'center' }}>
            <Text style={settingStyles.sideSettingsText}>
                Temaaaa
            </Text>
        </View>
    )
}
const AdminContext = () => {
    const [userContext, setUserContext] = useState([]);
    const theme = useColorScheme();
    async function getAreas() {
        const userContext = await contextService.showContextsByUser();
        setUserContext(userContext);
    }
    useEffect(() => {
        getAreas();
    }, [])
    return (
        <View style={{ padding: 20, justifyContent: 'center', alignContent: 'center' }}>
            <Text style={settingStyles.sideSettingsText}>
                Administrar contextos
            </Text>
            <View style={{ overflow: 'hidden', paddingHorizontal: 22 }}>
                {Object.keys(userContext).map((key, index) => (
                    <View style={{ marginVertical: 5, marginLeft: 15, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        {/* <AntDesign name="caretdown" size={16} color="#272c34" /> */}
                        <MaterialCommunityIcons name="home-city-outline" size={16} color=/*"#272c34"*/ {Colors[theme].white} />
                        <Text style={{ color: Colors[theme].white, fontSize: 16, marginLeft: 15 }}>{userContext[key].name}</Text>
                        <TouchableOpacity key={index} onPress={async () => {
                            await contextService.deleteContext(userContext[key].context_id)
                            getAreas();
                        }}
                        ><MaterialCommunityIcons name="close-circle" size={16} color={Colors[theme].softGrey} /></TouchableOpacity>
                    </View>
                ))}
            </View>
        </View>
    )
}

const AdminTag = () => {
    const [tags, setTags] = useState([]);

    async function getTags() {
        const dataTags = await tagService.getAllTags();
        setTags(dataTags);
    }
    useEffect(() => {
        getTags()
    }, [])
    return (
        <View style={{ padding: 20, justifyContent: 'center', alignContent: 'center' }}>
            <Text style={settingStyles.sideSettingsText}>
                Administrar etiquetas
            </Text>
            {/* <View style={settingStyles.tagContainer}>
                {Object.keys(tags).map((key, index) => (
                    <View key={index} style={[settingStyles.tag, { backgroundColor: tags[key].colour, flexBasis: '24%' }]}>
                        <Text style={{ paddingBottom: 3, color: 'white' }}>{tags[key].name}</Text>
                        <TouchableOpacity onPress={() => {
                            tagService.deleteTag(tags[key].name)
                            getTags()
                        }}>

                            <FontAwesome name="close" size={12} color="white" style={{ marginLeft: 3 }} />
                        </TouchableOpacity>
                    </View>
                ))}
            </View> */}
            <ScrollView style={{ flexDirection: 'row', width: '100%' }} vertical={true} showsVerticalScrollIndicator={false}>
                {Object.keys(tags).map((key, index) => (
                    <View key={index} style={[settingStyles.tag, { backgroundColor: tags[key].colour }]}>
                        <Text style={{ color: 'white', paddingBottom: 3 }}>{tags[key].name}</Text>
                        <TouchableOpacity onPress={() => {
                            tagService.deleteTag(tags[key].name)
                            getTags()
                        }}>
                            <FontAwesome name="close" size={12} color="white" style={{ marginLeft: 3 }} />
                        </TouchableOpacity>
                    </View>
                ))}

            </ScrollView>
        </View>
    )
}
const TareasCompletadas = () => {
    return (
        <View style={{ padding: 20, justifyContent: 'center', alignContent: 'center' }}>
            <Text style={settingStyles.sideSettingsText}>
                Tareas completadas
            </Text>
        </View>
    )
}
const AcercaGTD = () => {
    return (
        <View style={{ padding: 20, justifyContent: 'center', alignContent: 'center' }}>
            <Text style={settingStyles.sideSettingsText}>
                Acerca GTD
            </Text>
        </View>
    )
}
const Tutorial = () => {
    return (
        <View style={{ padding: 20, justifyContent: 'center', alignContent: 'center' }}>
            <Text style={settingStyles.sideSettingsText}>
                Tutorial
            </Text>
        </View>
    )
}

const SideComponent = ({ theme, navigation }) => {
    return (
        <View style={{ flex: 1, padding: 20, backgroundColor: Colors[theme].themeColor }}>
            <View style={settingStyles.topContainer}>
                <Text style={settingStyles.sideSettingsText}>Ajustes</Text>
                <Image
                    style={settingStyles.icon}
                    source={require('../../../assets/icon.png')}
                />
            </View>
            <TouchableOpacity style={settingStyles.sideSettingContainer} onPress={() => { navigation.navigate('DatosPersonales') }}>
                <Text style={settingStyles.sideSettingsText}>
                    Datos personales
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={settingStyles.sideSettingContainer} onPress={() => { navigation.navigate('ConfigAPI') }}>
                <Text style={settingStyles.sideSettingsText}>
                    Configuración de la API
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={settingStyles.sideSettingContainer} onPress={() => { navigation.navigate('Tema') }}>
                <Text style={settingStyles.sideSettingsText}>
                    Personalizar tema
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={settingStyles.sideSettingContainer} onPress={() => { navigation.navigate('AdminContext') }}>
                <Text style={settingStyles.sideSettingsText}>
                    Administrar contextos
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={settingStyles.sideSettingContainer} onPress={() => { navigation.navigate('AdminTag') }}>
                <Text style={settingStyles.sideSettingsText}>
                    Administrar etiquetas
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={settingStyles.sideSettingContainer} onPress={() => { navigation.navigate('TareasCompletadas') }}>
                <Text style={settingStyles.sideSettingsText}>
                    Tareas completadas
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={settingStyles.sideSettingContainer} onPress={() => { navigation.navigate('AcercaGTD') }}>
                <Text style={settingStyles.sideSettingsText}>
                    Acerca de GTD
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={settingStyles.sideSettingContainer} onPress={() => { navigation.navigate('Tutorial') }}>
                <Text style={settingStyles.sideSettingsText}>
                    Tutorial de la app
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const SettingsModal = (props) => {
    const theme = useColorScheme();

    return (
        <Modal
            transparent={true}
            animationType={'fade'}
            visible={props.isVisible}
            onRequestClose={() => props.setVisible(false)}
        // {...props}
        >
            <View style={styles.modalDatePickerContainer}>

                <TouchableWithoutFeedback onPress={() => props.setVisible(false)}>
                    <View style={styles.modalDatePickerBackground} />
                </TouchableWithoutFeedback>

                <View style={[styles.modalSettingsContent, { zIndex: 2 }]}>
                    <SettingsDrawer.Navigator id="settings drawer" screenOptions={{
                        headerShown: false,
                        drawerType: 'permanent',
                        drawerStyle: { width: '40%' }
                    }}
                        drawerContent={(props) => <SideComponent theme={theme} {...props} />}

                    >
                        <SettingsDrawer.Screen name="DatosPersonales" component={DatosPersonales} />
                        <SettingsDrawer.Screen name="ConfigAPI" component={ConfigAPI} />
                        <SettingsDrawer.Screen name="Tema" component={Tema} />
                        <SettingsDrawer.Screen name="AdminContext" component={AdminContext} />
                        <SettingsDrawer.Screen name="AdminTag" component={AdminTag} />
                        <SettingsDrawer.Screen name="TareasCompletadas" component={TareasCompletadas} />
                        <SettingsDrawer.Screen name="AcercaGTD" component={AcercaGTD} />
                        <SettingsDrawer.Screen name="Tutorial" component={Tutorial} />

                    </SettingsDrawer.Navigator>
                </View>
            </View>
        </Modal >
    )
}


const settingStyles = StyleSheet.create({
    topContainer: {
        padding: 2,
        alignItems: 'center',
        flex: 1, justifyContent: 'space-between',
        flexDirection: 'row',
        width: '100%',
        marginBottom: 5
    },
    sideSettingsText: {
        color: 'white',
        fontSize: 20,
        marginBottom: 15
    },
    sideSettingContainer: {
        marginBottom: 10
    },
    icon: {
        width: 35,
        height: 35,
        borderRadius: 15
    },
    tagContainer: {
        // overflow: 'hidden',
        // paddingHorizontal: 22,
        // flexWrap: 'wrap',
        // flexDirection: 'column'
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginRight: 2,
        marginBottom: 2,
    },
})


export default SettingsModal;