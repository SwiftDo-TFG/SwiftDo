import React, { useState, useRef, useEffect, useContext } from "react";
import taskService from "../../services/task/taskService";
import { View, Text, Animated, TextInput, FlatList, TouchableOpacity, Modal, TouchableWithoutFeedback } from "react-native";
import { FontAwesome5, Entypo, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeBaseProvider, VStack, Box, Menu, extendTheme, Checkbox, Icon } from "native-base";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import TaskList from "./TaskList";


import styles from './inbox.styles'
import { PopUpModal } from "../../components/PopUpModal";
import AuthContext from '../../services/auth/context/authContext';
import SelectableTask from "./selectableTask";


function Inbox() {
  const [tasks, setTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState({});
  const [archiveTask, setArchiveTask] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState({});
  const [isDataLoaded, setDataLoaded] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  let moveRef = React.createRef();
  let editRef = React.createRef();
  let addRef = React.createRef();
  const authState = useContext(AuthContext);


  useEffect(() => {
    async function fetchData() {
      const tasksDB = await taskService.getTasks();
      if (tasksDB.error) {
        return authState.signOut();
      }

      console.log("Estas son las tareas que se devuelven", tasksDB)
      // const actualtask = tasks.concat(tasksDB)
      const seletedAux = {}
      tasksDB.forEach(task => {
        seletedAux[task.task_id] = false;
      })

      seletedAux.total = 0;

      setTasks(tasksDB)
      setSelectedTasks(seletedAux)
    }

    if (!isDataLoaded) {
      fetchData()
      setDataLoaded(true)
    }

  }, [authState]);

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

  const showMovePopUp = () => {
    moveRef.show();
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

  const popuplist = [
    {
      id: 1,
      title: 'Archivados'
    },
    {
      id: 2,
      title: 'Hoy'
    },
    {
      id: 3,
      title: 'Cuanto antes'
    },
    {
      id: 4,
      title: 'Programadas'
    },
    {
      id: 5,
      title: 'Algun día'
    },
    {
      id: 6,
      title: 'Proyecto'
    },

  ]

  const scrollY = useRef(new Animated.Value(0)).current;
  const ITEM_SIZE = 62; //Tamaño tarea + margin

  return (
    <View style={styles.container}>
      <NativeBaseProvider>
        
        <TaskList tasks={tasks} showEditPopUp={showEditPopUp} showMovePopUp={showMovePopUp}/>

        <TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
          <FontAwesome5 name="plus" size={24} color="white" />
        </TouchableOpacity>

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
                  setIsModalVisible(false)
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
        <PopUpModal
          title="Mover a"
          ref={(target) => moveRef = target}
          touch={hideMovePopUp}
          data={popuplist}
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
  );
}

export default Inbox;
