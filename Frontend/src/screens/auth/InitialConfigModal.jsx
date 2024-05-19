import { View, Image, Text, SafeAreaView, Modal, TouchableWithoutFeedback } from "react-native";
import { useContext, useState } from "react";
import ThemeContext from "../../services/theme/ThemeContext";
import Colors from "../../styles/colors";
import styles from "../tasks/actionScreen.styles";
import ConfigServer from "../../components/modals/settings/pages/ConfigServer";


const InitialConfigModal = (props) => {
    const themeContext = useContext(ThemeContext);
    // const theme = useColorScheme();
    const theme = themeContext.theme;


    return (
        <Modal
            transparent={true}
            animationType={'fade'}
            visible={props.isVisible}
            onRequestClose={() => props.setVisible(false)}
        >
            <View style={styles.modalDatePickerContainer}>
                <TouchableWithoutFeedback onPress={() => props.setVisible(false)}>
                    <View style={styles.modalDatePickerBackground} />
                </TouchableWithoutFeedback>
                <View style={[styles.modalSettingsContent, { zIndex: 2 }, { backgroundColor: Colors[theme].themeColor, borderWidth: theme === 'dark' ? 0.5 : 0, borderColor: theme === 'dark' ? 'white' : '', }]}>
                    <ConfigServer initialConfig={true} navigation={props.navigation}/>
                </View>
            </View>
        </Modal>
    )
}

export default InitialConfigModal;