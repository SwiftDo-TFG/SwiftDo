import { View, Text, Animated, ActivityIndicator } from "react-native";
import { Agenda, AgendaList, ExpandableCalendar, CalendarProvider, WeekCalendar } from "react-native-calendars";
import SelectableTask from "../inbox/selectableTask";
import styles from './programadas.styles'
import utils from "./calendar/utils"
import React, { useState, useEffect, useRef } from "react";
import { NativeBaseProvider } from "native-base"
import { PopUpModal } from "../../components/PopUpModal";
import taskService from "../../services/task/taskService";
import SelectionPanel from "../inbox/SelectionPanel";
import LoadingIndicator from "../../components/LoadingIndicator";


const ProgramadasScreen = (props) => {
    const [calendarHeight, setCalendarHeight] = useState(0);
    const [tasks, setTasks] = useState([]);
    const [calendarTasks, setCalendarTasks] = useState([]);
    const [editingTask, setEditingTask] = useState({});
    const [isDataLoaded, setDataLoaded] = useState(false);
    const [selectedTasks, setSelectedTasks] = useState({});

    const marked = useRef(utils.getMarkedDates(tasks));

    let moveRef = React.createRef();
    let editRef = React.createRef();
    let addRef = React.createRef();

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
        //TODO const taskToEdit = { task_id: 1, title: 'Task 1, this is the title' }
        const taskToEdit = tasks.find(task => task.task_id === id);
        if (taskToEdit) {
            setEditingTask([taskToEdit]);
            editRef.show();
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

    const hideEditPopUp = () => {
        editRef.hide();
    }

    const showMovePopUp = () => {
        moveRef.show();
    }

    const hideMovePopUp = () => {
        moveRef.hide();
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

    function TasksCalendar () {
        return(
            <>
            <WeekCalendar testID={"weekCalendar"} firstDay={1} markedDates={marked.current} />
            {selectedTasks.total > 0 &&
                <View style={styles.selectionPanel}>
                    <SelectionPanel selectedTasks={selectedTasks} tasks={tasks} setSelectedTasks={setSelectedTasks} />
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
                {/* <PopUpModal
                    title="Añadir"
                    ref={(target) => addRef = target}
                    touch={hideAddTaskPopUp}
                    data={[{ title: "" }]}
                    onAccept={addTask}
                    mode='add'
                /> */}

                {isDataLoaded ? <TasksCalendar/>: <LoadingIndicator/>}
            </CalendarProvider>
        </NativeBaseProvider>
    )
}


export default ProgramadasScreen;