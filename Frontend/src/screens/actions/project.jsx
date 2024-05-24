import { Text, TouchableOpacity, View, useColorScheme } from "react-native";
import projectService from "../../services/project/projectService"
import ActionScreen from "../tasks/actionScreen";
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import React from "react";
import TaskStates from "../../utils/enums/taskStates";
import { actStyles } from "../../styles/globalStyles";
import CompleteTaskModal from "../../components/modals/CompleteTaskModal";
import CreateProjectModal from "../../components/modals/CreateProjectModal";
import Colors from "../../styles/colors";
import deviceStorage from "../../offline/deviceStorage";
import ThemeContext from "../../services/theme/ThemeContext";
import OfflineContext from "../../offline/offlineContext/OfflineContext";


function Project(props) {
    const [projectData, setData] = React.useState({ project: { project_id: props.route.params.project_id } })
    const [isCompleteModalVisible, setIsCompleteModalVisible] = React.useState(false);
    const [completeModalText, setCompleteModalText] = React.useState('');
    const [completeModalTitle, setCompleteModalTitle] = React.useState('');
    const [isDataLoaded, setDataLoaded] = React.useState(false);

    //Modal states
    const [editingProject, setEditingProject] = React.useState({});
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const themeContext = React.useContext(ThemeContext);
    // const theme = useColorScheme();
    const theme = themeContext.theme;
    const actStyle = actStyles(theme);

    //offline mode
    const offlineContext = React.useContext(OfflineContext);


    console.log("props de project***", props)
    React.useEffect(() => {
        // || projectData.project.project_id !== props.route.params.project_id
        // if (!isDataLoaded) {
        //     fetchData()
        //     //   setDataLoaded(true)
        // }
        const unsubscribe = props.navigation.addListener('focus', () => {
            console.log("SE EJECUTA FETCH DATA PROJECT", isDataLoaded, props.route.params)
            if (!isDataLoaded) {
                fetchData()
            }
        });

        return unsubscribe;
    }, [props.navigation]);

    async function fetchData() {
        const project = await projectService.showContent(props.route.params.project_id);

        if (project.error && project.error.status === 'timeout') {
            
            // const offlineData = await deviceStorage.getProjectData(props.route.params.project_id)
            if (projectData.project.title !== 0) {
                // await storeDataInDevice(projectData.project)
            }
            offlineContext.setOfflineMode();
            const offlineData = await getOfflineProjectData(props.route.params.project_id);
            console.log("ERRRORR EN PROYECTOSSS", project.error, offlineData, props.route.params.project_id)
            // console.log("THIS IS RETURNEDDDDD XLDSDSD", offlineData)
            setDataInScreen({project: offlineData});
        } else {
            setDataInScreen(project)
            if (project.project.title !== 0) {
                await storeDataInDevice(project.project)
            }
            // deviceStorage.storeProjectData(project.project.project_id, project)
        }
    }

    const storeDataInDevice = async (project_data) => {
        offlineContext.updateCatchedContextProjectData(project_data);
    }

    const getOfflineProjectData = async (project_id) => {
        let offLineData = offlineContext.catchedContent;
        console.log("getOfflineProjectData RETURNED", offLineData)
        return offLineData.projects && offLineData.projects[project_id] ? offLineData.projects[project_id].project : { project: { project_id: project_id } }
    }

    const setDataInScreen = (project) => {
        setData(project);
        setDataLoaded(true);
        console.log("ID PROJECT, ", project);
    }

    const progressIcon = () => {
        let slice = Math.ceil(projectData.percentage / 12.5);
        if (isNaN(slice)) slice = 0
        return slice !== 0 ? `circle-slice-${slice}` : "circle-outline";
    }

    const handlePress = () => {
        // se puede completar el proyecto
        if (projectData.tasks.length === 0) {
            setCompleteModalTitle("Proyecto a punto de completarse")
            setCompleteModalText("¿Desea continuar?");
            // TODO completar proyecto
            setIsCompleteModalVisible(true);
            console.log(" no TAreas")
        }
        // Se debe avisar al usuario si quiere seguir con la accion de completar todas las tareas antes de completar el proyecto
        else {
            setCompleteModalTitle("Aún hay tareas sin completar")
            setCompleteModalText("Al completar este proyecto se completarán éstas tareas.\n\n ¿Desea continuar?");
            // TODO completar proyecto
            setIsCompleteModalVisible(true);
            console.log("Tareas")
        }
    }

    const reloadData = () => {
        setDataLoaded(false)
        fetchData()
    }

    const closeModal = () => {
        setIsCompleteModalVisible(false);
    }

    const showEditPopUp = (id) => {
        const projectToEdit = projectData.project;
        if (projectToEdit) {
            setEditingProject(projectToEdit);
            setIsEditModalOpen(true);
        } else {
            console.error(`No se encontró el proyecto con ID: ${id}`);
        }
    }
    const updateProject = async (updatedProject) => {
        console.log(updatedProject)
        const updatedProjectResult = await projectService.modifyProject(updatedProject.project_id, updatedProject);
        console.log("ID: ", updatedProjectResult)
        if (updatedProjectResult !== -1) {
            setIsEditModalOpen(false);
            // setData(updatedProject);
            reloadData();
        } else {
            console.error("Error al actualizar la tarea en la base de datos");
        }
    };

    const handleCompleteProject = async () => {
        const updatedProjectResult = await projectService.completeProject(projectData.project.project_id);

        if (updatedProjectResult !== -1) {
            closeModal()
            props.navigation.navigate('Inbox');
        } else {
            console.error("Error al completar el proyecto");
        }
    }

    return (
        <ActionScreen {...props} state={TaskStates.PROJECT} project_id={projectData.project.project_id}>
            {isDataLoaded &&
                <>
                    <View style={actStyle.action} >
                        <TouchableOpacity onPress={handlePress}>
                            <MaterialCommunityIcons name={progressIcon()} style={actStyle.iconAction} color={projectData.project.color} />
                        </TouchableOpacity>
                        <Text style={[actStyle.actionTitle, { color: Colors[theme].white }]}>{projectData.project.title}</Text>
                        <TouchableOpacity onPress={() => showEditPopUp(projectData.project.project_id)}>
                            <MaterialCommunityIcons name="circle-edit-outline" size={22} color="#ffa540" />
                        </TouchableOpacity>
                    </View>
                    <Text style={[actStyle.description, { color: Colors[theme].white }]}> {projectData.project.description === null ? "Descripcion" : projectData.project.description} </Text>
                </>}
            <CompleteTaskModal
                title={completeModalTitle}
                texto={completeModalText}
                isModalOpen={isCompleteModalVisible}
                setIsModalOpen={closeModal}
                onAccept={handleCompleteProject}
            />
            {/* EDIT PROJECT MODAL   */}
            <CreateProjectModal
                title="Editar"
                // touch={hideEditPopUp}
                editingProject={editingProject}
                onAccept={updateProject}
                isModalOpen={isEditModalOpen}
                setIsModalOpen={setIsEditModalOpen}
            />
        </ActionScreen>

    )
}

export default Project;