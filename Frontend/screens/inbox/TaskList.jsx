import React, { useState, useRef, useEffect, useContext } from "react";
import taskService from "../../services/task/taskService";
import { View, Text, Animated, TextInput, FlatList, TouchableOpacity, Modal, TouchableWithoutFeedback } from "react-native";
import { FontAwesome5, Entypo, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeBaseProvider, VStack, Box, Menu, extendTheme, Checkbox, Icon } from "native-base";
import Swipeable from 'react-native-gesture-handler/Swipeable';

import styles from './inbox.styles'
import { PopUpModal } from "../../components/PopUpModal";
import AuthContext from '../../services/auth/context/authContext';
import SelectableTask from "./selectableTask";


function TaskList(props) {
    const [selectedTasks, setSelectedTasks] = useState({});
    const [archiveTask, setArchiveTask] = useState([]);
    const [selectAll, setSelectAll] = useState(false);


    const scrollY = useRef(new Animated.Value(0)).current;
    const ITEM_SIZE = 62; //Tamaño tarea + margin

    useEffect(() => {
        const seletedAux = {}

        props.tasks.forEach(task => {
            seletedAux[task.task_id] = false;
        })

        seletedAux.total = 0;

        setSelectedTasks(seletedAux)

    }, []);


    const archiveSelectedTask = () => {
        const updatedTasks = tasks.filter((task) => selectedTasks.includes(task.task_id));
        const updatedArchiveTasks = [...archiveTask, ...updatedTasks]
        setArchiveTask(updatedArchiveTasks);
        deleteSelectedTask()
    }

    const deleteSelectedTask = () => {
        const updatedTasks = tasks.filter((task) => !selectedTasks.includes(task.task_id));
        setTasks(updatedTasks);
        setSelectedTasks([]);
    }

    const toggleSelectTask = (taskId) => {
        let aux = selectedTasks
        let factor = aux[taskId] ? -1 : 1
        aux[taskId] = !aux[taskId];
        setSelectedTasks({ ...aux, total: aux.total + factor });
    };

    const deleteTask = (taskId) => {
        const updatedTasks = tasks.filter((task) => task.task_id !== taskId);
        setTasks(updatedTasks);
        setSelectedTasks((prevSelectedTasks) =>
            prevSelectedTasks.filter((selectedTask) => selectedTask !== taskId)
        );
    };

    const updateTask = async (updatedTask) => {
        console.log(updatedTask.description.length)
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

    const toggleSelectAll = () => {
        let selecteds = selectedTasks;

        props.tasks.forEach(task => {
            selecteds[task.task_id] = !selectAll;
        });

        setSelectedTasks({ ...selecteds, total: !selectAll ? props.tasks.length : 0 })
        setSelectAll(!selectAll);
    };

    return (
        <>
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
                                <Menu.Item style={styles.menuItem} onPress={props.showMovePopUp}>Mover a</Menu.Item>
                            </Menu>
                        </View>
                    </Box>
                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                        <Text>{selectAll ? 'Deseleccionar todo' : 'Seleccionar todo'}</Text>
                        {props.tasks.length > 0 && (
                            <Checkbox
                                value={selectAll}
                                onChange={toggleSelectAll}
                                style={{ borderWidth: 0, padding: 0, backgroundColor: 'transparent' }}
                            >
                                <Icon style={{ marginLeft: -18 }} size={6} color="#f39f18" as={selectAll ? <MaterialCommunityIcons name="checkbox-multiple-marked-circle" /> : <MaterialCommunityIcons name="checkbox-multiple-blank-circle-outline" />} />
                            </Checkbox>
                        )}
                    </View>
                </VStack>
            )}
            <Animated.FlatList
                data={props.tasks}
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
                        showMovePopUp={props.showMovePopUp}
                        showEditPopUp={props.showEditPopUp}
                    />)
                }}
            // ItemSeparatorComponent={() => <Separator />}
            />
        </>
    )
}


export default TaskList