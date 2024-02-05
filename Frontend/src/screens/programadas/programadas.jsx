import { View, Text, Animated, TouchableOpacity } from "react-native";
import { Agenda, AgendaList, ExpandableCalendar, CalendarProvider, WeekCalendar } from "react-native-calendars";
import SelectableTask from "../tasks/selectableTask";
import styles from './programadas.styles'
import utils from "./calendar/utils"
import React, { useState, useEffect, useRef } from "react";
import { NativeBaseProvider } from "native-base"
import { PopUpModal } from "../../components/PopUpModal";
import { Ionicons } from '@expo/vector-icons';
import taskService from "../../services/task/taskService";
import SelectionPanel from "../tasks/SelectionPanel";
import LoadingIndicator from "../../components/LoadingIndicator";
import CreateTaskModal from "../../components/modals/CreateTaskModal"
import MoveTaskModal from "../../components/modals/MoveTaskModal"


const ProgramadasScreen = (props) => {
    const [calendarHeight, setCalendarHeight] = useState(0);
    const [tasks, setTasks] = useState([]);
    const [calendarTasks, setCalendarTasks] = useState([]);
    const [editingTask, setEditingTask] = useState({});
    const [isDataLoaded, setDataLoaded] = useState(false);
    const [selectedTasks, setSelectedTasks] = useState({});

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);

    const marked = useRef(utils.getMarkedDates(tasks));

    useEffect(() => {

        async function fetchData() {
            let tasksDB = await taskService.getTasks({ date_limit: '?' });
            if (tasksDB.error) {
                return authState.signOut();
            }

            const seletedAux = {}
            tasksDB.forEach(task => {
                seletedAux[task.task_id] = false;
            })

            seletedAux.total = 0;
            setSelectedTasks(seletedAux)
            setTasks(tasksDB);

            tasksDB = tasksDB.reduce((acumulador, task) => {

                if (!acumulador[task.date_limit]) {
                    acumulador[task.date_limit] = { title: task.date_limit, data: [] };
                }
                acumulador[task.date_limit].data.push(task);
                return acumulador;
            }, {});

            setCalendarTasks(Object.values(tasksDB))
        }

        const unsubscribe = props.navigation.addListener('focus', () => {
            if (!isDataLoaded) {
                fetchData()
                setDataLoaded(true)
            }
        });

        return unsubscribe;
    }, [props.navigation])

    const showEditPopUp = (id) => {
        const taskToEdit = tasks.find(task => task.task_id === id);

        if (taskToEdit) {
            setEditingTask(taskToEdit);
            setIsEditModalOpen(true);
        } else {
            console.error(`No se encontró la tarea con ID: ${id}`);
        }
    }

    const toggleSelectTask = (taskId) => {
        let aux = selectedTasks
        let factor = aux[taskId] ? -1 : 1
        aux[taskId] = !aux[taskId];
        setSelectedTasks({ ...aux, total: aux.total + factor });
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

    function TasksCalendar() {
        return (
            <>
                <WeekCalendar testID={"weekCalendar"} firstDay={1} markedDates={marked.current} />
                {selectedTasks.total > 0 &&
                    <View style={styles.selectionPanel}>
                        <SelectionPanel selectedTasks={selectedTasks} tasks={tasks} setSelectedTasks={setSelectedTasks} setIsMoveModalOpen={setIsMoveModalOpen} />
                    </View>
                }
                <AgendaList
                    sections={calendarTasks}
                    renderItem={(item, firstItemInDay) => {
                        const scrollY = useRef(new Animated.Value(0)).current;
                        const ITEM_SIZE = 62; //Tamaño tarea + margin

                        const inputRange = [-1, 0, ITEM_SIZE * item.index, ITEM_SIZE * (item.index + 2)]
                        const scale = scrollY.interpolate({
                            inputRange,
                            outputRange: [1, 1, 1, 0],
                            extrapolate: 'clamp',
                        })

                        const opacityinputRange = [-1, 0, ITEM_SIZE * item.index, ITEM_SIZE * (item.index + .5)]
                        const opacity = scrollY.interpolate({
                            inputRange: opacityinputRange,
                            outputRange: [1, 1, 1, 0],
                            extrapolate: 'clamp',
                        })

                        return (
                            <View style={styles.taskContainer}>
                                <SelectableTask
                                    task={item.item} selectedTasks={selectedTasks}
                                    showEditPopUp={showEditPopUp}
                                    showMovePopUp={showMovePopUp}
                                    onPress={() => toggleSelectTask(item.item.task_id)}
                                    scale={scale}
                                    opacity={opacity}
                                />
                            </View>
                        );
                    }}
                    markedDates={marked.current}

                    // renderSectionHeader={(info) => {
                    //     console.log("THIS IS INFO", info)
                    //     return (
                    //         <View style={styles.dayItem}>
                    //             <Text style={styles.dateText}>{utils.parseDatetoPretty(info)}</Text>
                    //             <View style={styles.horizontalLine} />
                    //         </View>
                    //     )
                    // }}

                    // scrollToNextEvent
                    sectionStyle={styles.section}
                // dayFormat={'yyyy-MM-d'}
                />
            </>
        )
    }

    return (
        <NativeBaseProvider>
            <CalendarProvider date={utils.getFormattedDateCalendar(new Date())} showTodayButton>
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

                {/* ADD MODAL   */}
                {/* <PopUpModal
                    title="Añadir"
                    ref={(target) => addRef = target}
                    touch={hideAddTaskPopUp}
                    data={[{ title: "" }]}
                    onAccept={addTask}
                    mode='add'
                /> */}
                <TouchableOpacity onPress={() => props.navigation.toggleDrawer()}>
                    <View style={styles.action}>
                        <Ionicons name="calendar-outline" style={styles.iconAction} color={'#008080'} />
                        <Text style={styles.actionTitle}>Programadas</Text>
                    </View>
                </TouchableOpacity>
                {isDataLoaded ? <TasksCalendar /> : <LoadingIndicator />}
            </CalendarProvider>
        </NativeBaseProvider>
    )
}


export default ProgramadasScreen;