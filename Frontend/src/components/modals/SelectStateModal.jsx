import { View, TouchableOpacity, Text, TouchableWithoutFeedback, ScrollView } from "react-native"
import styles from '../../screens/tasks/actionScreen.styles'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import projectService from "../../services/project/projectService";
import { useEffect, useState } from "react";
import { sideBar } from '../../styles/globalStyles'
import Modal from "../windows/Modal";


const SelectStateModal = (props) => {

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
            onRequestClose={() => props.setState({ ...props.state, showStatusSelector: false })}
            // WindowsProps
            popup={true}
            verticalOffset={220}
            horizontalOffset={-250}
            {...props}
        >
            <View style={styles.stateModalContainer}>
                {/* <OutSide isModalOpen={props.modalVisible} onCloseModal={props.onCloseModal} /> */}
                <View style={styles.modalStyle}>
                    <ScrollView>
                        <TouchableOpacity onPress={() => props.handleSelectState("2")}>
                            <View style={styles.textContainer}>
                                <FontAwesome name="bolt" size={20} color={'#ffd700'} style={{ width: '15%' }} />
                                <Text style={{ fontSize: 17 }}>Cuanto Antes</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => props.handleSelectState("3")}>
                            <View style={styles.textContainer}>
                                <Ionicons name="calendar-outline" size={20} color={'#008080'} style={{ width: '15%' }} />
                                <Text style={{ fontSize: 17 }}>Programada</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => props.handleSelectState("4")}>
                            <View style={styles.textContainer}>
                                <Entypo name="archive" size={20} color="#d2b48c" style={{ width: '15%' }} />
                                <Text style={{ fontSize: 17 }}>Archivadas</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => props.handleSelectState("1")}>
                            <View style={styles.textContainer}>
                                <FontAwesome name="inbox" size={20} color="#f39f18" style={{ width: '15%' }} />
                                <Text style={{ fontSize: 17 }}>Inbox</Text>
                            </View>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    )
}


export default SelectStateModal;