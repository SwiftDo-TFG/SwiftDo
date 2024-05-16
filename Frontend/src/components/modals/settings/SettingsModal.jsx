
import { View, useWindowDimensions, TouchableWithoutFeedback, Image, SafeAreaView, TouchableOpacity, Modal, useColorScheme, Text, StyleSheet, Platform, Animated, TextInput, ActivityIndicator, FlatList } from "react-native";
import { useState, useEffect, useContext } from 'react';
import styles from '../../../screens/tasks/actionScreen.styles'
import { createDrawerNavigator } from '@react-navigation/drawer';
import Colors from "../../../styles/colors";
import AuthTextInput from '../../../components/auth/AuthTextInput';
import CustomButton from "../../buttons/Button";
import { MaterialCommunityIcons, Feather, AntDesign, Ionicons, Octicons, MaterialIcons } from '@expo/vector-icons';
import contextService from "../../../services/context/contextService";
import tagService from "../../../services/tag/tagService";
import taskService from "../../../services/task/taskService";
import CompleteTaskModal from "../CompleteTaskModal";
import ThemeContext from "../../../services/theme/ThemeContext";
import LoadingIndicator from "../../LoadingIndicator";
import TaskList from "../../../screens/tasks/TaskList";
import { NativeBaseProvider } from "native-base";
import { ScrollView } from "react-native-virtualized-view";
import configStorage from "../../../services/configStorage/configStorage";
import serverConfigService from "../../../services/serverconfig/serverConfigService";
import AuthContext from "../../../services/auth/context/authContext";
import settingStyles from "./settingsStyles.styles";
import ConfigServer from "./pages/ConfigServer";

const SettingsDrawer = createDrawerNavigator();

const DatosPersonales = ({ navigation }) => {
    // const [email, setEmail] = useState('pepe@ucm.es');
    // const [user, setUser] = useState('Pepe');
    const themeContext = useContext(ThemeContext);
    // const theme = useColorScheme();
    const theme = themeContext.theme;
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
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignContent: 'center' }}>
            <View style={{ marginHorizontal: 20, justifyContent: 'space-between', alignContent: 'flex-start', flexDirection: 'row' }}>
                <View style={{ marginTop: 20, justifyContent: 'start', alignContent: 'center', flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('Sidebar');
                    }}>
                        <Ionicons name="arrow-back" size={20} color={Colors[theme].white} />
                    </TouchableOpacity>
                    <Text style={[settingStyles.sideSettingsText, { color: Colors[theme].white }]}>
                        Datos personales
                    </Text>
                </View>
                <Image
                    style={{ width: 65, height: 65, borderRadius: 15, marginBottom: 15 }}
                    source={require('../../../assets/icon.png')}
                />
            </View>
            <View style={{ width: '100%', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
        </View>
    )
}

const Tema = ({ navigation }) => {
    const items = [{ name: 'Predeterminado', value: themePedet }, { name: 'Claro', value: 'light' }, { name: 'Oscuro', value: 'dark' }]

    const themePedet = useColorScheme();
    const themeContext = useContext(ThemeContext);
    const theme = themeContext.theme;
    const index = themePedet === theme ? 0 : (theme === 'light' ? 1 : 2)
    const [value, setValue] = useState(items[index])
    const dimensions = useWindowDimensions();


    return (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignContent: 'center' }}>
            <View style={{ marginHorizontal: 20, justifyContent: 'space-between', alignContent: 'flex-start', flexDirection: 'row' }}>
                <View style={{ marginTop: 20, justifyContent: 'start', alignContent: 'center', flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('Sidebar');
                    }}>
                        <Ionicons name="arrow-back" size={20} color={Colors[theme].white} />
                    </TouchableOpacity>
                    <Text style={[settingStyles.sideSettingsText, { color: Colors[theme].white }]}>
                        Tema
                    </Text>
                </View>
            </View>
            <View style={{ padding: 20, flex: 1, flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <Image
                    style={{ width: 200, height: 200, marginBottom: 15 }}
                    source={theme === 'light' ? require('../../../assets/temas_c.png') : require('../../../assets/temas.png')}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'center', borderColor: Colors[theme].white, borderWidth: 1, borderRadius: 20, width: '100%' }}>
                    {items.map(option => {
                        return (
                            <TouchableOpacity key={option.name} onPress={() => {
                                setValue(option)
                                themeContext.changeTheme(option.value)
                            }} style={[settingStyles.themeSelectorPill, value.name === option.name ? { ...settingStyles.themeSelectorPillSelected, borderColor: Colors[theme].white, backgroundColor: Colors[theme].white } : []]}>
                                <Text numberOfLines={1} style={{ color: value.name === option.name ? Colors[theme].themeColor : Colors[theme].white, textAlign: 'center', fontSize: dimensions.width >= 768 ? 16 : 12 }}>{option.name}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </View>
        </View>
    )
}
const AdminContext = ({ navigation }) => {
    const [userContext, setUserContext] = useState([]);
    //Theme
    const themeContext = useContext(ThemeContext);
    // const theme = useColorScheme();
    const theme = themeContext.theme;
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
    const [deleteContextId, setDeleteContextId] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    async function getAreas() {
        const userContext = await contextService.showContextsByUser();
        setUserContext(userContext);
        setIsLoading(false);
    }

    async function handleDeleteContext() {
        setIsLoading(true);
        await contextService.deleteContext(deleteContextId);
        getAreas();
        setIsCompleteModalOpen(false);
    }

    useEffect(() => {
        getAreas();
    }, [])
    return (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignContent: 'center' }}>
            <View style={{ marginHorizontal: 20, justifyContent: 'space-between', alignContent: 'flex-start', flexDirection: 'row' }}>
                <View style={{ marginTop: 20, justifyContent: 'start', alignContent: 'center', flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('Sidebar');
                    }}>
                        <Ionicons name="arrow-back" size={20} color={Colors[theme].white} />
                    </TouchableOpacity>
                    <Text style={[settingStyles.sideSettingsText, { color: Colors[theme].white }]}>
                        Administrar contextos
                    </Text>
                </View>
            </View>
            <View style={{ overflow: 'hidden', padding: 20 }}>
                <ScrollView style={{ flexGrow: 1, width: '100%' }} vertical={true} showsVerticalScrollIndicator={false}>
                    {!isLoading ? Object.keys(userContext).map((key, index) => (
                        <View key={index} style={{ marginVertical: 5, marginLeft: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <MaterialCommunityIcons name="home-city-outline" size={16} color=/*"#272c34"*/ {Colors[theme].white} />
                                <Text style={{ color: Colors[theme].white, fontSize: 16, marginLeft: 15 }}>{userContext[key].name}</Text>
                            </View>
                            <TouchableOpacity onPress={async () => {
                                setDeleteContextId(userContext[key].context_id);
                                setIsCompleteModalOpen(true);
                            }}
                            ><MaterialCommunityIcons name="close-circle" size={16} color={Colors[theme].white} /></TouchableOpacity>
                        </View>
                    )) : <LoadingIndicator />}
                </ScrollView>
            </View>
            <CompleteTaskModal
                title="Borrar contexto"
                texto={"¿Desea borrar este contexto?"}
                onAccept={handleDeleteContext}
                isModalOpen={isCompleteModalOpen}
                setIsModalOpen={setIsCompleteModalOpen}
            />
        </View>
    )
}

const AdminTag = ({ navigation }) => {
    const [tags, setTags] = useState([]);
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
    const [deleteTagId, setDeleteTagId] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const themeContext = useContext(ThemeContext);
    // const theme = useColorScheme();
    const theme = themeContext.theme;

    async function getTags() {
        const dataTags = await tagService.getAllTags();
        setTags(dataTags);
        setIsLoading(false);
    }

    async function handleDeleteTags() {
        setIsLoading(true);
        tagService.deleteTag(deleteTagId)
        getTags()
        setIsCompleteModalOpen(false);
    }

    useEffect(() => {
        getTags()
    }, [])
    return (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignContent: 'center' }}>
            <View style={{ marginHorizontal: 20, justifyContent: 'space-between', alignContent: 'flex-start', flexDirection: 'row' }}>
                <View style={{ marginTop: 20, justifyContent: 'start', alignContent: 'center', flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('Sidebar');
                    }}>
                        <Ionicons name="arrow-back" size={20} color={Colors[theme].white} />
                    </TouchableOpacity>
                    <Text style={[settingStyles.sideSettingsText, { color: Colors[theme].white }]}>
                        Administrar Etiquetas
                    </Text>
                </View>
            </View>
            <View style={{ overflow: 'hidden', padding: 20 }}>
                <ScrollView style={{ flexGrow: 1, width: '100%' }} vertical={true} showsVerticalScrollIndicator={false}>
                    {!isLoading ? Object.keys(tags).map((key, index) => (
                        <View key={index} style={{ marginVertical: 5, marginLeft: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <MaterialCommunityIcons name="tag-outline" size={16} color=/*"#272c34"*/ {Colors[theme].white} />
                                <Text style={{ color: Colors[theme].white, fontSize: 16, marginLeft: 15 }}>{tags[key].name}</Text>
                            </View>
                            <TouchableOpacity onPress={() => {
                                setDeleteTagId(tags[key].name);
                                setIsCompleteModalOpen(true);
                            }}>
                                <MaterialCommunityIcons name="close-circle" size={16} color={Colors[theme].white} />
                            </TouchableOpacity>
                        </View>
                    )) : <LoadingIndicator />}
                </ScrollView>
            </View>
            <CompleteTaskModal
                title="Borrar etiqueta"
                texto={"¿Desea borrar esta etiqueta?"}
                onAccept={handleDeleteTags}
                isModalOpen={isCompleteModalOpen}
                setIsModalOpen={setIsCompleteModalOpen}
            />
        </View>
    )
}
const TareasCompletadas = ({ navigation }) => {
    const themeContext = useContext(ThemeContext);
    const theme = themeContext.theme;
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTasks, setSelectedTasks] = useState({});

    async function getTasks() {
        const dataTasks = await taskService.getTasks({ completed: true });
        setIsLoading(false);
        const seletedAux = {}
        dataTasks.forEach(async (task) => {
            seletedAux[task.task_id] = false;
        })
        console.log("Estas son las tareas que se devuelven", dataTasks)
        setTasks(dataTasks);

        seletedAux.total = 0;
        setSelectedTasks(seletedAux);

    }

    useEffect(() => {
        getTasks()
    }, [])

    return (

        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignContent: 'center' }}>
            <View style={{ marginHorizontal: 20, justifyContent: 'space-between', alignContent: 'flex-start', flexDirection: 'row' }}>
                <View style={{ marginTop: 20, justifyContent: 'start', alignContent: 'center', flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('Sidebar');
                    }}>
                        <Ionicons name="arrow-back" size={20} color={Colors[theme].white} />
                    </TouchableOpacity>
                    <Text style={[settingStyles.sideSettingsText, { color: Colors[theme].white }]}>
                        Tareas completadas
                    </Text>
                </View>
            </View>
            {/* <View style={{ flex: 1, overflow: 'hidden', paddingHorizontal: 22 }}>
                    <NativeBaseProvider>
                        <TaskList
                            tasks={tasks}
                            navigation={navigation}
                            // showEditPopUp={showEditPopUp}
                            // showMovePopUp={showMovePopUp}
                            // showCompleteModal={showCompleteModal}
                            selectedTasks={selectedTasks}
                            setSelectedTasks={setSelectedTasks}
                        // setIsMoveModalOpen={setIsMoveModalOpen}
                        // setIsCompleteModalOpen={setIsCompleteModalOpen}
                        /></NativeBaseProvider>

            </View> */}
            <View style={{ flex: 1, overflow: 'hidden', paddingHorizontal: 22 }}>
                <ScrollView style={{ flex: 1, flexGrow: 1, width: '100%' }} vertical={true} showsVerticalScrollIndicator={false}>
                    {!isLoading ? Object.keys(tasks).map((key, index) => (
                        <View key={index} style={{ marginVertical: 5, marginLeft: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <Octicons name="tasklist" size={16} color=/*"#272c34"*/ {Colors[theme].white} />
                                <Text style={{ color: Colors[theme].white, fontSize: 16, marginLeft: 15 }}>{tasks[key].title}</Text>
                            </View>
                        </View>
                    )) : <LoadingIndicator />}
                </ScrollView>
            </View>
        </View >

    )
}
const AcercaGTD = ({ navigation }) => {
    const themeContext = useContext(ThemeContext);
    // const theme = useColorScheme();
    const theme = themeContext.theme;
    return (
        <View style={{ padding: 20, justifyContent: 'start', alignContent: 'center', flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => {
                navigation.navigate('Sidebar');
            }}>
                <Ionicons name="arrow-back" size={20} color={Colors[theme].white} />
            </TouchableOpacity>
            <Text style={[settingStyles.sideSettingsText, { color: Colors[theme].white }]}>
                Acerca GTD
            </Text>
        </View>
    )
}
const Alexa = ({ navigation }) => {
    const themeContext = useContext(ThemeContext);
    // const theme = useColorScheme();
    const theme = themeContext.theme;
    const data = [
        { key: '1', text: 'Acceda a la aplicación de "Amazon Alexa".' },
        { key: '2', text: 'Acceda a la sección "Más" y a continuación "Skills y juegos".' },
        { key: '3', text: 'Busque la skill de la aplicación: "SwiftDo"' },
        { key: '4', text: 'Presione en "Permitir su uso"' },
        { key: '5', text: 'Para vincular Alexa a SwiftDo, presione "Configuración" y a continuación "Vincular cuenta"' },
        { key: '6', text: 'Introduzca su "Correo electrónico" y "Contraseña", y a continuación "Vincular"' },
        { key: '7', text: 'Para hacer uso de la skill primero tiene que activarla mediante el siguiente comando de voz: "Alexa, abre añadir tarea"' },
        { key: '8', text: 'Una vez activada tendrá que indicar el título de la tarea obligatoriamente ("Añade la tarea Prueba con Amazon"), después podrá añadir más campos ("Añade la descripción Esto es una prueba", "Si la tarea es importante", "Pon de fecha limite el 22 de mayo"), si no quiere aportar más información, puedes finalizar ("Eso es todo")' },
    ];
    const renderItem = ({ item }) => (
        <View style={{ flexDirection: 'row', marginVertical: 5 }}>
            <Text style={{ marginRight: 10, color: Colors[theme].white }}>{item.key}.</Text>
            <Text style={{ color: Colors[theme].white }}>
                {item.text.split('"').map((part, index) => {
                    return index % 2 !== 0 ? <Text key={index} style={{ fontStyle: 'italic' }}>"{part}"</Text> : part;
                })}
            </Text>
        </View>
    );

    return (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignContent: 'center' }}>
            <View style={{ marginHorizontal: 20, justifyContent: 'space-between', alignContent: 'flex-start', flexDirection: 'row' }}>
                <View style={{ marginTop: 20, justifyContent: 'start', alignContent: 'center', flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('Sidebar');
                    }}>
                        <Ionicons name="arrow-back" size={20} color={Colors[theme].white} />
                    </TouchableOpacity>
                    <Text style={[settingStyles.sideSettingsText, { color: Colors[theme].white }]}>
                        Vincular con Alexa
                    </Text>
                </View>
                <Image style={{ width: 50, height: 50 }} source={require('../../../assets/alexa.png')} />
            </View>
            <ScrollView showsVerticalScrollIndicator={false}            >
                <View style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 10, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <View>
                        <Text style={{ color: Colors[theme].white }}>La aplicación permite vincularse a una skill de Alexa para así añadir tareas a partir de ésta.</Text>
                        <Text style={{ color: Colors[theme].white }}>Para su vinculación siga los siguientes pasos:</Text>
                        <FlatList
                            data={data}
                            renderItem={renderItem}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}
const Tutorial = ({ navigation }) => {
    const themeContext = useContext(ThemeContext);
    // const theme = useColorScheme();
    const theme = themeContext.theme;
    return (
        <View style={{ padding: 20, justifyContent: 'start', alignContent: 'center', flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => {
                navigation.navigate('Sidebar');
            }}>
                <Ionicons name="arrow-back" size={20} color={Colors[theme].white} />
            </TouchableOpacity>
            <Text style={[settingStyles.sideSettingsText, { color: Colors[theme].white }]}>
                Tutorial
            </Text>
        </View>
    )
}

const SideComponent = ({ theme, navigation }) => {
    const authContext = useContext(AuthContext);

    if (!theme) {
        const themeContext = useContext(ThemeContext);
        // const theme = useColorScheme();
        theme = themeContext.theme;
    }
    return (
        <View style={{ flex: 1, padding: 20, backgroundColor: Colors[theme].themeColor }}>
            <View style={settingStyles.topContainer}>
                <Text style={{ color: Colors[theme].white, fontSize: 20, marginBottom: 15, marginLeft: 5 }}>Ajustes</Text>
                <Image
                    style={settingStyles.icon}
                    source={require('../../../assets/icon.png')}
                />
            </View>
            <TouchableOpacity style={[settingStyles.sideSettingContainer, theme === 'light' ? settingStyles.sideContainerBackgrLight : settingStyles.sideContainerBackgrDark]}
                onPress={() => { navigation.navigate('DatosPersonales') }}>
                <MaterialCommunityIcons name="account-settings-outline" size={20} color=/*"#272c34"*/ {Colors[theme].white} />
                <Text style={[settingStyles.sideSettingsText, { color: Colors[theme].white }]}>
                    Datos personales
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[settingStyles.sideSettingContainer, theme === 'light' ? settingStyles.sideContainerBackgrLight : settingStyles.sideContainerBackgrDark]}
                onPress={() => { navigation.navigate('ConfigServer') }}>
                <MaterialCommunityIcons name="cloud-outline" size={20} color=/*"#272c34"*/ {Colors[theme].white} />
                <Text style={[settingStyles.sideSettingsText, { color: Colors[theme].white }]}>
                    Configuración del servidor
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[settingStyles.sideSettingContainer, theme === 'light' ? settingStyles.sideContainerBackgrLight : settingStyles.sideContainerBackgrDark]}
                onPress={() => { navigation.navigate('Tema') }}>
                <Feather name="sun" size={20} color=/*"#272c34"*/ {Colors[theme].white} />
                <Text style={[settingStyles.sideSettingsText, { color: Colors[theme].white }]}>
                    Personalizar tema
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[settingStyles.sideSettingContainer, theme === 'light' ? settingStyles.sideContainerBackgrLight : settingStyles.sideContainerBackgrDark]}
                onPress={() => { navigation.navigate('AdminContext') }}>
                <MaterialCommunityIcons name="home-city-outline" size={20} color=/*"#272c34"*/ {Colors[theme].white} />
                <Text style={[settingStyles.sideSettingsText, { color: Colors[theme].white }]}>
                    Administrar contextos
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[settingStyles.sideSettingContainer, theme === 'light' ? settingStyles.sideContainerBackgrLight : settingStyles.sideContainerBackgrDark]}
                onPress={() => { navigation.navigate('AdminTag') }}>
                <MaterialCommunityIcons name="tag-outline" size={20} color=/*"#272c34"*/ {Colors[theme].white} />
                <Text style={[settingStyles.sideSettingsText, { color: Colors[theme].white }]}>
                    Administrar etiquetas
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[settingStyles.sideSettingContainer, theme === 'light' ? settingStyles.sideContainerBackgrLight : settingStyles.sideContainerBackgrDark]}
                onPress={() => { navigation.navigate('TareasCompletadas') }}>
                <MaterialCommunityIcons name="sticker-check-outline" size={20} color=/*"#272c34"*/ {Colors[theme].white} />
                <Text style={[settingStyles.sideSettingsText, { color: Colors[theme].white }]}>
                    Tareas completadas
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[settingStyles.sideSettingContainer, theme === 'light' ? settingStyles.sideContainerBackgrLight : settingStyles.sideContainerBackgrDark]}
                onPress={() => { navigation.navigate('Tutorial') }}>
                <Ionicons name="library" size={20} color=/*"#272c34"*/ {Colors[theme].white} />
                <Text style={[settingStyles.sideSettingsText, { color: Colors[theme].white }]}>
                    Tutorial de la app
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[settingStyles.sideSettingContainer, theme === 'light' ? settingStyles.sideContainerBackgrLight : settingStyles.sideContainerBackgrDark]}
                onPress={() => { navigation.navigate('Alexa') }}>
                <Feather name="link" size={20} color=/*"#272c34"*/ {Colors[theme].white} />
                <Text style={[settingStyles.sideSettingsText, { color: Colors[theme].white }]}>
                    Vincular con Alexa
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[settingStyles.sideSettingContainer, theme === 'light' ? settingStyles.sideContainerBackgrLight : settingStyles.sideContainerBackgrDark]}
                onPress={() => { navigation.navigate('AcercaGTD') }}>
                <AntDesign name="warning" size={20} color=/*"#272c34"*/ {Colors[theme].white} />
                <Text style={[settingStyles.sideSettingsText, { color: Colors[theme].white }]}>
                    Acerca de GTD
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[settingStyles.sideSettingContainer, theme === 'light' ? settingStyles.sideContainerBackgrLight : settingStyles.sideContainerBackgrDark]}
                onPress={() => {
                    authContext.signOut()
                }}>
                <MaterialIcons name="logout" size={20} color={Colors[theme].white} />
                <Text style={[settingStyles.sideSettingsText, { color: Colors[theme].white }]}>
                    Cerrar sesión
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const SettingsModal = (props) => {
    const themeContext = useContext(ThemeContext);
    // const theme = useColorScheme();
    const theme = themeContext.theme;
    const dimensions = useWindowDimensions();

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

                <View style={[styles.modalSettingsContent, { zIndex: 2 }, { backgroundColor: Colors[theme].themeColor, borderWidth: theme === 'dark' ? 0.5 : 0, borderColor: theme === 'dark' ? 'white' : '', }]}>
                    <SettingsDrawer.Navigator id="settings drawer" screenOptions={{
                        headerShown: false,
                        drawerType: (dimensions.width >= 768) ? 'permanent' : 'front',
                        drawerStyle: { width: '40%' }
                    }}
                        drawerContent={(props) => (dimensions.width >= 768) ? <SideComponent theme={theme} {...props} /> : <></>}
                        defaultStatus={"closed"}
                        detachInactiveScreens={Platform.OS === 'web'}
                    >
                        {dimensions.width < 768 && <SettingsDrawer.Screen name="Sidebar" component={SideComponent} />}
                        <SettingsDrawer.Screen name="DatosPersonales" component={DatosPersonales} />
                        <SettingsDrawer.Screen name="ConfigServer" component={ConfigServer} />
                        <SettingsDrawer.Screen name="Tema" component={Tema} />
                        <SettingsDrawer.Screen name="AdminContext" component={AdminContext} />
                        <SettingsDrawer.Screen name="AdminTag" component={AdminTag} />
                        <SettingsDrawer.Screen name="TareasCompletadas" component={TareasCompletadas} />
                        <SettingsDrawer.Screen name="Alexa" component={Alexa} />
                        {/* <SettingsDrawer.Screen name="AcercaGTD" component={AcercaGTD} /> */}
                        {/* <SettingsDrawer.Screen name="Tutorial" component={Tutorial} /> */}

                    </SettingsDrawer.Navigator>
                </View>
            </View>
        </Modal >
    )
}

export default SettingsModal;