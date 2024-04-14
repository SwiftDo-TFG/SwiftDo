
import { View, TouchableWithoutFeedback, TouchableOpacity, Modal, useColorScheme, Text, StyleSheet } from "react-native";
import styles from '../../../screens/tasks/actionScreen.styles'
import { createDrawerNavigator } from '@react-navigation/drawer';
import Colors from "../../../styles/colors";

const SettingsDrawer = createDrawerNavigator();

const TestComponent1 = () => {
    return (
        <View style={{padding: 20, justifyContent: 'center', alignContent: 'center'}}>
            <Text style={{ color: 'white' }}>
                This is the settings content 1.
            </Text>
        </View>
    )
}

const TestComponent2 = () => {
    return (
        <View style={{padding: 20, justifyContent: 'center', alignContent: 'center'}}>
            <Text style={{ color: 'white' }}>
                This is the settings content 2.
            </Text>
        </View>
    )
}
const TestComponent3 = () => {
    return (
        <View style={{padding: 20, justifyContent: 'center', alignContent: 'center'}}>
            <Text style={{ color: 'white' }}>
                This is the settings content 3.
            </Text>
        </View>
    )
}
const TestComponent4 = () => {
    return (
        <View style={{padding: 20, justifyContent: 'center', alignContent: 'center'}}>
            <Text style={{ color: 'white' }}>
                This is the settings content 4.
            </Text>
        </View>
    )
}

const TareasCompletadas = () => {
    return (
        <View>

        </View>
    )
}

const SideComponent = ({ theme, navigation }) => {
    return (
        <View style={{ flex: 1, padding: 20, backgroundColor: Colors[theme].themeColor }}>
            <TouchableOpacity style={settingStyles.sideSettingContainer} onPress={()=>{navigation.navigate('Test1')}}>
                <Text style={settingStyles.sideSettingsText}>
                    Setting 1
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={settingStyles.sideSettingContainer} onPress={()=>{navigation.navigate('Test2')}}>
                <Text style={settingStyles.sideSettingsText}>
                    Setting 2
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={settingStyles.sideSettingContainer} onPress={()=>{navigation.navigate('Test3')}}>
                <Text style={settingStyles.sideSettingsText}>
                    Setting 3 asdalsdjalskj
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={settingStyles.sideSettingContainer} onPress={()=>{navigation.navigate('Test4')}}>
                <Text style={settingStyles.sideSettingsText}>
                    Setting 4
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={settingStyles.sideSettingContainer} onPress={()=>{navigation.navigate('tareas completadas')}}>
                <Text style={settingStyles.sideSettingsText}>
                    Tareas completadas
                </Text>
            </TouchableOpacity>
            <Text  style={settingStyles.sideSettingsText}>Hola buenas</Text>
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
                        <SettingsDrawer.Screen name="Test1" component={TestComponent1} />
                        <SettingsDrawer.Screen name="Test2" component={TestComponent2} />
                        <SettingsDrawer.Screen name="Test3" component={TestComponent3} />
                        <SettingsDrawer.Screen name="Test4" component={TestComponent4} />
                        <SettingsDrawer.Screen name="tareas completadas" component={TareasCompletadas} />

                    </SettingsDrawer.Navigator>
                </View>
            </View>
        </Modal >
    )
}


const settingStyles = StyleSheet.create({
    sideSettingsText: {
        color: 'white',
        fontSize: 24
    },
    sideSettingContainer: {
        marginBottom: 10
    }
})


export default SettingsModal;