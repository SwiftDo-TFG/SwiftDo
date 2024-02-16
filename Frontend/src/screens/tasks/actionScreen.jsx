import React, { useState, useEffect, useContext } from "react";
import taskService from "../../services/task/taskService";
import projectService from "../../services/project/projectService"
import { View, Text, Animated, TextInput, FlatList, TouchableOpacity, Modal, TouchableWithoutFeedback, SafeAreaView, Dimensions } from "react-native";
import { FontAwesome5, Entypo, FontAwesome, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { NativeBaseProvider, VStack, Box, Menu, extendTheme, Checkbox, Icon } from "native-base";
import TaskList from "./TaskList";
import AddButton from "../../components/common/addButton";
import MoveTaskModal from "../../components/modals/MoveTaskModal";
import CreateTaskModal from "../../components/modals/CreateTaskModal";
import CreateProjectModal from "../../components/modals/CreateProjectModal";
import AuthContext from '../../services/auth/context/authContext';
import LoadingIndicator from "../../components/LoadingIndicator";
import AddTypeModal from "../../components/modals/AddTypeModal";
import CompleteTaskModal from "../../components/modals/CompleteTaskModal";
import AssignToProjectModal from "../../components/modals/AsingToProjectModal";
import styles from "./actionScreen.styles";


function ActionScreen(props) {
  const [tasks, setTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState({});
  const [editingTask, setEditingTask] = useState({});
  const [isDataLoaded, setDataLoaded] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  //Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); //Modal select create task/project
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isAssingProjectModalOpen, setIsAssingProjectModalOpen] = useState(false);

  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const authState = useContext(AuthContext);

  useEffect(() => {

    const unsubscribe = props.navigation.addListener('focus', () => {
      if (!isDataLoaded) {
        fetchData()
        setDataLoaded(true)
      }
    });

    return unsubscribe;
  }, [authState, props.navigation]);

  async function fetchData() {
    console.log("LLEGA AL FETCH")
    let filter = { state: props.state, completed: false }
    if (props.state === 5) {
      filter = { project_id: props.project_id, completed: false }
    }
    const tasksDB = await taskService.getTasks(filter);
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

  const reloadData = () => {
    setDataLoaded(false)
    fetchData()
    setDataLoaded(true)
  }

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
      reloadData();
    } else {
      console.error("Error al actualizar la tarea en la base de datos");
    }
  };

  const updateTaskList = async (state) => {

    const list_ids = Object.keys(selectedTasks).filter(key => selectedTasks[key] === true);

    const total = await taskService.moveTaskList(list_ids, state);

    setIsMoveModalOpen(false);
    reloadData();
  };

  const handleCompleteTasks = async () => {

    if (selectedTasks.total > 0) {
      await completeTaskList();
    } else {
      await completeTask();
    }
  }

  const completeTask = async () => {
    const updatedTask = { ...editingTask };
    const updatedTaskResult = await taskService.updateTask(updatedTask.task_id, { completed: true });

    if (updatedTaskResult !== -1) {
      const updatedTasks = tasks.map((task) =>
        task.task_id === updatedTask.task_id ? { ...task, ...updatedTask } : task
      );
      setIsCompleteModalOpen(false);
      setTasks(updatedTasks);
      reloadData();
    } else {
      console.error("Error al actualizar la tarea en la base de datos");
    }
  };

  const completeTaskList = async () => {

    const list_ids = Object.keys(selectedTasks).filter(key => selectedTasks[key] === true);

    const total = await taskService.completeTaskList(list_ids, true);

    setIsCompleteModalOpen(false);
    reloadData();
  };

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


  const showCompleteModal = (id) => {
    const taskToEdit = tasks.find(task => task.task_id === id);

    if (taskToEdit) {
      setEditingTask(taskToEdit);
      setIsCompleteModalOpen(true);
    } else {
      console.error(`No se encontró la tarea con ID: ${id}`);
    }
  }

  const showAddTaskPopUp = () => {
    setIsCreateModalOpen(true);
  }

  const EmptyTaskListPanel = ({ icon }) => {
    return (
      <View style={styles.emptyListPanel}>
        <View style={styles.roundedPanel}>
          {icon}
          <Text style={styles.emptyListPanelText}>Parece que todavía no hay tareas</Text>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 25 }}>
          {Dimensions.get('window').width <= 768 && (<TouchableOpacity onPress={() => props.navigation.toggleDrawer()}>
            <Feather name="sidebar" size={28} color="black" />
          </TouchableOpacity>)}
          <View style={{ minWidth: 50, alignItems: 'flex-end' }}>
            <TouchableOpacity style={styles.area}>
              <Text>Area</Text>
            </TouchableOpacity>
          </View>
        </View>

        {props.children}
        {!isDataLoaded && <LoadingIndicator />}
        <NativeBaseProvider>
          {isDataLoaded && tasks.length === 0 ? <EmptyTaskListPanel icon={props.emptyIcon} /> :
            <TaskList
              tasks={tasks}
              showEditPopUp={showEditPopUp}
              showMovePopUp={showMovePopUp}
              showCompleteModal={showCompleteModal}
              selectedTasks={selectedTasks}
              setSelectedTasks={setSelectedTasks}
              setIsMoveModalOpen={setIsMoveModalOpen}
              setIsCompleteModalOpen={setIsCompleteModalOpen}
            />
          }

          <AddButton onPress={() => showAddTaskPopUp()} onLongPress={() => setIsModalVisible(true)} />

          {/* CREATE BUTTON MODAL SELECT TASK/PROJECT */}
          <AddTypeModal
            isModalVisible={isModalVisible}
            setIsModalVisible={setIsModalVisible}
            showAddTaskPopUp={showAddTaskPopUp}
            setIsCreateProjectOpen={setIsCreateProjectOpen}
          />

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

          <CompleteTaskModal
            title="Test"
            // touch={hideEditPopUp}
            // editingTask={editingTask}
            onAccept={handleCompleteTasks}
            isModalOpen={isCompleteModalOpen}
            setIsModalOpen={setIsCompleteModalOpen}
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

          <AssignToProjectModal
            title="Añadir"
            // touch={hideEditPopUp}
            // editingTask={editingTask}
            // onAccept={addProject}
            isModalOpen={isAssingProjectModalOpen}
            setIsModalOpen={setIsCreateProjectOpen}
          />
        </NativeBaseProvider>

      </View>
    </SafeAreaView>

  );
}

export default ActionScreen;
