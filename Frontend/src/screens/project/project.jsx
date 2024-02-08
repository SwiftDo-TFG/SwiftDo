import React, { useState, useRef, useEffect, useContext } from "react";
import { View, Text, Animated } from "react-native";
import styles from "./project.styles";
import SelectableTask from "../tasks/selectableTask";
import projectService from "../../services/project/projectService";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TaskList from "../tasks/TaskList";
import { NativeBaseProvider } from "native-base";


function Project() {
    const [selectedTasks, setSelectedTasks] = useState({});
    const [archiveTask, setArchiveTask] = useState([]);
    const [editingTask, setEditingTask] = useState({});
    const [selectAll, setSelectAll] = useState(false);
    let moveRef = React.createRef();
    let editRef = React.createRef();
    let addRef = React.createRef();
    const scrollY = useRef(new Animated.Value(0)).current;
    const ITEM_SIZE = 62; //Tamaño tarea + margin
    const [project_data, set_project_data] = React.useState({ title: "Proyecto 1", project_id: 1 },)
    const [tasks, set_tasks] = React.useState([])
    React.useEffect(() => {
        async function fetchData() {
            const project = await projectService.showContent(1);
            set_project_data(project.project);
            set_tasks(project.tasks);
            console.log(project.tasks);
        }
        fetchData();
    }, []);
    const addTask = async (task) => {
        console.log("Nueva task", task)
        if (task.title.trim() !== "") {
            const taskId = await taskService.createTask(task);
            if (taskId !== -1) {
                task.task_id = taskId;
                setTasks([...tasks, task]);
                // setTaskText("");
                // setIsModalVisible(false);
            } else {
                console.error("Error al agregar tarea a la base de datos");
            }
        }
    };

    const deleteTask = (taskId) => {
        const updatedTasks = tasks.filter((task) => task.task_id !== taskId);
        setTasks(updatedTasks);
        setSelectedTasks((prevSelectedTasks) =>
            prevSelectedTasks.filter((selectedTask) => selectedTask !== taskId)
        );
    };

    const deleteSelectedTask = () => {
        const updatedTasks = tasks.filter((task) => !selectedTasks.includes(task.task_id));
        setTasks(updatedTasks);
        setSelectedTasks([]);
    }

    const updateTask = async (updatedTask) => {
        console.log(updatedTask)
        const updatedTaskResult = await taskService.updateTask(updatedTask.task_id, updatedTask);
        console.log("ID: ", updatedTaskResult)
        if (updatedTaskResult !== -1) {
            const updatedTasks = tasks.map((task) =>
                task.task_id === updatedTask.task_id ? { ...task, ...updatedTask } : task
            );
            setTasks(updatedTasks);
        } else {
            console.error("Error al actualizar la tarea en la base de datos");
        }
    };

    // Hay que cambiarlo ya que no solo se le pasa el id y el title si no que tambien se le pasa toda la info de la tarea
    const ArchiveTask = (id, text) => {
        setArchiveTask([...archiveTask, { task_id: id, title: text }]);
        deleteTask(id);
    }

    const archiveSelectedTask = () => {
        const updatedTasks = tasks.filter((task) => selectedTasks.includes(task.task_id));
        const updatedArchiveTasks = [...archiveTask, ...updatedTasks]
        setArchiveTask(updatedArchiveTasks);
        deleteSelectedTask()
    }

    const moveTask = (id, destiny) => {
        const gettask = tasks.find(id);
        const updatedTasks = tasks.filter((task) => !selectedTasks.includes(task.task_id));
        setTasks(updatedTasks);
    }

    const toggleSelectTask = (taskId) => {
        let aux = selectedTasks
        let factor = aux[taskId] ? -1 : 1
        aux[taskId] = !aux[taskId];
        setSelectedTasks({ ...aux, total: aux.total + factor });
    };

    const toggleSelectAll = () => {
        // if (selectedTasks.length === tasks.length) {
        //   setSelectedTasks([]);
        //   setSelectAll(false);
        // } else {
        //   const allTaskIds = tasks.map(task => task.task_id);
        //   setSelectedTasks(allTaskIds);
        //   setSelectAll(true);
        // }

        let selecteds = selectedTasks;

        tasks.forEach(task => {
            selecteds[task.task_id] = !selectAll;
        });

        setSelectedTasks({ ...selecteds, total: !selectAll ? tasks.length : 0 })
        setSelectAll(!selectAll);
    };

    const showMovePopUp = (id) => {
        const taskToEdit = tasks.find(task => task.task_id === id);
        if (taskToEdit) {
            setEditingTask([taskToEdit]);
            moveRef.show(taskToEdit);
        } else {
            console.error(`No se encontró la tarea con ID: ${id}`);
        }
    }

    const hideMovePopUp = () => {
        moveRef.hide();
    }

    const showEditPopUp = (id) => {
        const taskToEdit = tasks.find(task => task.task_id === id);
        if (taskToEdit) {
            setEditingTask([taskToEdit]);
            editRef.show(taskToEdit);
        } else {
            console.error(`No se encontró la tarea con ID: ${id}`);
        }
    }

    const hideEditPopUp = () => {
        editRef.hide();
    }

    const showAddTaskPopUp = () => {
        addRef.show();
    }

    const hideAddTaskPopUp = () => {
        addRef.hide();
    }

    return ( //html aqui
        //div
        <View style={styles.project}>
            <Text style={styles.header}>
                <MaterialCommunityIcons style={styles.icon} name="hexagon-slice-6" size={26} color= {project_data.color}  />
                <Text style={styles.title}> {project_data.title} </Text>
            </Text>
            <NativeBaseProvider>
                <View style={styles.header}>
                    {<TaskList tasks={tasks} showEditPopUp={showEditPopUp} showMovePopUp={showMovePopUp} />}
                </View>
                {/* MOVE MODAL   */}
            <PopUpModal
                title="Mover a"
                ref={(target) => moveRef = target}
                touch={hideMovePopUp}
                data={editingTask}
                onAccept={updateTask}
                mode='move'
            />

            {/* EDIT MODAL   */}
            <PopUpModal
                title="Editar"
                ref={(target) => editRef = target}
                touch={hideEditPopUp}
                data={editingTask}
                onAccept={updateTask}
                mode='edit'
            />

            {/* ADD MODAL   */}
            <PopUpModal
                title="Añadir"
                ref={(target) => addRef = target}
                touch={hideAddTaskPopUp}
                data={[{ title: "" }]}
                onAccept={addTask}
                mode='add'
            />
            </NativeBaseProvider>
        </View>

    )
}
export default Project;