import React, { useState, useRef, useEffect, useContext } from "react";
import taskService from "../../services/task/taskService";
import { View, Text, Animated, TextInput, FlatList, TouchableOpacity, Modal, TouchableWithoutFeedback } from "react-native";
import { FontAwesome5, Entypo, FontAwesome } from '@expo/vector-icons';
import { NativeBaseProvider, VStack, Box, Menu, extendTheme, Checkbox } from "native-base";
import Swipeable from 'react-native-gesture-handler/Swipeable';

import styles from './inbox.styles'
import { PopUpModal } from "../../components/PopUpModal";
import AuthContext from '../../services/auth/context/authContext';


function Inbox() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [archiveTask, setArchiveTask] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState({});
  const [isDataLoaded, setDataLoaded] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  let moveRef = React.createRef();
  let editRef = React.createRef();
  const authState = useContext(AuthContext);


  useEffect(() => {
    async function fetchData() {
      const tasksDB = await taskService.getTasks();
      if (tasksDB.error) {
        return authState.signOut();
      }

      console.log("Estas son las tareas que se devuelven", tasksDB)
      const actualtask = tasks.concat(tasksDB)
      setTasks(actualtask)
    }

    if (!isDataLoaded) {
      fetchData()
      setDataLoaded(true)
    }

  }, [authState]);

  const addTask = async () => {
    if (taskText.trim() !== "") {
      const taskData = { title: taskText };
      const taskId = await taskService.createTask(taskData);
      if (taskId !== -1) {
        setTasks([...tasks, { task_id: taskId, title: taskText }]);
        setTaskText("");
        setIsModalVisible(false);
      } else {
        console.error("Error al agregar tarea a la base de datos");
      }
    }
  };


  const getTaskItemStyle = (isSelected) => {
    return {
      ...styles.taskContainer,
    };
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
    setSelectedTasks((prevSelectedTasks) => {
      if (prevSelectedTasks.includes(taskId)) {
        return prevSelectedTasks.filter((selectedTask) => selectedTask !== taskId);
      } else {
        return [...prevSelectedTasks, taskId];
      }
    }
    );
  };

  const toggleSelectAll = () => {
    if (selectedTasks.length === tasks.length) {
      setSelectedTasks([]);
      setSelectAll(false);
    } else {
      const allTaskIds = tasks.map(task => task.task_id);
      setSelectedTasks(allTaskIds);
      setSelectAll(true);
    }
  };

  const LeftSwipeActions = () => {
    // const width = translateX.interpolate({
    //   inputRange: [0, 1],
    //   outputRange: ['30%', '100%'],
    //   extrapolate: 'clamp',
    // });
    // const borderTopRightRadius = translateX.interpolate({
    //   inputRange: [0, 1],
    //   outputRange: [0, 10],
    //   extrapolate: 'clamp',
    // });
    // const borderBottomRightRadius = translateX.interpolate({
    //   inputRange: [0, 1],
    //   outputRange: [0, 10],
    //   extrapolate: 'clamp',
    // });

    return (
      // <Animated.View
      <TouchableOpacity
        // style={[styles.leftSwipe, { borderTopRightRadius }, { borderBottomRightRadius }]}
        style={[styles.leftSwipe]}
        onPress={showMovePopUp}
      >
        <Text
          style={{
            paddingHorizontal: '5%',
            paddingVertical: '10%',
          }}
        // style={{
        //   paddingHorizontal: 10,
        //   fontWeight: "600",
        //   paddingHorizontal: 30,
        //   paddingVertical: 20,
        // }}
        >
          <Entypo name="archive" size={20} color="white" />
        </Text>
      </TouchableOpacity>
    );
  };

  const RightSwipeActions = ({ onDelete, id, translateX }) => {
    return (
      <TouchableOpacity
        style={[styles.rightSwipe, { transform: [{ translateX: translateX }], }]}
        onPress={() => onDelete(id)}
      >
        <Text
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: '5%',
            paddingVertical: '10%',
          }}
        >
          <FontAwesome5
            name="trash"
            size={20}
            color="white"
          />
        </Text>
      </TouchableOpacity>
    );
  };



  const SelectableTask = ({ id, title, isSelected, onPress, onDelete, scale, opacity }) => {
    const [isSwiped, setIsSwiped] = useState(true);
    const translateX = useRef(new Animated.Value(0)).current;
    const leftActions = selectedTasks.length > 0 ? () => null : () => LeftSwipeActions();
    const rightActions = selectedTasks.length > 0 ? () => null : () => RightSwipeActions({ onDelete, id, translateX });
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    // const backgroundTask = translateX.interpolate({
    //   inputRange: [0, 1],
    //   outputRange: ['#f2f2f2', 'rgba(0, 0, 0, 0)'],
    //   extrapolate: 'clamp',
    // });

    useEffect(() => {
      const subscription = translateX.addListener(({ value }) => {
        // setIsSwiped(value === 0);
      });

      return () => {
        translateX.removeListener(subscription);
      };
    }, [translateX]);

    return (<Swipeable
      renderLeftActions={leftActions}
      renderRightActions={rightActions}
      onSwipeableClose={() => {
        Animated.timing(translateX, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }}
      overshootLeft={false}
      overshootRight={false}
      onSwipeableLeftWillOpen={() => {
        Animated.timing(translateX, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setTimeout(() => {
            //ArchiveTask(id, title);
          }, 200);
        });
      }}
      onSwipeableLeftWillClose={() => {
        Animated.timing(translateX, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }}
      friction={2}
    >
      <TouchableWithoutFeedback
        // onLongPress={() => onPress(id)}
        onPress={() => {
          // if (isSelected) onPress(id);
          setIsMenuVisible(!isMenuVisible);
        }}
      >
        <Animated.View style={[getTaskItemStyle(isSelected), { backgroundColor: isSelected ? '#ebd7b5' : '#f2f2f2', transform: [{ scale }], opacity }]}>
          {isSwiped && (
            <View style={styles.innerContainer}>
              <View style={[
                { flex: 1 },
                { flexDirection: 'row' },
                { alignItems: 'center' },
              ]}>
                <TouchableOpacity onPress={() => onPress(id)} style={{ marginRight: '5%' }}>
                  {!isSelected && (
                    <FontAwesome name="circle-o" size={24} color="#a0a0a0" />
                  )}
                  {isSelected && (
                    <FontAwesome name="check-circle" size={24} color="#f39f18" />
                  )}
                </TouchableOpacity>
                <Text>{title}</Text>
              </View>
              {!isSelected && isMenuVisible && (
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
                  {/* <Separator /> */}
                  <Menu.Item style={styles.menuItem}
                    onPress={() => { showEditPopUp(id) }}>
                    Editar
                  </Menu.Item>
                </Menu>
              )}
            </View>
          )}
        </Animated.View >
      </TouchableWithoutFeedback>
    </Swipeable>)
  };

  // const Separator = () => (
  //   <View
  //     style={{
  //       height: 1,
  //       width: "100%",
  //       backgroundColor: "#CED0CE",
  //       marginLeft: "auto",
  //       marginRight: "auto",
  //     }}
  //   />
  // );

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
        {selectedTasks.length > 0 && (
          <VStack>
            <Box style={[styles.innerContainer, { marginBottom: 5 }]}>
              <Text>Seleccionado: ({selectedTasks.length})</Text>
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
              id={item.task_id}
              title={item.title}
              isSelected={selectedTasks.includes(item.task_id)}
              onPress={() => toggleSelectTask(item.task_id)}
              onDelete={deleteTask}
              scale={scale}
              opacity={opacity}
            />)
          }}
        // ItemSeparatorComponent={() => <Separator />}
        />

        <TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
          <FontAwesome5 name="plus" size={24} color="white" />
        </TouchableOpacity>

        <PopUpModal
          title="Mover a"
          ref={(target) => moveRef = target}
          touch={hideMovePopUp}
          data={popuplist}
          mode='move'
        >

        </PopUpModal>
        <PopUpModal
          title="Editar"
          ref={(target) => editRef = target}
          touch={hideEditPopUp}
          data={editingTask}
          onAccept={updateTask}
          mode='edit'
        >

        </PopUpModal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalView}>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter a new task"
              value={taskText}
              onChangeText={(text) => setTaskText(text)}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={addTask}>
                <Text style={styles.buttonText}>Add Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </NativeBaseProvider>
    </View>
  );
}

export default Inbox;
