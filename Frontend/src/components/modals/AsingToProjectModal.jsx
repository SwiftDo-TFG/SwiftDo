import {View, Text, TouchableWithoutFeedback, TouchableOpacity, ScrollView } from "react-native";
import styles from '../../screens/tasks/actionScreen.styles'
import { useEffect, useState } from "react";
import projectService from "../../services/project/projectService";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from "../windows/Modal";


const AssignToProjectModal = (props) => {

    const [projects, setProjects] = useState([]);

    useEffect(() => {
        async function fetchProjects() {
            const data = await projectService.showProjectsByUser();
            console.log("PROJECTS EN MODAL", data)
            setProjects(data);
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

    const ProjectsSelection = () => {
        return (
            <View>
                {projects.map(pro => {
                    return (
                        <TouchableOpacity key={pro.project_id} onPress={() => props.handleSelectProject(pro.project_id, pro)}>
                            <View style={styles.textContainer}>
                                <MaterialCommunityIcons style={{ width: '15%' }} name="circle-slice-8" size={26} color={pro.color} />
                                <Text style={{ fontSize: 17 }}>{pro.title}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                })}
            </View>
        )
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.modalVisible}
            onRequestClose={() => props.setState({ ...props.state, showAssProjectSelector: false })}
            // WindowsProps
            popup={true}
            verticalOffset={300}
            {...props}
        >
            <View style={styles.stateModalContainer}>
                {/* <OutSide isModalOpen={props.modalVisible} onCloseModal={props.onCloseModal} /> */}
                <View style={styles.modalStyle}>
                    <ScrollView>
                        <ProjectsSelection />
                    </ScrollView>
                </View>
            </View>
        </Modal>
    )

}

export default AssignToProjectModal;