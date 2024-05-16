import PopUpModal from "./PopUpModal"
import { View, TextInput, TouchableOpacity, Modal, Text, useColorScheme, Platform } from "react-native"
import styles from '../../screens/tasks/actionScreen.styles'
import { FontAwesome5, Ionicons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import CustomButton from "../buttons/Button";
import Colors from "../../styles/colors";
import { useContext } from "react";
import ThemeContext from "../../services/theme/ThemeContext";



function CompleteTaskModal({ texto, ...props }) {
    //Theme
    const themeContext = useContext(ThemeContext);
    // const theme = useColorScheme();
    const theme = themeContext.theme;
    function onCloseModal() {
        props.setIsModalOpen(false);
    }

    return (
        <Modal visible={props.isModalOpen} animationType="slide" transparent={true}>
            <View style={styles.confirmModalContainer}>
                {/* <OutSide isModalOpen={props.state.showStatusSelector} onCloseModal={props.onCloseModal}/> */}
                <View style={[styles.modalStyle, { backgroundColor: theme === 'light' ? 'white' : 'black', borderColor: theme === 'dark' ? Colors[theme].white : '', borderWidth: theme === 'dark' ? 0.5 : 0, width: Platform.OS === 'web' ? '40%' : '100%', }]}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, fontWeight: '500', color: theme === 'light' ? '#182E44' : Colors[theme].white, }}>
                            {props.title}
                        </Text>
                        <Text style={{ color: theme === 'light' ? '#182E44' : Colors[theme].white, fontSize: 16, fontWeight: '500', textAlign: 'center', marginTop: 20 }}>
                            {texto}
                        </Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                            <View style={{ marginRight: 10 }}>
                                <TouchableOpacity
                                    style={styles.acceptButton}
                                    onPress={props.onAccept}>
                                    <Text style={styles.comfirmButtonText}>Aceptar</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginLeft: 10 }}>
                                <TouchableOpacity
                                    style={styles.acceptButton}
                                    onPress={onCloseModal}>
                                    <Text style={styles.comfirmButtonText}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default CompleteTaskModal;