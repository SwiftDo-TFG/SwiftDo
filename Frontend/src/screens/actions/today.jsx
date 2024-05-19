
import React, { useState, useEffect, useRef, useContext } from "react";
import { View, Text, useColorScheme, SafeAreaView, Dimensions, TouchableOpacity, Animated } from "react-native";
import { NativeBaseProvider, ScrollView } from "native-base"
import { FontAwesome5, Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import Colors from "../../styles/colors";
import { actStyles } from "../../styles/globalStyles";
import ThemeContext from "../../services/theme/ThemeContext";
import stylesAction from '../tasks/actionScreen.styles'
import FilterContext from "../../services/filters/FilterContext";
import AuthContext from '../../services/auth/context/authContext';
import taskService from "../../services/task/taskService";
import projectService from "../../services/project/projectService";
import SelectableTask from "../tasks/selectableTask";
import SelectionPanel from "../tasks/SelectionPanel";
import AddButton from "../../components/common/addButton";
import MoveTaskModal from "../../components/modals/MoveTaskModal";
import CreateTaskModal from "../../components/modals/CreateTaskModal";
import CreateProjectModal from "../../components/modals/CreateProjectModal";
import LoadingIndicator from "../../components/LoadingIndicator";
import AddTypeModal from "../../components/modals/AddTypeModal";
import CompleteTaskModal from "../../components/modals/CompleteTaskModal";
import FilterModal from "../../components/modals/FilterModal";




function Today(props) {
    const themeContext = useContext(ThemeContext);
    // const theme = useColorScheme();
    const theme = themeContext.theme;
    const actStyle = actStyles(theme);

    const [tasks, setTasks] = useState([]);
    const [allTasks, setAllTasks] = useState([]);
    const [delayTask, setDelayTasks] = useState([]);
    const [amountTask, setAmountTasks] = useState([]);
    const [selectedTasks, setSelectedTasks] = useState({});
    const [editingTask, setEditingTask] = useState({});
    const [isDataLoaded, setDataLoaded] = useState(false);

    let index = 0;
    const scrollY = useRef(new Animated.Value(0)).current;
    const ITEM_SIZE = 62; //Tamaño tarea + margin
    let project_title = ''

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

    const filterContext = useContext(FilterContext)
    const [filters, setFilters] = useState({})
    const authState = useContext(AuthContext);



    useEffect(() => {

        const unsubscribe = props.navigation.addListener('focus', () => {
            if (!isDataLoaded) {
                fetchData()
            }
        });

        if (isDataLoaded && filterContext.isFiltered) {
            console.log("THIS IS THE FILTER CONTEXT", filterContext.context_id, filterContext.isFiltered, isDataLoaded)
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
    }, [authState, filterContext, props.navigation]);


    async function fetchData(fetchFilters) {

        let filter = { state: 0, completed: false }

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

        const tasksDB = await taskService.getTasks(filter);

        if (tasksDB.error) {
            return authState.signOut();
        }

        filter.state = 6;

        const delayDB = await taskService.getTasks(filter);

        if (delayDB.error) {
            return authState.signOut();
        }

        console.log("DELAY TASK: ", delayDB)

        filter.state = 2;
        filter.limit = true;

        const amountDB = await taskService.getTasks(filter);

        if (amountDB.error) {
            return authState.signOut();
        }

        console.log("AMOUNT TASK: ", amountDB)


        const seletedAux = {}
        tasksDB.forEach(async (task) => {
            seletedAux[task.task_id] = false;
        })
        delayDB.forEach(async (task) => {
            seletedAux[task.task_id] = false;
        })
        amountDB.forEach(async (task) => {
            seletedAux[task.task_id] = false;
        })
        console.log("Estas son las tareas que se devuelven", tasksDB)

        seletedAux.total = 0;

        setTasks(tasksDB)
        setDelayTasks(delayDB)
        setAmountTasks(amountDB)
        setAllTasks([...tasksDB, ...delayDB, ...amountDB]);
        setSelectedTasks(seletedAux)
        setDataLoaded(true)
    }

    const reloadData = () => {
        setDataLoaded(false)
        fetchData()
    }

    const applyFilters = (filters) => {
        setDataLoaded(false)
        fetchData(filters)
    }

    const addTask = async (task) => {
        console.log("Nueva task", task)
        if (task.title.trim() !== "") {
            const newTask = await taskService.createTask(task);
            if (newTask.task_id !== -1) {
                task.task_id = newTask.task_id;
                if (task.tags) {
                    for (let tag of task.tags) {
                        await taskService.addTag(task.task_id, tag)
                    }
                }
                // setTasks([...tasks, task]);
                setIsCreateModalOpen(false);
                reloadData();
            } else {
                console.error("Error al agregar tarea a la base de datos");
            }
        }
    };

    const addProject = async (project) => {
        console.log("Nuevo proyecto", project)
        if (project.title.trim() !== "") {
            const newProject = await projectService.createProject(project);
            console.log(newProject);
            if (newProject.project_id !== -1) {

                setIsCreateProjectOpen(false);
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

    const handleUpdateTasks = async (updatedTask) => {

        if (selectedTasks.total > 0) {
            await updateTaskList(updatedTask.state);
        } else {
            await updateTask(updatedTask);
        }
    }

    const updateTask = async (updatedTask) => {
        console.log("UPDATING TASK", updatedTask)
        if (updatedTask.tags) {
            for (let tag of updatedTask.tags) {
                await taskService.addTag(updatedTask.task_id, tag)
            }
        }
        const updatedTaskResult = await taskService.updateTask(updatedTask.task_id, updatedTask);
        console.log("ID: ", updatedTaskResult)
        if (updatedTaskResult !== -1) {
            // const updatedTasks = tasks.map((task) =>
            //   task.task_id === updatedTask.task_id ? { ...task, ...updatedTask } : task
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

    const addFilter = async (filters) => {
        console.log("Añado los filtros", filters)
        if (filters) {
            setFilters(filters);
        } else {
            setFilters({})
        }
        applyFilters(filters);
    };

    const handleCompleteTasks = async () => {

        if (selectedTasks.total > 0) {
            await completeTaskList();
        } else {
            await completeTask();
        }
    }
    const toggleSelectTask = (taskId) => {
        let aux = selectedTasks
        let factor = aux[taskId] ? -1 : 1
        aux[taskId] = !aux[taskId];
        setSelectedTasks({ ...aux, total: aux.total + factor });

        console.log("SELECTED TASKS", selectedTasks)
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

    const completeTaskList = async () => {

        const list_ids = Object.keys(selectedTasks).filter(key => selectedTasks[key] === true);

        const total = await taskService.completeTaskList(list_ids, true);

        setIsCompleteModalOpen(false);
        reloadData();
    };

    const showMovePopUp = (id) => {
        const taskToEdit = allTasks.find(task => task.task_id === id);
        console.log("Task to edit:", taskToEdit)

        if (taskToEdit) {
            if(taskToEdit.state === '3') props.navigation.navigate('Programadas');
            else if(taskToEdit.state === '2') props.navigation.navigate('CuantoAntes');
            else props.navigation.navigate('Inbox');
        } else {
            console.error(`No se encontró la tarea con ID: ${id}`);
        }
    }

    const showEditPopUp = async (id) => {
        const taskToEdit = allTasks.find(task => task.task_id === id);

        if (taskToEdit) {
            setEditingTask(taskToEdit);
            setIsEditModalOpen(true);
        } else {
            console.error(`No se encontró la tarea con ID: ${id}`);
        }
    }


    const showCompleteModal = (id) => {
        const taskToEdit = allTasks.find(task => task.task_id === id);

        if (taskToEdit) {
            setEditingTask(taskToEdit);
            setIsCompleteModalOpen(true);
        } else {
            console.error(`No se encontró la tarea con ID: ${id}`);
        }
    }

    const showAddTaskPopUp = () => {
        setIsCreateModalOpen(true);
    }

    const EmptyTaskListPanel = ({ icon }) => {
        return (
            <View style={stylesAction.emptyListPanel}>
                <View style={stylesAction.roundedPanel}>
                    {icon}
                    <Text style={stylesAction.emptyListPanelText}>Parece que todavía no hay tareas</Text>
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <NativeBaseProvider>
                <View style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 5, paddingBottom: 20, }}>
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
                        <FontAwesome5 name="play" style={[actStyle.iconAction]} color={"#515f8f"} />
                        <Text style={[actStyle.actionTitle, { color: Colors[theme].white }]}>Hoy</Text>
                    </View>
                    {/* <TouchableOpacity style={stylesAction.area} onPress={() => setShowCalendar(!showCalendar)}>
                            <Text style={{ color: Colors[theme].white }}>Toggle calendar</Text>
                        </TouchableOpacity> */}
                </View>
                {selectedTasks.total > 0 &&
                    <View style={{ paddingHorizontal: 20 }}>
                        <SelectionPanel
                            selectedTasks={selectedTasks}
                            tasks={allTasks}
                            setSelectedTasks={setSelectedTasks}
                            setIsMoveModalOpen={setIsMoveModalOpen}
                            setIsCompleteModalOpen={setIsCompleteModalOpen}
                        />
                    </View>
                }
                {!isDataLoaded && <LoadingIndicator />}
                {isDataLoaded && allTasks.length === 0 ? <EmptyTaskListPanel icon={<FontAwesome5 style={actStyle.emptyIcon} name="play" color={Colors[theme].grey} />} /> :
                    <Animated.ScrollView style={{ paddingHorizontal: 20 }}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                            { useNativeDriver: true }
                        )}>
                        {tasks.map(task => {

                            // const inputRange = [-1, 0, ITEM_SIZE * index, ITEM_SIZE * (index + 2)]
                            // const scale = scrollY.interpolate({
                            //     inputRange,
                            //     outputRange: [1, 1, 1, 0],
                            //     extrapolate: 'clamp',
                            // })

                            // const opacityinputRange = [-1, 0, ITEM_SIZE * index, ITEM_SIZE * (index + .5)]
                            // const opacity = scrollY.interpolate({
                            //     inputRange: opacityinputRange,
                            //     outputRange: [1, 1, 1, 0],
                            //     extrapolate: 'clamp',
                            // })

                            // index++;

                            let hasProject = false

                            if (task.project_title) {
                                if (task.project_title !== project_title) {
                                    hasProject = true;
                                    project_title = task.project_title;
                                } else {
                                    hasProject = false;
                                }
                            }

                            return (
                                <View key={task.task_id}>
                                    {
                                        hasProject ?
                                            <View style={{ marginVertical: 3, flexDirection: 'row' }}>
                                                <Text style={{ color: "#515f8f", fontWeight: 600, fontSize: 16 }}>
                                                    <MaterialCommunityIcons name="circle-outline" size={22} color={task.project_color} /> {(task.project_title.length > 8 ? `${task.project_title.substring(0, 8)}...` : task.project_title)}
                                                </Text>
                                            </View>
                                            : <></>
                                    }
                                    <Animated.View>
                                        {/* <Animated.View style={{ transform: [{ scale }], opacity }}></Animated.View>  */}
                                        <SelectableTask
                                            navigation={props.navigation}
                                            route={props.route}
                                            task={task}
                                            onPress={() => toggleSelectTask(task.task_id)}
                                            onDelete={deleteTask}
                                            // scale={scale}
                                            // opacity={opacity}
                                            scale={1}
                                            opacity={1}
                                            selectedTasks={selectedTasks}
                                            showMovePopUp={showMovePopUp}
                                            showEditPopUp={showEditPopUp}
                                            showCompleteModal={showCompleteModal}
                                        />
                                    </Animated.View>
                                </View>
                            )
                        })}
                        {delayTask.length > 0 && (
                            <View style={{ marginVertical: 4, flexDirection: 'row' }}>
                                <MaterialCommunityIcons name="timer-sand-complete" size={24} color="#515f8f" />
                                <Text style={{ marginLeft: 4, fontWeight: 'bold', fontSize: 18, color: "#515f8f" }}>Retrasadas</Text>
                            </View>
                        )}
                        {delayTask.map(task => {
                            // const inputRange = [-1, 0, ITEM_SIZE * index, ITEM_SIZE * (index + 2)]
                            // const scale = scrollY.interpolate({
                            //     inputRange,
                            //     outputRange: [1, 1, 1, 0],
                            //     extrapolate: 'clamp',
                            // })

                            // const opacityinputRange = [-1, 0, ITEM_SIZE * index, ITEM_SIZE * (index + .5)]
                            // const opacity = scrollY.interpolate({
                            //     inputRange: opacityinputRange,
                            //     outputRange: [1, 1, 1, 0],
                            //     extrapolate: 'clamp',
                            // })

                            // index++;

                            return (
                                <Animated.View key={task.task_id}>
                                    {/* <Animated.View key={task.task_id} style={{ transform: [{ scale }], opacity }}></Animated.View> */}
                                    <SelectableTask
                                        navigation={props.navigation}
                                        route={props.route}
                                        task={task}
                                        onPress={() => toggleSelectTask(task.task_id)}
                                        onDelete={deleteTask}
                                        // scale={scale}
                                        // opacity={opacity}
                                        scale={1}
                                        opacity={1}
                                        selectedTasks={selectedTasks}
                                        showMovePopUp={showMovePopUp}
                                        showEditPopUp={showEditPopUp}
                                        showCompleteModal={showCompleteModal}
                                    />
                                </Animated.View>
                            )
                        })}
                        {amountTask.length > 0 && (
                            <View style={{ marginVertical: 4, flexDirection: 'row' }}>
                                <Ionicons name="layers" size={24} color="#515f8f" />
                                <Text style={{ marginLeft: 4, fontWeight: 'bold', fontSize: 18, color: "#515f8f" }}>Acumuladas</Text>
                            </View>
                        )}
                        {amountTask.map(task => {
                            // const inputRange = [-1, 0, ITEM_SIZE * index, ITEM_SIZE * (index + 2)]
                            // const scale = scrollY.interpolate({
                            //     inputRange,
                            //     outputRange: [1, 1, 1, 0],
                            //     extrapolate: 'clamp',
                            // })

                            // const opacityinputRange = [-1, 0, ITEM_SIZE * index, ITEM_SIZE * (index + .5)]
                            // const opacity = scrollY.interpolate({
                            //     inputRange: opacityinputRange,
                            //     outputRange: [1, 1, 1, 0],
                            //     extrapolate: 'clamp',
                            // })

                            // index++;

                            return (
                                <Animated.View key={task.task_id}>
                                {/* <Animated.View key={task.task_id} style={{ transform: [{ scale }], opacity }}></Animated.View> */}
                                    <SelectableTask
                                        navigation={props.navigation}
                                        route={props.route}
                                        task={task}
                                        onPress={() => toggleSelectTask(task.task_id)}
                                        onDelete={deleteTask}
                                        // scale={scale}
                                        // opacity={opacity}
                                        scale={1}
                                        opacity={1}
                                        selectedTasks={selectedTasks}
                                        showMovePopUp={showMovePopUp}
                                        showEditPopUp={showEditPopUp}
                                        showCompleteModal={showCompleteModal}
                                    />
                                </Animated.View>
                            )
                        })}
                    </Animated.ScrollView>
                }
                <View style={{ paddingHorizontal: 20 }}>
                    <AddButton onPress={() => showAddTaskPopUp()} onLongPress={() => setIsModalVisible(true)} />
                </View>

                {/* CREATE BUTTON MODAL SELECT TASK/PROJECT */}
                <AddTypeModal
                    isModalVisible={isModalVisible}
                    setIsModalVisible={setIsModalVisible}
                    showAddTaskPopUp={showAddTaskPopUp}
                    setIsCreateProjectOpen={setIsCreateProjectOpen}
                />

                {/* MOVE MODAL   */}
                {/* <MoveTaskModal
                    title="Move"
                    // touch={hideEditPopUp}
                    editingTask={editingTask}
                    onAccept={handleUpdateTasks}
                    isModalOpen={isMoveModalOpen}
                    setIsModalOpen={setIsMoveModalOpen}
                /> */}

                {/* EDIT MODAL   */}
                <CreateTaskModal
                    title="Editar"
                    // touch={hideEditPopUp}
                    editingTask={editingTask}
                    onAccept={updateTask}
                    isModalOpen={isEditModalOpen}
                    setIsModalOpen={setIsEditModalOpen}
                />

                {/* ADD TASK MODAL   */}
                <CreateTaskModal
                    title="Añadir"
                    // touch={hideEditPopUp}
                    // editingTask={editingTask}
                    onAccept={addTask}
                    isModalOpen={isCreateModalOpen}
                    setIsModalOpen={setIsCreateModalOpen}
                    currentState={props.state === 0 ? 1 : props.state}
                    project_id={props.project_id ? props.project_id : null}
                />

                <CompleteTaskModal
                    title="Completar tarea"
                    texto={"¿Desea completar esta tarea?"}
                    onAccept={handleCompleteTasks}
                    isModalOpen={isCompleteModalOpen}
                    setIsModalOpen={setIsCompleteModalOpen}
                />
                {/* ADD PROJECT MODAL   */}
                <CreateProjectModal
                    title="Añadir"
                    // touch={hideEditPopUp}
                    // editingTask={editingTask}
                    onAccept={addProject}
                    isModalOpen={isCreateProjectOpen}
                    setIsModalOpen={setIsCreateProjectOpen}
                />

                {/* ADD FILTER MODAL */}
                <FilterModal
                    onAccept={addFilter}
                    isModalOpen={isFilterModalOpen}
                    setIsModalOpen={setIsFilterModalOpen}
                    fiterState={filters}
                />
            </NativeBaseProvider>
        </SafeAreaView>
    )
}


export default Today;