import { Modal, View, TouchableOpacity, Text, TouchableWithoutFeedback, ScrollView, useColorScheme } from "react-native"
import styles from '../../screens/tasks/actionScreen.styles'
import { useEffect, useState } from "react";
import { contextModalStyles } from '../../styles/globalStyles'
import contextService from "../../services/context/contextService";
import Colors from "../../styles/colors";
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';


const SelectContextModal = (props) => {

    const [context, setContext] = useState([]);
    const theme = useColorScheme();
    const contextModal = contextModalStyles(theme);
    useEffect(() => {
        async function fetchProjects() {
            const data = await contextService.showContextsByUser();
            console.log("Actions", data)
            setContext(data);
        }

        fetchProjects();
    }, [])

    const OutSide = ({ onCloseModal, isModalOpen }) => {
        const view = <View style={{ flex: 1, width: '100%' }} />;
        if (!isModalOpen) return view;
        return (
            <TouchableWithoutFeedback onPress={() => { onCloseModal() }} style={{ flex: 1, width: '100%' }}>
                {view}
            </TouchableWithoutFeedback>
        );
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.modalVisible}
            onRequestClose={() => props.setState({ ...props.state, showContextSelector: false })}
        >
            <View style={styles.stateModalContainer}>
                <OutSide isModalOpen={props.modalVisible} onCloseModal={props.onCloseModal} />
                <View style={styles.modalStyle}>
                    <ScrollView>
                        {Object.keys(context).map((key, index) => (
                            <TouchableOpacity key={context[key].context_id} onPress={() => props.handleContextAction(context[key].context_id, context[key].name)}>
                                <View key={index} style={contextModal.context}>
                                <Text style={styles.contextTextModal}><MaterialCommunityIcons name="home-city-outline" size={16} color="#272c34" /> {context[key].name}</Text>
                                {/* <AntDesign name="caretdown" size={16} color="#272c34" /> */}
                                </View>
                            </TouchableOpacity>
                        ))}
                        {/* <TouchableOpacity onPress={() => props.handleContextAction(null, null)}>
                            <View style={[contextModal.context, {backgroundColor: Colors.red, justifyContent: 'center'}]}>
                                <Text style={{ fontSize: 16, color: Colors.white, fontWeight: 'bold' }}>Borrar área</Text>
                            </View>
                        </TouchableOpacity> */}
                    </ScrollView>
                </View>
            </View>
        </Modal >
    )
}


export default SelectContextModal;