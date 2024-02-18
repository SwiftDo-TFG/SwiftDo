import { Modal, View, TouchableOpacity, Text, TouchableWithoutFeedback, ScrollView } from "react-native"
import styles from '../../screens/tasks/actionScreen.styles'
import { useEffect, useState } from "react";
import { contextModal } from '../../styles/globalStyles'
import contextService from "../../services/context/contextService";
import Colors from "../../styles/colors";


const SelectContextModal = (props) => {

    const [context, setContext] = useState([]);

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
            visible={props.state.showContextSelector}
            onRequestClose={() => props.setState({ ...props.state, showContextSelector: false })}
        >
            <View style={styles.stateModalContainer}>
                <OutSide isModalOpen={props.state.showContextSelector} onCloseModal={props.onCloseModal} />
                <View style={styles.modalStyle}>
                    <ScrollView>
                        {Object.keys(context).map((key, index) => (
                            <TouchableOpacity key={context[key].context_id} onPress={() => props.handleContextAction(context[key].context_id, context[key].name)}>
                                <View key={index} style={contextModal.context}>
                                    <Text style={{ fontSize: 16, marginLeft: 15 }}>{context[key].name}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity onPress={() => props.handleContextAction(null, null)}>
                            <View style={[contextModal.context, {backgroundColor: Colors.red, justifyContent: 'center'}]}>
                                <Text style={{ fontSize: 16, color: Colors.white, fontWeight: 'bold' }}>Borrar área</Text>
                            </View>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal >
    )
}


export default SelectContextModal;