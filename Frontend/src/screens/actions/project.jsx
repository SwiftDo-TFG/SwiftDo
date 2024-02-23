import { Text, TouchableOpacity, View } from "react-native";
import projectService from "../../services/project/projectService"
import ActionScreen from "../tasks/actionScreen";
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import React from "react";
import TaskStates from "../../utils/enums/taskStates";
import { actStyle } from "../../styles/globalStyles";
import CompleteTaskModal from "../../components/modals/CompleteTaskModal";
import CreateProjectModal from "../../components/modals/CreateProjectModal";


function Project(props) {
    const [projectData, setData] = React.useState({ project: { project_id: props.route.params.project_id } })
    const [isCompleteModalVisible, setIsCompleteModalVisible] = React.useState(false);
    const [completeModalText, setCompleteModalText] = React.useState('');
    const [completeModalTitle, setCompleteModalTitle] = React.useState('');
    const [isDataLoaded, setDataLoaded] = React.useState(false);

    //Modal states
    const [editingProject, setEditingProject] = React.useState({});
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

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
            setCompleteModalText("Al completar este proyecto se completarán éstas tareas. ¿Desea continuar?");
            // TODO completar proyecto
            setIsCompleteModalVisible(true);
            console.log("TAreas")
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
    return (
        <ActionScreen {...props} state={TaskStates.PROJECT} project_id={projectData.project.project_id}>
            {isDataLoaded &&
                <>
                    <View style={actStyle.action} >
                        <TouchableOpacity onPress={handlePress}>
                            <MaterialCommunityIcons name={progressIcon()} style={actStyle.iconAction} color={projectData.project.color} />
                        </TouchableOpacity>
                        <Text style={actStyle.actionTitle}>{projectData.project.title}</Text>
                        <TouchableOpacity onPress={() => showEditPopUp(projectData.project.project_id)}>
                            <MaterialCommunityIcons name="circle-edit-outline" size={22} color="#ffa540" />
                        </TouchableOpacity>
                    </View>
                    <Text style={actStyle.description}> {projectData.project.description === null ? "Descripcion" : projectData.project.description} </Text>
                </>}
            <CompleteTaskModal
                title={completeModalTitle}
                texto={completeModalText}
                isModalOpen={isCompleteModalVisible}
                setIsModalOpen={closeModal}
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

// const [selectedTasks, setSelectedTasks] = useState({});
// const [archiveTask, setArchiveTask] = useState([]);
// const [editingTask, setEditingTask] = useState({});
// const [selectAll, setSelectAll] = useState(false);
// let moveRef = React.createRef();
// let editRef = React.createRef();
// let addRef = React.createRef();
// const scrollY = useRef(new Animated.Value(0)).current;
// const ITEM_SIZE = 62; //Tamaño tarea + margin
// const [project_data, set_project_data] = React.useState({ title: "Proyecto 1", project_id: 1 },)
// const [tasks, set_tasks] = React.useState([])
// React.useEffect(() => {
//     async function fetchData() {
//         const project = await projectService.showContent(3);
//         set_project_data(project.project);
//         set_tasks(project.tasks);
//         console.log(project.tasks);
//     }
//     fetchData();
// }, []);
// const addTask = async (task) => {
//     console.log("Nueva task", task)
//     if (task.title.trim() !== "") {
//         const taskId = await taskService.createTask(task);
//         if (taskId !== -1) {
//             task.task_id = taskId;
//             set_tasks([...tasks, task]);
//             // setTaskText("");
//             // setIsModalVisible(false);
//         } else {
//             console.error("Error al agregar tarea a la base de datos");
//         }
//     }
// };

// const deleteTask = (taskId) => {
//     const updatedTasks = tasks.filter((task) => task.task_id !== taskId);
//     setTasks(updatedTasks);
//     setSelectedTasks((prevSelectedTasks) =>
//         prevSelectedTasks.filter((selectedTask) => selectedTask !== taskId)
//     );
// };

// const deleteSelectedTask = () => {
//     const updatedTasks = tasks.filter((task) => !selectedTasks.includes(task.task_id));
//     setTasks(updatedTasks);
//     setSelectedTasks([]);
// }

// const updateTask = async (updatedTask) => {
//     console.log(updatedTask)
//     const updatedTaskResult = await taskService.updateTask(updatedTask.task_id, updatedTask);
//     console.log("ID: ", updatedTaskResult)
//     if (updatedTaskResult !== -1) {
//         const updatedTasks = tasks.map((task) =>
//             task.task_id === updatedTask.task_id ? { ...task, ...updatedTask } : task
//         );
//         setTasks(updatedTasks);
//     } else {
//         console.error("Error al actualizar la tarea en la base de datos");
//     }
// };

// // Hay que cambiarlo ya que no solo se le pasa el id y el title si no que tambien se le pasa toda la info de la tarea
// const ArchiveTask = (id, text) => {
//     setArchiveTask([...archiveTask, { task_id: id, title: text }]);
//     deleteTask(id);
// }

// const archiveSelectedTask = () => {
//     const updatedTasks = tasks.filter((task) => selectedTasks.includes(task.task_id));
//     const updatedArchiveTasks = [...archiveTask, ...updatedTasks]
//     setArchiveTask(updatedArchiveTasks);
//     deleteSelectedTask()
// }

// const moveTask = (id, destiny) => {
//     const gettask = tasks.find(id);
//     const updatedTasks = tasks.filter((task) => !selectedTasks.includes(task.task_id));
//     setTasks(updatedTasks);
// }

// const toggleSelectTask = (taskId) => {
//     let aux = selectedTasks
//     let factor = aux[taskId] ? -1 : 1
//     aux[taskId] = !aux[taskId];
//     setSelectedTasks({ ...aux, total: aux.total + factor });
// };

// const toggleSelectAll = () => {
//     // if (selectedTasks.length === tasks.length) {
//     //   setSelectedTasks([]);
//     //   setSelectAll(false);
//     // } else {
//     //   const allTaskIds = tasks.map(task => task.task_id);
//     //   setSelectedTasks(allTaskIds);
//     //   setSelectAll(true);
//     // }

//     let selecteds = selectedTasks;

//     tasks.forEach(task => {
//         selecteds[task.task_id] = !selectAll;
//     });

//     setSelectedTasks({ ...selecteds, total: !selectAll ? tasks.length : 0 })
//     setSelectAll(!selectAll);
// };

// const showMovePopUp = (id) => {
//     const taskToEdit = tasks.find(task => task.task_id === id);
//     if (taskToEdit) {
//         setEditingTask([taskToEdit]);
//         setIsMoveModalOpen(true);     } else {
//         console.error(`No se encontró el proyecto con ID: ${id}`);
//     }
// }

// const hideMovePopUp = () => {
//     moveRef.hide();
// }

// const showEditPopUp = (id) => {
//     const taskToEdit = tasks.find(task => task.task_id === id);

//     if (taskToEdit) {
//       setEditingTask(taskToEdit);
//       setIsEditModalOpen(true);
//     } else {
//       console.error(`No se encontró la tarea con ID: ${id}`);
//     }
//   }

// const hideEditPopUp = () => {
//     editRef.hide();
// }

// const showAddTaskPopUp = () => {
//     addRef.show();
// }

// const hideAddTaskPopUp = () => {
//     addRef.hide();
// }