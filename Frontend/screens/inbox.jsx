import React, { useState, useEffect } from "react";
import taskService from "../services/task/taskService";
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Modal } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';

function Inbox() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(()=>{
    async function fetchData() {
      const tasks = await taskService.getTasks();
      console.log("Estas son las tareas que se devuelven", tasks)
      
      return tasks;
    }

    fetchData()

  }, [])

  const addTask = () => {
    if (taskText.trim() !== "") {
      setTasks([...tasks, { id: tasks.length.toString(), text: taskText }]);
      setTaskText("");
      setIsModalVisible(false);
    }
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  const toggleSelectTask = (taskId) => {
    setSelectedTask(selectedTask === taskId ? null : taskId);
  };

  const getTaskItemStyle = (taskId) => {
    return {
      ...styles.taskItem,
      backgroundColor: selectedTask === taskId ? "#72d5e9" : "white",
    };
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={getTaskItemStyle(item.id)}
            onPress={() => toggleSelectTask(item.id)}
          >
            <Text>{item.text}</Text>
            {selectedTask === item.id && (
              <TouchableOpacity onPress={() => deleteTask(item.id)}>
                <FontAwesome5 name="trash" size={20} color="red" style={styles.trashIcon} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        )}
      />

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  taskItem: {
    flexDirection: 'row',
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trashIcon: {
    marginLeft: 'auto',
    marginRight: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'orange',
    borderRadius: 50,
    padding: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  modalInput: {
    padding: 5,
    borderWidth: 1,
    borderRadius: 5,
    margin: 10,
    backgroundColor: null,
    width: '80%',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  button: {
    flex: 1,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  cancelButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default Inbox;