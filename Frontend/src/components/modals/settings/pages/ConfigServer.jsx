import { View, TouchableOpacity, Text, TextInput, ActivityIndicator } from "react-native";
import { useState, useEffect, useContext } from 'react';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import configStorage from "../../../../services/configStorage/configStorage";
import serverConfigService from "../../../../services/serverconfig/serverConfigService";
import AuthContext from "../../../../services/auth/context/authContext";
import settingStyles from "../settingsStyles.styles";
import ThemeContext from "../../../../services/theme/ThemeContext";
import Colors from "../../../../styles/colors";
import CompleteTaskModal from "../../CompleteTaskModal";

const ConfigServer = ({ navigation, initialConfig }) => {
    const themeContext = useContext(ThemeContext);
    // const theme = useColorScheme();
    const theme = themeContext.theme;
    const [servers, setServers] = useState({ list: [] });
    const [isCreating, setIsCreating] = useState(false);
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
    const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(-1);
    const [changeIndex, setChangeIndex] = useState(-1);
    const [showTest, setShowTest] = useState({ show: false });

    //Form crear conexión
    const [serverName, setServerName] = useState('');
    const [serverUrl, setServerUrl] = useState('');

    //Auth context
    const authContext = useContext(AuthContext);

    useEffect(() => {
        async function getServers() {
            const config = await configStorage.getUserConfig();
            console.log("SERVERS", config)

            if (config && config.servers) {
                setServers(config.servers)
            }
        }
        getServers();
    }, [])

    const handleDeleteServer = async () => {
        if(deleteIndex != -1){
            const newServersList = servers.list;
            newServersList.splice(deleteIndex, 1);
            let newServers = { ...servers, list: newServersList };
            await configStorage.storeConfig("servers", newServers);
            setServers(newServers);
            setIsCompleteModalOpen(false);
        }
    }

    const handleChangeServer = async () => {
        if(changeIndex != -1){
            const newServers = { ...servers, selected: changeIndex }
            await configStorage.storeConfig("servers", newServers)
            authContext.signOut();
        }
    }
    

    return (
        <View>
            <View style={{ padding: 20, justifyContent: 'start', alignContent: 'center', flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => {
                    navigation.navigate('Sidebar');
                }}>
                    <Ionicons name="arrow-back" size={20} color={Colors[theme].white} />
                </TouchableOpacity>
                <Text style={[settingStyles.sideSettingsText, { color: Colors[theme].white }]}>
                    Configuración servidor
                </Text>
            </View>
            <View style={{ padding: 15 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={[settingStyles.sideSettingsText, { color: Colors[theme].white }]}>
                        Servidores configurados:
                    </Text>
                    <TouchableOpacity
                        style={[settingStyles.createServerButton, { backgroundColor: Colors[theme].themeColor, borderColor: Colors[theme].white }]}
                        onPress={() => setIsCreating(!isCreating)}>
                        <Text style={{ color: Colors[theme].white, fontSize: 12, textAlign: 'center' }}><Ionicons name="add-circle-outline" size={14} color={Colors[theme].white} /> Nuevo</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 10 }}>
                    {servers.list.map((server, index) => {
                        return (
                            <View key={server.name} style={{ padding: 10, borderColor: Colors[theme].white, borderWidth: 0.5, borderRadius: 10, marginBottom: 5 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={[settingStyles.serverSettingText, { color: Colors[theme].white, fontWeight: 'bold' }]}>
                                        <MaterialCommunityIcons name="server" size={12} color={Colors[theme].white} /> {server.name}
                                    </Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TouchableOpacity disabled={index === servers.selected} style={{ alignItems: 'center', justifyContent: 'center', marginRight: 5, padding: 2, borderRadius: 5, borderWidth: 0.5, borderColor: 'red' }}
                                            onPress={()=>{
                                                setDeleteIndex(index);
                                                setIsCompleteModalOpen(true)
                                            }}
                                        >
                                            <Ionicons name="close-circle-outline" size={16} color={'red'} />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[settingStyles.connectServerButton, { backgroundColor: Colors[theme].themeColor, borderColor: index === servers.selected ? 'green' : Colors[theme].white }]}
                                            onPress={() => {
                                                setChangeIndex(index);
                                                setIsChangeModalOpen(true)
                                            }}
                                            disabled={index === servers.selected}
                                        >
                                            <Text style={{ color: index === servers.selected ? 'green' : Colors[theme].white, fontSize: 10, textAlign: 'center' }}>
                                                {index === servers.selected ? 'Conectado' : 'Conectar'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <Text numberOfLines={1} style={[settingStyles.serverSettingText, { color: Colors[theme].white }]}>
                                    {server.url}
                                </Text>
                            </View>
                        )
                    })}
                    {isCreating && <View style={{ padding: 10, borderColor: Colors[theme].white, borderWidth: 0.5, borderRadius: 10, marginBottom: 5 }}>
                        <Text style={[settingStyles.serverSettingText, { color: Colors[theme].white, marginBottom: 10, textDecorationLine: 'underline' }]}>
                            Nuevo servidor
                        </Text>
                        <TextInput
                            style={[settingStyles.createServerTextInput, { color: theme === 'light' ? '#182E44' : Colors[theme].white }]}
                            placeholder="Introduce el nombre del servidor..."
                            placeholderTextColor={Colors[theme].configInput}
                            value={serverName}
                            onChangeText={setServerName}
                        />
                        <TextInput
                            style={[settingStyles.createServerTextInput, { color: theme === 'light' ? '#182E44' : Colors[theme].white }]}
                            placeholder="Introduce la Url del servidor..."
                            placeholderTextColor={Colors[theme].configInput}
                            value={serverUrl}
                            onChangeText={setServerUrl}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <TouchableOpacity
                                style={[settingStyles.connectServerButton, { backgroundColor: Colors[theme].themeColor, borderColor: Colors[theme].white }]}
                                onPress={async () => {
                                    if (serverUrl.length > 0) {
                                        setShowTest({ show: true, loading: true })
                                        const resTest = await serverConfigService.testServerConnection({ url: serverUrl });
                                        setShowTest({ show: true, result: resTest, loading: false })
                                    }
                                }}
                            >
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: Colors[theme].white, fontSize: 10, textAlign: 'center' }}>
                                        Probar conexion
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            {showTest.show &&
                                <View>
                                    {showTest.loading ? <ActivityIndicator size="small" /> :
                                        <Text style={{ color: showTest.result ? 'green' : 'red', fontSize: 10, textAlign: 'center' }}>
                                            {showTest.result ? 'Correcto' : 'Conexión no encontrada'}
                                        </Text>}
                                </View>
                            }
                            <TouchableOpacity
                                style={[settingStyles.connectServerButton, { backgroundColor: Colors[theme].themeColor, borderColor: Colors[theme].white }]}
                                onPress={async () => {
                                    setShowTest({ show: true, loading: true })
                                    const resConnect = await serverConfigService.createServerConnection(serverUrl, {});
                                    if (resConnect) {
                                        const newServersList = servers.list;
                                        let newServers;
                                        newServersList.push({ ...resConnect, name: serverName, url: serverUrl })
                                        if (initialConfig) {
                                            newServers = { ...servers, list: newServersList, selected: 0 };
                                        } else {
                                            newServers = { ...servers, list: newServersList };
                                        }
                                        setServers(newServers);
                                        await configStorage.storeConfig("servers", newServers)
                                        setIsCreating(false);

                                        if (initialConfig) {
                                            navigation.navigate("SignIn", { firstConfig: true });
                                        }
                                    } else {
                                        setShowTest({ show: true, result: false, loading: false })
                                    }
                                }}
                            >
                                <Text style={{ color: Colors[theme].white, fontSize: 10, textAlign: 'center' }}>
                                    Conectar
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>}
                </View>
            </View>
            <CompleteTaskModal
                title="Borrar Servidor"
                texto={"¿Desea borrar este servidor?"}
                onAccept={handleDeleteServer}
                isModalOpen={isCompleteModalOpen}
                setIsModalOpen={setIsCompleteModalOpen}
            />
            <CompleteTaskModal
                title="Cambiar servidor"
                texto={"IMPORTANTE!!! Le informamos que va a proceder a cambiar de servidor. Recuerde que tiene que reiniciar la aplicación en caso de producirse el cambio."}
                onAccept={handleChangeServer}
                isModalOpen={isChangeModalOpen}
                setIsModalOpen={setIsChangeModalOpen}
            />
        </View>
    )
}

export default ConfigServer;