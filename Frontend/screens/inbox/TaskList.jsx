import React, { useState, useRef, useEffect } from "react";
import taskService from "../../services/task/taskService";
import {Animated} from "react-native";
import SelectableTask from "./selectableTask";
import SelectionPanel from "./SelectionPanel";


function TaskList(props) {
    const [selectedTasks, setSelectedTasks] = useState({});
    const [archiveTask, setArchiveTask] = useState([]);

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

    return (
        <>
            {selectedTasks.total > 0 && <SelectionPanel selectedTasks={selectedTasks} tasks={props.tasks} setSelectedTasks={setSelectedTasks}/>}
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