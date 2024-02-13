import { Modal, View, TouchableOpacity, Text, TouchableWithoutFeedback, ScrollView } from "react-native"
import styles from '../../screens/tasks/actionScreen.styles'
import { FontAwesome5, Ionicons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import projectService from "../../services/project/projectService";
import { useEffect, useState } from "react";
import { sideBar } from '../../styles/globalStyles'


const SelectStateModal = (props) => {

    const [projects, setProjects] = useState([]);

    useEffect(() => {
        async function fetchProjects() {
            const data = await projectService.showProjectsByUser();
            console.log("PROJECTS", data)
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
                        <TouchableOpacity key={pro.project_id} onPress={() => props.handleSelectState(pro.project_id, pro)}>
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

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.state.showStatusSelector}
            onRequestClose={() => props.setState({ ...props.state, showStatusSelector: false })}
        >
            <View style={styles.stateModalContainer}>
                <OutSide isModalOpen={props.state.showStatusSelector} onCloseModal={props.onCloseModal} />
                <View style={styles.modalStyle}>
                    <ScrollView>
                        <TouchableOpacity onPress={() => props.handleSelectState("2")}>
                            <View style={styles.textContainer}>
                                <FontAwesome5 name="bolt" size={20} color={'#ffd700'} style={{ width: '15%' }} />
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
                                <FontAwesome5 name="inbox" size={20} color="#f39f18" style={{ width: '15%' }} />
                                <Text style={{ fontSize: 17 }}>Inbox</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={sideBar.separator} />
                        <ProjectsSelection />
                    </ScrollView>
                </View>
            </View>
        </Modal>
    )
}


export default SelectStateModal;