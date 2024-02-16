import { Modal, View, Text, TouchableWithoutFeedback, TouchableOpacity, ScrollView } from "react-native";
import styles from '../../screens/tasks/actionScreen.styles'
import { useEffect, useState } from "react";
import projectService from "../../services/project/projectService";
import { MaterialCommunityIcons } from '@expo/vector-icons';


const AssignToProjectModal = (props) => {

    const [projects, setProjects] = useState([]);

    useEffect(() => {
        async function fetchProjects() {
            const data = await projectService.showProjectsByUser();
            setProjects(data);
        }

        fetchProjects();
    }, [])

    const ProjectsSelection = () => {
        return (
            <View>
                {projects.map((pro, index) => {
                    return (
                        <TouchableOpacity key={pro.project_id} style={index + 1 === projects.length ? { marginBottom: 50 } : {}} onPress={() => {
                            onAcceptFunction(pro.project_id, true);
                        }}>
                            <View style={styles.textContainer}>
                                <MaterialCommunityIcons style={{ width: '15%' }} name="hexagon-slice-6" size={26} color={pro.color} />
                                <Text style={{ fontSize: 17 }}>{pro.title}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                })}
            </View>
        )
    }

    const OutSide = ({ onCloseModal, isModalOpen, children }) => {
        const view = <View style={{ flex: 1}}>
            {children}
        </View>;
        if (!isModalOpen) return view;
        return (
            <TouchableWithoutFeedback onPress={() => { onCloseModal() }} >
                {view}
            </TouchableWithoutFeedback>
        );
    }

    return (
        <Modal animationType="slide"
            transparent={true}
            visible={props.isModalOpen}
        // onRequestClose={() => props.setState({ ...props.state, showStatusSelector: false })}
        >
            <View style={styles.assignProjectModalContainer}>
                <OutSide isModalOpen={props.isModalOpen} onCloseModal={props.onCloseModal} />
                <View style={styles.modalStyle}>
                    <Text style={{ color: '#182E44', fontSize: 18, fontWeight: '500', marginBottom: 15, textAlign: 'center' }}>
                        Asignar a Proyecto
                    </Text>
                    <ScrollView>
                        <ProjectsSelection />
                    </ScrollView>
                </View>
                <OutSide isModalOpen={props.isModalOpen} onCloseModal={props.onCloseModal} />
            </View>
        </Modal>
    )

}

export default AssignToProjectModal;