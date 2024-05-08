import { View, Text, Animated, TouchableOpacity, Platform, Dimensions, useColorScheme, SafeAreaView } from "react-native";
import { Agenda, AgendaList, ExpandableCalendar, CalendarProvider, WeekCalendar, Calendar } from "react-native-calendars";
import SelectableTask from "../tasks/selectableTask";
import styles from './programadas.styles'
import stylesAction from '../tasks/actionScreen.styles'
import utils from "./calendar/utils"
import React, { useState, useEffect, useRef, useContext } from "react";
import { NativeBaseProvider } from "native-base"
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import taskService from "../../services/task/taskService";
import SelectionPanel from "../tasks/SelectionPanel";
import LoadingIndicator from "../../components/LoadingIndicator";
import CreateTaskModal from "../../components/modals/CreateTaskModal"
import MoveTaskModal from "../../components/modals/MoveTaskModal"
import CompleteTaskModal from "../../components/modals/CompleteTaskModal"
import { actStyles } from "../../styles/globalStyles";
import tagService from "../../services/tag/tagService";
import Colors from "../../styles/colors";
import FilterModal from "../../components/modals/FilterModal";
import FilterContext from "../../services/filters/FilterContext";
import ContextBadge from "../../components/common/ContextBadge";
import CalendarStrip from 'react-native-calendar-strip';
import SettingsModal from "../../components/modals/settings/SettingsModal";
import ThemeContext from "../../services/theme/ThemeContext";


const ProgramadasScreen = (props) => {
    const [calendarHeight, setCalendarHeight] = useState(0);
    const [tasks, setTasks] = useState([]);
    const [calendarTasks, setCalendarTasks] = useState([]);
    const [numTaskPerDay, setNumTaskPerDay] = useState({});
    const [editingTask, setEditingTask] = useState({});
    const [isDataLoaded, setDataLoaded] = useState(false);
    const [selectedTasks, setSelectedTasks] = useState({});

    //Filters
    const filterContext = useContext(FilterContext)
    const [filters, setFilters] = useState({})

    //Modal states
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);


    const themeContext = useContext(ThemeContext);
    // const theme = useColorScheme();
    const theme = themeContext.theme;
    const actStyle = actStyles(theme);
    const marked = useRef(utils.getMarkedDates(tasks));
    const [showCalendar, setShowCalendar] = useState(true);
    const weekRef = useRef();

    useEffect(() => {

        const unsubscribe = props.navigation.addListener('focus', () => {
            if (!isDataLoaded) {
                fetchData()
            }
        });

        if (isDataLoaded && filterContext.isFiltered) {
            setFilters({ context_id: filterContext.context_id })
            setDataLoaded(false)
            fetchData()
        } else if (filters.context_id) {
            const auxFilters = filters; delete auxFilters.context_id
            setFilters(auxFilters)
            setDataLoaded(false)
            fetchData();
        }

        return unsubscribe;
    }, [props.navigation, filterContext])

    async function fetchData(fetchFilters) {
        let filter = { date_limit: '?', completed: false }

        if (filterContext.isFiltered) {
            filter.context_id = filterContext.context_id;
        }

        if (fetchFilters) {
            //provisional
            if (fetchFilters.project_id) {
                filter.project_id = fetchFilters.project_id;
            }
            if (fetchFilters.context_id) {
                filter.context_id = fetchFilters.context_id;
            }
            if (fetchFilters.tags) {
                filter.tags = fetchFilters.tags
            }
        }

        let tasksDB = await taskService.getTasks(filter);
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
            const auxDateLimit = new Date(task.date_limit); auxDateLimit.setHours(0); auxDateLimit.setMinutes(0);

            if (!acumulador[auxDateLimit]) {
                acumulador[auxDateLimit] = { title: auxDateLimit, data: [] };
            }
            acumulador[auxDateLimit].data.push(task);
            return acumulador;
        }, {});

        setCalendarTasks(Object.values(tasksDB))

        let auxNumTaskPerDay = {}

        Object.values(tasksDB).forEach(day => {
            const auxDate = new Date(day.title);
            const keyDate = `${auxDate.getFullYear()}-${(auxDate.getMonth() + 1).toString().padStart(2, '0')}-${auxDate.getDate().toString().padStart(2, '0')}`;
            auxNumTaskPerDay[keyDate] = day.data.length
        })

        setNumTaskPerDay(auxNumTaskPerDay);
        setDataLoaded(true)
        console.log("CALENDAR TASKS", auxNumTaskPerDay)
    }

    const reloadData = () => {
        setDataLoaded(false)
        fetchData()
    }

    const applyFilters = (filters) => {
        setDataLoaded(false)
        fetchData(filters)
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
        if (updatedTask.tags) {
            for (let tag of updatedTask.tags) {
                await taskService.addTag(updatedTask.task_id, tag)
            }
        }
        const updatedTaskResult = await taskService.updateTask(updatedTask.task_id, updatedTask);
        console.log("ID: ", updatedTaskResult)
        if (updatedTaskResult !== -1) {
            // const updatedTasks = tasks.map((task) =>
            //     task.task_id === updatedTask.task_id ? { ...task, ...updatedTask } : task
            // );
            isEditModalOpen ? setIsEditModalOpen(false) : setIsMoveModalOpen(false);
            // setTasks(updatedTasks);
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

    const addFilter = async (filters) => {
        console.log("Añado los filtros", filters)
        if (filters) {
            setFilters(filters);
        } else {
            setFilters({})
        }
        applyFilters(filters);
    };

    const showCompleteModal = (id) => {
        const taskToEdit = tasks.find(task => task.task_id === id);

        if (taskToEdit) {
            setEditingTask(taskToEdit);
            setIsCompleteModalOpen(true);
        } else {
            console.error(`No se encontró la tarea con ID: ${id}`);
        }
    }

    const NumTasksBadge = ({ num }) => {
        return (
            <View style={styles.numTasksBadge}>
                {/* <Text style={{ color: 'white', fontSize: 8 }}>{num}</Text> */}
            </View>
        )
    }

    function TasksCalendar() {
        //provisional
        const screenWidth = Dimensions.get('window').width;
        const padding = 0.052 * screenWidth; // 6% of the screen width
        const calendarWidth = screenWidth * 0.93 - 2 * padding; // subtract padding from both sides


        return (

            <>{Platform.OS === 'web' ?
                // <WeekCalendar
                //     testID={"weekCalendar"}
                //     firstDay={1}
                //     // markedDates={marked.current}
                //     current="2024-04-12"
                //     theme={{ calendarBackground: Colors[theme].themeColor, textDayStyle: { color: Colors[theme].white } }}
                //     calendarWidth={500}
                //     animateScroll={true}
                //     showScrollIndicator={true}
                //     staticHeader={true}
                // />
                <View style={{ marginBottom: 10 }}>
                    <CalendarStrip
                        scrollable={true}
                        calendarAnimation={{ type: 'sequence', duration: 30 }}
                        ref={weekRef}
                        selectedDate={new Date()}
                        style={{ height: 120, paddingTop: 20, paddingBottom: 10 }}
                        calendarColor={Colors[theme].themeColor}
                        calendarHeaderStyle={{ color: Colors[theme].white }}
                        dateNumberStyle={{ color: Colors[theme].white }}
                        dateNameStyle={{ color: Colors[theme].white }}
                        highlightDateNumberStyle={{ color: '#00bbf2' }}
                        highlightDateNameStyle={{ color: '#00bbf2' }}
                        iconStyle={{ tintColor: '#00bbf2' }}
                        iconContainer={{ flex: 0.1 }}
                    />
                    {/* {showCalendar && <Calendar
                        enableSwipeMonths={true}
                        firstDay={1}
                        renderArrow={direction => {
                            const iconType = direction === 'left' ? "arrow-left" : "arrow-right"
                            return (
                                <MaterialCommunityIcons name={iconType} size={20} color={Colors[theme].white} />
                            )
                        }}
                        theme={{ arrowColor: 'red', calendarBackground: Colors[theme].themeColor, monthTextColor: '#00bbf2' }}
                        dayComponent={({ date, marking, state, onPress, theme2 }) => {
                            // const textColor =
                            //   marking?.today === true
                            //     ? colors.actionPrimary
                            //     : marking?.selected === true
                            //     ? colors.backgroundPrimary
                            //     : marking?.marked === true
                            //     ? colors.actionSecondary
                            //     : colors.textPrimary;
                            const numTasksDay = numTaskPerDay[date.dateString] ? numTaskPerDay[date.dateString] : 0;
                            let dayTextcolor = Colors[theme].white;

                            if (state === 'disabled') {
                                dayTextcolor = 'lightgrey'
                            } else if (state === 'selected') {
                                dayTextcolor = Colors[theme].white
                            }

                            return (

                                <TouchableOpacity
                                    onPress={() => {
                                        // selectDay(state, date, onPress);
                                        onPress(date)
                                        console.log(onPress)
                                    }}
                                // style={[marking?.customContainerStyle, theme?.textDayStyle]}
                                >
                                    <View style={{ ...styles.expandableCalendar, backgroundColor: state === 'selected' ? '#00bbf2' : Colors[theme].themeColor }}>
                                        {numTasksDay !== 0 && isDataLoaded && <NumTasksBadge num={numTasksDay} />}
                                        <Text style={{ fontSize: 16, color: dayTextcolor }}>
                                            {date?.day}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        }}
                    />} */}
                </View>
                : <ExpandableCalendar
                    testID={"expandableCalendar"}
                    firstDay={1}
                    markedDates={marked.current}
                    initialPosition={ExpandableCalendar.positions.CLOSED}
                    dayComponent={({ date, marking, state, onPress, theme2 }) => {
                        // const textColor =
                        //   marking?.today === true
                        //     ? colors.actionPrimary
                        //     : marking?.selected === true
                        //     ? colors.backgroundPrimary
                        //     : marking?.marked === true
                        //     ? colors.actionSecondary
                        //     : colors.textPrimary;
                        const numTasksDay = numTaskPerDay[date.dateString] ? numTaskPerDay[date.dateString] : 0;
                        let dayTextcolor = Colors[theme].white;

                        if (state === 'disabled') {
                            dayTextcolor = 'lightgrey'
                        } else if (state === 'selected') {
                            dayTextcolor = Colors[theme].white
                        }

                        return (

                            <TouchableOpacity
                                onPress={() => {
                                    // selectDay(state, date, onPress);
                                    // onPress(date)
                                    console.log(onPress)
                                }}
                            // style={[marking?.customContainerStyle, theme?.textDayStyle]}
                            >
                                <View style={{ ...styles.expandableCalendar, backgroundColor: state === 'selected' ? '#00bbf2' : Colors[theme].themeColor }}>
                                    {numTasksDay !== 0 && isDataLoaded && <NumTasksBadge num={numTasksDay} />}
                                    <Text style={{ fontSize: 16, color: dayTextcolor }}>
                                        {date?.day}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                    theme={{
                        calendarBackground: Colors[theme].themeColor,
                    }}
                />}

                {selectedTasks.total > 0 &&
                    <View style={styles.selectionPanel}>
                        <SelectionPanel selectedTasks={selectedTasks} tasks={tasks} setSelectedTasks={setSelectedTasks} setIsMoveModalOpen={setIsMoveModalOpen} />
                    </View>
                }

                {!isDataLoaded ? <LoadingIndicator /> :
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
                                <View style={item.index === 0 ? styles.taskContainerFirst : styles.taskContainer}>
                                    <SelectableTask
                                        navigation={props.navigation}
                                        task={item.item} selectedTasks={selectedTasks}
                                        showEditPopUp={showEditPopUp}
                                        showMovePopUp={showMovePopUp}
                                        showCompleteModal={showCompleteModal}
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
                        sectionStyle={[styles.section, { backgroundColor: Colors[theme].activeColor }]}

                    // theme={{textSectionTitleColor: 'red'}}
                    // theme={{
                    //     textDayStyle: {color: 'red'},
                    //     selectedDayTextColor: 'red',
                    //     agendaDayTextColor: 'red',
                    //     agendaTodayColor: 'red',
                    //     agendaDayNumColor: 'red',
                    //     textSectionTitleColor: 'red',
                    //     textSectionTitleColor: 'red'
                    //     // textDay                    
                    // }}
                    // dayFormat={'yyyy-MM-d'}
                    />
                }
            </>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <NativeBaseProvider>
                <CalendarProvider date={utils.getFormattedDateCalendar(new Date())} showTodayButton onDateChanged={(date) => {
                    if (Platform.OS === 'web') {
                        const auxDate = new Date(date);
                        weekRef.current.setSelectedDate(auxDate.toISOString())
                    }
                }}>
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

                    <CompleteTaskModal
                        title="Completar tarea"
                        texto={"¿Desea completar esta tarea?"}
                        // touch={hideEditPopUp}
                        // editingTask={editingTask}
                        onAccept={completeTask}
                        isModalOpen={isCompleteModalOpen}
                        setIsModalOpen={setIsCompleteModalOpen}
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

                    {/* ADD FILTER MODAL */}
                    <FilterModal
                        onAccept={addFilter}
                        isModalOpen={isFilterModalOpen}
                        setIsModalOpen={setIsFilterModalOpen}
                        fiterState={filters}
                    />


                    <View style={styles.container}>
                        <View style={{ flexDirection: 'row', justifyContent: Dimensions.get('window').width <= 768 ? 'space-between' : 'flex-end', alignItems: 'flex-end', marginTop: 25 }}>
                            {Dimensions.get('window').width <= 768 && (<TouchableOpacity onPress={() => props.navigation.toggleDrawer()}>
                                <Feather name="sidebar" size={28} color={Colors[theme].white} />
                            </TouchableOpacity>)}
                            <View style={{ minWidth: 50, justifyContent: 'flex-end' }}>
                                <TouchableOpacity style={stylesAction.area} onPress={() => setIsFilterModalOpen(true)}>
                                    {filterContext.isFiltered && <ContextBadge style={{ marginRight: 10 }} context_name={filterContext.context_name} handlePress={() => {
                                        // handleContextAction(null, context_name);
                                        filterContext.clearFilter();
                                        reloadData();
                                    }} />}
                                    <MaterialCommunityIcons name="filter-variant" size={28} color={Colors[theme].white} />
                                    {Object.keys(filters).length > 0 &&
                                        <Text style={{ color: Colors[theme].white }}>({Object.keys(filters).length})</Text>
                                    }
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={actStyle.action}>
                            <Ionicons name="calendar-outline" style={actStyle.iconAction} color={'#008080'} />
                            <Text style={{ ...actStyle.actionTitle, color: Colors[theme].white }}>Programadas</Text>
                        </View>
                        {/* <TouchableOpacity style={stylesAction.area} onPress={() => setShowCalendar(!showCalendar)}>
                            <Text style={{ color: Colors[theme].white }}>Toggle calendar</Text>
                        </TouchableOpacity> */}

                    </View>
                    <TasksCalendar />
                </CalendarProvider>
            </NativeBaseProvider>
        </SafeAreaView>
    )
}


export default ProgramadasScreen;