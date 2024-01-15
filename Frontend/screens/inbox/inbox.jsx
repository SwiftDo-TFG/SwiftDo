import React, { useState, useRef, useEffect, useContext } from "react";
import taskService from "../../services/task/taskService";
import { View, Text, Animated, TextInput, FlatList, TouchableOpacity, Modal, TouchableWithoutFeedback } from "react-native";
import { FontAwesome5, Entypo, FontAwesome } from '@expo/vector-icons';
import { NativeBaseProvider, VStack, Box, Menu, extendTheme, Checkbox } from "native-base";
import Swipeable from 'react-native-gesture-handler/Swipeable';

import styles from './inbox.styles'
import { PopUpModal } from "../../components/PopUpModal";
import AuthContext from '../../services/auth/context/authContext';
import SelectableTask from "./selectableTask";


function Inbox() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");
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
      tasksDB.forEach(task=>{
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
    const updatedTaskResult = await taskService.updateTask(updatedTask.task_id, updatedTask);
  
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
    setSelectedTasks({...aux, total: aux.total + factor});
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

    setSelectedTasks({...selecteds, total: !selectAll ? tasks.length : 0})
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
      editRef.show();
    } else {
      console.error(`No se encontró la tarea con ID: ${id}`);
    }
  }

  const hideEditPopUp = () => {
    editRef.hide();
  }

  const showAddPopUp = () => {
    addRef.show();
  }

  const hideAddPopUp = () => {
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
        {selectedTasks.total > 0 && (
          <VStack>
            <Box style={[styles.innerContainer, { marginBottom: 5 }]}>
              <Text>Seleccionado: ({selectedTasks.total})</Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => archiveSelectedTask()}>
                  <Entypo name="archive" size={20} color="#15ba53" style={{ marginRight: 15 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteSelectedTask()}>
                  <FontAwesome5 name="trash" size={20} color="red" style={[styles.trashIcon, { marginRight: 15 }]} />
                </TouchableOpacity>
                <Menu
                  trigger={(triggerProps) => (
                    <TouchableOpacity {...triggerProps}>
                      <Entypo name="dots-three-vertical" size={20} color="#a0a0a0" />
                    </TouchableOpacity>
                  )}
                  style={styles.menuContainer}
                  placement="left"
                >
                  <Menu.Item style={styles.menuItem} onPress={showMovePopUp}>Mover a</Menu.Item>
                </Menu>
              </View>
            </Box>
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
              <Text>{selectAll ? 'Deseleccionar todo' : 'Seleccionar todo'}</Text>
              {tasks.length > 0 && (
                <Checkbox
                  value={selectAll}
                  onChange={toggleSelectAll}
                  borderColor={"#f39f18"}
                  _checked={{ borderColor: "#f39f18", bgColor: "#f39f18" }}
                  style={{ marginLeft: 10 }}
                />
              )}
            </View>
          </VStack>
        )}
        <Animated.FlatList
          data={tasks}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          keyExtractor={(item) => item.task_id.toString()}
          renderItem={({ item, index }) => {
            const inputRange = [-1, 0, ITEM_SIZE * index, ITEM_SIZE * (index + 2)]
            const scale = scrollY.interpolate({
              inputRange,
              outputRange: [1, 1, 1, 0],
              extrapolate: 'clamp',
            })

            const opacityinputRange = [-1, 0, ITEM_SIZE * index, ITEM_SIZE * (index + .5)]
            const opacity = scrollY.interpolate({
              inputRange: opacityinputRange,
              outputRange: [1, 1, 1, 0],
              extrapolate: 'clamp',
            })

            return (<SelectableTask
              task={item}
              onPress={() => toggleSelectTask(item.task_id)}
              onDelete={deleteTask}
              scale={scale}
              opacity={opacity}
              selectedTasks={selectedTasks}
              showMovePopUp={showMovePopUp}
              showEditPopUp={showEditPopUp}
            />)
          }}
        // ItemSeparatorComponent={() => <Separator />}
        />

        <TouchableOpacity style={styles.addButton} onPress={showAddPopUp}>
          <FontAwesome5 name="plus" size={24} color="white" />
        </TouchableOpacity>

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
          touch={hideAddPopUp}
          data={[{title: ""}]}
          onAccept={addTask}
          mode='add'
        />
      </NativeBaseProvider>
    </View>
  );
}

export default Inbox;
