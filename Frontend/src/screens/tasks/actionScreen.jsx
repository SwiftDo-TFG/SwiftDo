import React, { useState, useEffect, useContext } from "react";
import taskService from "../../services/task/taskService";
import projectService from "../../services/project/projectService"
import { View, Text, Animated, TextInput, FlatList, TouchableOpacity, Modal, TouchableWithoutFeedback, SafeAreaView } from "react-native";
import { FontAwesome5, Entypo, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeBaseProvider, VStack, Box, Menu, extendTheme, Checkbox, Icon } from "native-base";
import TaskList from "./TaskList";
import AddButton from "../../components/common/addButton";

import styles from './actionScreen.styles'
import { PopUpModal } from "../../components/PopUpModal";
import PopUpModal2 from "../../components/PopUpModalAux";
import PopUpModalPadre from "../../components/modals/PopUpModalPadre";
import MoveTaskModal from "../../components/modals/MoveTaskModal";
import CreateTaskModal from "../../components/modals/CreateTaskModal";
import CreateProjectModal from "../../components/modals/CreateProjectModal";
import AuthContext from '../../services/auth/context/authContext';
import LoadingIndicator from "../../components/LoadingIndicator";
import { actStyle } from "../../styles/globalStyles";


function ActionScreen(props) {
  const [tasks, setTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState({});
  const [archiveTask, setArchiveTask] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState({});
  const [isDataLoaded, setDataLoaded] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const authState = useContext(AuthContext);

  useEffect(() => {
    async function fetchData() {
      const tasksDB = await taskService.getTasks({ state: props.state });
      if (tasksDB.error) {
        return authState.signOut();
      }

      console.log("Estas son las tareas que se devuelven", tasksDB)

      const seletedAux = {}
      tasksDB.forEach(task => {
        seletedAux[task.task_id] = false;
      })

      seletedAux.total = 0;

      setTasks(tasksDB)
      setSelectedTasks(seletedAux)
    }

    const unsubscribe = props.navigation.addListener('focus', () => {
      if (!isDataLoaded) {
        fetchData()
        setDataLoaded(true)
      }
    });

    return unsubscribe;
  }, [authState, props.navigation]);

  const addTask = async (task) => {
    console.log("Nueva task", task)
    if (task.title.trim() !== "") {
      const newTask = await taskService.createTask(task);
      
      if (newTask.task_id !== -1) {
        task.task_id = newTask.task_id;
        
        setTasks([...tasks, task]);
        setIsCreateModalOpen(false);
      } else {
        console.error("Error al agregar tarea a la base de datos");
      }
    }
  };

  const addProject = async (project) => {
    console.log("Nuevo proyecto", project)
    if (project.title.trim() !== "") {
      const newProject = await projectService.createProject(project);
      console.log(newProject);
      if (newProject.project_id !== -1) {
       
        setIsCreateProjectOpen(false);
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

  const handleUpdateTasks = async (updatedTask) => {

    if (selectedTasks.total > 0) {
      await updateTaskList(updatedTask.state);
    } else {
      await updateTask(updatedTask);
    }
  }

  const updateTask = async (updatedTask) => {
    console.log(updatedTask)
    const updatedTaskResult = await taskService.updateTask(updatedTask.task_id, updatedTask);
    console.log("ID: ", updatedTaskResult)
    if (updatedTaskResult !== -1) {
      const updatedTasks = tasks.map((task) =>
        task.task_id === updatedTask.task_id ? { ...task, ...updatedTask } : task
      );
      isEditModalOpen ? setIsEditModalOpen(false) : setIsMoveModalOpen(false);
      setTasks(updatedTasks);
    } else {
      console.error("Error al actualizar la tarea en la base de datos");
    }
  };

  const updateTaskList = async (state) => {

    const list_ids = Object.keys(selectedTasks).filter(key => selectedTasks[key] === true);

    const total = await taskService.moveTaskList(list_ids, state);

    setIsMoveModalOpen(false);
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

  const showMovePopUp = (id) => {
    const taskToEdit = tasks.find(task => task.task_id === id);

    if (taskToEdit) {
      setEditingTask(taskToEdit);
      setIsMoveModalOpen(true);
    } else {
      console.error(`No se encontró la tarea con ID: ${id}`);
    }
  }

  const showEditPopUp = (id) => {
    const taskToEdit = tasks.find(task => task.task_id === id);

    if (taskToEdit) {
      setEditingTask(taskToEdit);
      setIsEditModalOpen(true);
    } else {
      console.error(`No se encontró la tarea con ID: ${id}`);
    }
  }

  const showAddTaskPopUp = () => {
    setIsCreateModalOpen(true);
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => props.navigation.toggleDrawer()}>
          {props.children}
        </TouchableOpacity>
        {!isDataLoaded && <LoadingIndicator />}
        <NativeBaseProvider>

          <TaskList
            tasks={tasks}
            showEditPopUp={showEditPopUp}
            showMovePopUp={showMovePopUp}
            selectedTasks={selectedTasks}
            setSelectedTasks={setSelectedTasks}
            setIsMoveModalOpen={setIsMoveModalOpen}
          />

          {/* <TouchableOpacity style={styles.addButton} onPress={}>
            <FontAwesome5 name="plus" size={24} color="white" />
          </TouchableOpacity> */}
          <AddButton onPress={() => showAddTaskPopUp()} onLongPress={() => setIsModalVisible(true)} />

          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType={"fade"}
          >
            <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
              <View style={styles.modalContainer}>
                <View style={styles.modalStyle}>
                  <TouchableOpacity onPress={() => {
                    setIsModalVisible(false)
                    showAddTaskPopUp()
                  }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                      <MaterialCommunityIcons style={{ marginRight: 10 }} name="circle-slice-8" size={26} color="#2C3E50" />
                      <Text style={{ fontSize: 17, fontWeight: 'bold', color: "#2C3E50" }}>
                        Tarea
                      </Text>
                    </View>
                    <View style={{ marginBottom: 20, marginLeft: 6 }}>
                      <Text style={{ color: "#2C3E50" }}>Organiza y estructura las acciones y actividades que tienes previsto llevar a cabo.</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                    setIsModalVisible(false);
                    setIsCreateProjectOpen(true);
                  }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                      <MaterialCommunityIcons style={{ marginRight: 10 }} name="hexagon-slice-6" size={26} color="#2C3E50" />
                      <Text style={{ fontSize: 17, fontWeight: 'bold', color: "#2C3E50" }}>
                        Proyecto
                      </Text>
                    </View>
                    <View style={{ marginLeft: 6 }}>
                      <Text style={{ color: "#2C3E50" }}>Planifica tus actividades para progresar de manera metódica y alcanza cada objetivo en tu proyecto GTD.</Text>
                    </View>
                  </TouchableOpacity>

                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          {/* MOVE MODAL   */}
          <MoveTaskModal
            title="Move"
            // touch={hideEditPopUp}
            editingTask={editingTask}
            onAccept={handleUpdateTasks}
            isModalOpen={isMoveModalOpen}
            setIsModalOpen={setIsMoveModalOpen}
          />

          {/* EDIT MODAL   */}
          <CreateTaskModal
            title="Editar"
            // touch={hideEditPopUp}
            editingTask={editingTask}
            onAccept={updateTask}
            isModalOpen={isEditModalOpen}
            setIsModalOpen={setIsEditModalOpen}
          />

          {/* ADD TASK MODAL   */}
          <CreateTaskModal
            title="Añadir"
            // touch={hideEditPopUp}
            // editingTask={editingTask}
            onAccept={addTask}
            isModalOpen={isCreateModalOpen}
            setIsModalOpen={setIsCreateModalOpen}
          />
          {/* ADD PROJECT MODAL   */}
          <CreateProjectModal
            title="Añadir"
            // touch={hideEditPopUp}
            // editingTask={editingTask}
            onAccept={addProject}
            isModalOpen={isCreateProjectOpen}
            setIsModalOpen={setIsCreateProjectOpen}
          />
        </NativeBaseProvider>

      </View>
    </SafeAreaView>

  );
}

export default ActionScreen;
