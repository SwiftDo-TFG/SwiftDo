import PopUpModal from "./PopUpModal"
import { View, TextInput, TouchableOpacity, Modal, Text } from "react-native"
import styles from '../../screens/tasks/actionScreen.styles'
import { FontAwesome5, Ionicons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import CustomButton from "../buttons/Button";



function CompleteTaskModal({texto, ...props}) {

    function onCloseModal() {
        props.setIsModalOpen(false);
    }

    return (
        <Modal visible={props.isModalOpen} animationType="slide" transparent={true}>
            <View style={styles.confirmModalContainer}>
                {/* <OutSide isModalOpen={props.state.showStatusSelector} onCloseModal={props.onCloseModal}/> */}
                <View style={styles.modalStyle}>
                    <View style={{ alignItems: 'center'}}>
                        <Text style={{fontSize: 16, fontWeight: '500'}}>
                            {props.title}
                        </Text>
                        <Text style={{ color: '#182E44', fontSize: 16, fontWeight: '500', textAlign: 'center', marginTop: 20}}>
                            {texto}
                        </Text>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                            <View style={{marginRight: 10}}>
                                <TouchableOpacity
                                    style={styles.acceptButton}
                                    onPress={props.onAccept}>
                                    <Text style={styles.comfirmButtonText}>Aceptar</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{marginLeft: 10}}>
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