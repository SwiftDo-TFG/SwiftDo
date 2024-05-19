import React, { useContext } from "react";
import { View, TouchableOpacity, Modal, Text, useColorScheme, Platform, useWindowDimensions } from "react-native";
import styles from '../../screens/tasks/actionScreen.styles';
import Colors from "../../styles/colors";
import ThemeContext from "../../services/theme/ThemeContext";

function CompleteTaskModal({ texto, ...props }) {
    //Theme
    const themeContext = useContext(ThemeContext);
    const theme = themeContext.theme;
    const dimensions = useWindowDimensions();

    function onCloseModal() {
        props.setIsModalOpen(false);
    }

    function onModalContainerPress() {
        props.setIsModalOpen(false);
    }

    function onModalContentPress(event) {
        event.stopPropagation();
    }

    return (
        <Modal visible={props.isModalOpen} animationType="slide" transparent={true}>
            <TouchableOpacity style={styles.confirmModalContainer} onPress={onModalContainerPress}>
                <View  onPress={onModalContentPress} style={[styles.modalStyle, { backgroundColor: theme === 'light' ? 'white' : 'black', borderColor: theme === 'dark' ? Colors[theme].white : '', borderWidth: theme === 'dark' ? 0.5 : 0, width: (Platform.OS === 'web' && dimensions.width >= 768) ? '40%' : '100%', }]}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, fontWeight: '500', color: theme === 'light' ? '#182E44' : Colors[theme].white }}>
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
            </TouchableOpacity>
        </Modal>
    );
}

export default CompleteTaskModal;
