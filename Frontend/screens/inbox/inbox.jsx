import React, { useState, useRef, useEffect, useContext } from "react";
import taskService from "../../services/task/taskService";
import { View, Text, Animated, TextInput, FlatList, TouchableOpacity, Modal, TouchableWithoutFeedback } from "react-native";
import { FontAwesome5, Entypo, FontAwesome } from '@expo/vector-icons';
import { NativeBaseProvider, VStack, Box, Menu } from "native-base";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import styles from './inbox.styles'
import AuthContext from '../../services/auth/context/authContext';


function Inbox() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [archiveTask, setArchiveTask] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState({});
  const [isEditingModalVisible, setIsEditingModalVisible] = useState(false);
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

    fetchData()

  }, [])

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
      backgroundColor: isSelected ? '#5ad5d5' : '#f2f2f2'
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

  const updateTask = async () => {
    const updatedTask = await taskService.updateTask(editingTask.task_id, { title: editingTask.title });
  
    if (updatedTask !== -1) {
      const updatedTasks = tasks.map((task) =>
        task.task_id === editingTask.task_id ? { ...task, title: editingTask.title } : task
      );
      setTasks(updatedTasks);
      setIsEditingModalVisible(false);
    } else {
      console.error("Error al actualizar la tarea en la base de datos");
    }
  };

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

  const LeftSwipeActions = ({ translateX }) => {
    const width = translateX.interpolate({
      inputRange: [0, 1],
      outputRange: ['30%', '100%'],
      extrapolate: 'clamp',
    });
    const borderTopRightRadius = translateX.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 10],
      extrapolate: 'clamp',
    });
    const borderBottomRightRadius = translateX.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 10],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[styles.leftSwipe, { width }, { borderTopRightRadius }, { borderBottomRightRadius }]}
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
      </Animated.View>
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



  const SelectableTask = ({ id, title, isSelected, onPress, onDelete }) => {
    const [isSwiped, setIsSwiped] = useState(true);
    const translateX = useRef(new Animated.Value(0)).current;
    const leftActions = selectedTasks.length > 0 ? () => null : () => LeftSwipeActions({ translateX });
    const rightActions = selectedTasks.length > 0 ? () => null : () => RightSwipeActions({ onDelete, id, translateX });
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const backgroundTask = translateX.interpolate({
      inputRange: [0, 1],
      outputRange: ['#f2f2f2', 'rgba(0, 0, 0, 0)'],
      extrapolate: 'clamp',
    });

    useEffect(() => {
      const subscription = translateX.addListener(({ value }) => {
        setIsSwiped(value === 0);
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
          useNativeDriver: false,
        }).start();
      }}
      overshootLeft={false}
      overshootRight={false}
      onSwipeableLeftWillOpen={() => {
        Animated.timing(translateX, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }).start(() => {
          setTimeout(() => {
            ArchiveTask(id, title);
          }, 200);
        });
      }}
      onSwipeableLeftWillClose={() => {
        Animated.timing(translateX, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start();
      }}
      friction={2}
    >
      <TouchableWithoutFeedback
        onLongPress={() => onPress(id)}
        onPress={() => {
          if (isSelected) onPress(id);
          setIsMenuVisible(!isMenuVisible);
        }}
      >
        <Animated.View style={[getTaskItemStyle(isSelected), { backgroundColor: isSelected ? '#5ad5d5' : backgroundTask }]}>
          {isSwiped && (
            <View style={styles.innerContainer}>
              <View style={[
                { flex: 1 },
                { flexDirection: 'row' },
                { alignItems: 'center' },
              ]}>
                {!isSelected && (
                  <FontAwesome name="circle-o" size={24} color="#a0a0a0" style={{ marginRight: '15px' }} />
                )}
                {isSelected && (
                  <FontAwesome name="check-circle" size={24} color="green" style={{ marginRight: '15px' }} />
                )}
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
                  <Menu.Item style={styles.menuItem} onPress={() => (console.log(`Mover a`))}>Mover a</Menu.Item>
                  <Separator />
                  <Menu.Item style={styles.menuItem}
                    onPress={() => {
                      setEditingTask({task_id: id, title: title});
                      setIsEditingModalVisible(true);
                    }}>
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

  const Separator = () => (
    <View
      style={{
        height: 1,
        width: "100%",
        backgroundColor: "#CED0CE",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    />
  );


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
                  <Menu.Item style={styles.menuItem} onPress={() => (console.log(`Mover a`))}>Mover a</Menu.Item>
                </Menu>
              </View>
            </Box>
          </VStack>
        )}
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.task_id.toString()}
          renderItem={({ item }) => (
            <SelectableTask
              id={item.task_id}
              title={item.title}
              isSelected={selectedTasks.includes(item.task_id)}
              onPress={() => toggleSelectTask(item.task_id)}
              onDelete={deleteTask}
            />
          )}
          ItemSeparatorComponent={() => <Separator />}
        />
      </NativeBaseProvider>

      <TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
        <FontAwesome5 name="plus" size={24} color="white" />
      </TouchableOpacity>

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
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditingModalVisible}
        onRequestClose={() => setIsEditingModalVisible(false)}
      >
        <View style={styles.modalView}>
          <TextInput
            style={styles.modalInput}
            placeholder="Edit the task"
            value={editingTask.title}
            onChangeText={(text) => setEditingTask({...editingTask, title: text})}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setIsEditingModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={updateTask}>
              <Text style={styles.buttonText}>Actualizar tarea</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default Inbox;
