import { useState, useEffect, useContext } from "react";
import { Keyboard, TextInput, KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme, InputAccessoryView, Platform } from "react-native";
import { AntDesign, Ionicons, FontAwesome, MaterialCommunityIcons, MaterialIcons, Feather} from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import styles from '../tasks/actionScreen.styles'
import Colors from "../../styles/colors";
import Markdown from 'react-native-markdown-display';
import ToolBar from "../../components/common/ToolBar";
import CustomBottomSheet from "../../components/modals/customModal";
import taskService from "../../services/task/taskService";
import ThemeContext from '../../services/theme/ThemeContext';
import CreateTaskModal from "../../components/modals/CreateTaskModal";
import ProjectBadge from "../../components/common/ProjectBadge";
import OfflineContext from "../../offline/offlineContext/OfflineContext";


const DetailScreen = ({ navigation, route }) => {
    const lastScreen = route.params.currentScreen
    //Theme
    const themeContext = useContext(ThemeContext);
    // const theme = useColorScheme();
    const theme = themeContext.theme;
    const [task, setTask] = useState(route.params.task)
    // const task = route.params.task
    console.log("TArea:", task.description);

    //Edit Modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState({});


    const mdtext = route.params.task.description
    const inputAccessoryViewID = 'uniqueID';
    const initialText = mdtext === null ? '' : mdtext;
    const [content, setContent] = useState(initialText)
    const [editing, toggleEdit] = useState(false);

    //Offline
    const offlineContext = useContext(OfflineContext);

    useEffect(() => {
        setTask(route.params.task);
        if (mdtext !== null)
            setContent(mdtext);
        else
            setContent('');
        toggleEdit(false);
    }, [route])


    const updateTaskDescription = async () => {
        let tempTask = { task_id: task.task_id, description: content }
        console.log()
        //actualizamos la tarea con la nueva descripcion
        if (tempTask.description !== null) {
            if(!offlineContext.isOffline){
                const updatedTaskResult = await taskService.updateTask(tempTask.task_id, tempTask);
                if (updatedTaskResult !== -1) {
                    console.log("Se ha guardado la nueva descripcion")
                }
            }else{
                tempTask={...task, description: content }
                tempTask.offline = true;
                await offlineContext.updateOfflineTask(tempTask, task.state, offlineContext)
            }
        }

    }
    const handlePress = () => {
        Keyboard.dismiss();
        toggleEdit(false)
        updateTaskDescription();
    }
    // Estilos de markdown 
    const markdownStyle = {
        heading1: {
            fontSize: 32,
            color: Colors[theme].white,
            fontFamily: 'Helvetica',
            fontWeight: 'bold',
        },
        heading2: {
            fontSize: 24,
            color: Colors[theme].white,
            fontFamily: '',
            fontWeight: 'bold'
        },
        heading3: {
            fontSize: 18,
            color: Colors[theme].white,
            fontFamily: '',
            fontWeight: 'bold'
        },
        body: { fontSize: 14, fontWeight: '400', color: Colors[theme].white },
        link: {
            textDecorationLine: 'underline',
            color: Colors[theme].white
        },

    }

    function navigateFromProjectToProject(navigation, project) {
        navigation.dispatch(state => {
            const index = state.routes.findIndex(r => r.name === 'project');
            const routes = state.routes.slice(0, index + 1);

            routes.push({
                name: 'project',
                params: { project_id: project.project_id },
            })


            return CommonActions.reset({
                ...state,
                routes,
                index: routes.length - 1,
            });
        });
        navigation.closeDrawer();
    }

    const reloadData = async () => {
        const taskDB = await taskService.getTaskById(task.task_id);
        setTask(taskDB);
    }

    const updateTask = async (updatedTask) => {
        console.log("UPDATING TASK", updatedTask)

        if(!offlineContext.isOffline){
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
                
                reloadData();
            } else {
                console.error("Error al actualizar la tarea en la base de datos");
            }
        }else{
            updatedTask.offline = true;
            await offlineContext.updateOfflineTask(updatedTask, task.state, offlineContext)
            isEditModalOpen ? setIsEditModalOpen(false) : setIsMoveModalOpen(false);
            console.log("TASK FINALLY UPDATED", updatedTask)
            setTask(updatedTask);
            if(updatedTask.description){
                setContent(updatedTask.description);
            }
        }
    };

    const showEditPopUp = async () => {
        const taskToEdit = task;

        if (taskToEdit) {
            setEditingTask(taskToEdit);
            setIsEditModalOpen(true);
        } else {
            console.error('No se encontró la tarea con ID:');
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1}}>
                <View style={{ padding: 18 }}>
                    {/* TITLE + TAGS + CONTEXT */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => {
                            if (Platform.OS !== "web") {
                                navigation.goBack()
                            } else {
                                if (route.params.lastScreen.name !== 'project') {
                                    navigation.navigate(route.params.lastScreen.name);
                                } else {
                                    navigateFromProjectToProject(navigation, { ...route.params.lastScreen.params });
                                }
                            }
                        }}>
                            <AntDesign name="left" size={20} color={Colors[theme].white} />
                        </TouchableOpacity>
                        {task.context_id && <View style={[style.contextContainer, { flexDirection: 'row' }]}>
                            <MaterialCommunityIcons name="home-city-outline" size={16} color={Colors[theme].white} />
                            <Text style={[style.textStyle, { color: Colors[theme].white }]}>
                                {task.context_name}
                            </Text>
                        </View>}
                    </View>
                    
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
                        <Text style={[style.titleContainer, { color: Colors[theme].white }]}> {task.title} </Text>
                        <Ionicons name="flag" size={22} color={task.important_fixed ? "#be201c" : "transparent"} />
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'flex-end', marginTop: 8 }}>
                            {task.project_id && 
                                <TouchableOpacity style={{ justifyContent: 'flex-start' }} onPress={() => navigateFromProjectToProject(navigation, {project_id: task.project_id})}>
                                    <ProjectBadge project={{project_id: task.project_id, title: task.project_title, color: task.project_color}}/> 
                                </TouchableOpacity>
                            }
                        </View>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'flex-end', marginTop: 8 }}>
                            {task.tags && Object.keys(task.tags).map((key, index) => (
                                <View key={index} style={[styles.tagsOnTask, { backgroundColor: task.tags[key].color }]}>
                                    <FontAwesome name="tag" size={10} color='white' style={{ marginRight: 3 }} />
                                    <Text style={{ color: 'white', paddingBottom: 3, fontSize: 12 }}>{task.tags[key].name}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
                {/* Markdown && Edit Description */}
                <View style={{ height: '55%'}}>
                    <View style={{margin: 15, marginBottom: 25, height: '5%'}}>
                        <TouchableOpacity style={[{backgroundColor: Colors[theme].themeColor, borderColor: "#ffa540", position: 'absolute', left: 0 }, style.stopEditingButton]} onPress={() => showEditPopUp()}>
                            <MaterialCommunityIcons name="layers-edit" size={24} color="#ffa540" />
                            {/* <MaterialCommunityIcons name="circle-edit-outline" size={22} color="#ffa540" /> */}
                            {/* <MaterialIcons name="edit-attributes" size={24} color="#ffa540" /> */}
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignSelf: 'flex-end' }}>
                            {/* Habilitamos la escritura */}
                            {!editing && <TouchableOpacity style={[{ backgroundColor: Colors[theme].softGrey, position: 'absolute', right: 0 }, style.stopEditingButton]} onPress={() => toggleEdit(true)}>
                                <Feather name="edit-3" size={24} color="black" />
                            </TouchableOpacity>}
                            {/* Bajamos el teclado y cancelamos la escritura */}
                            {editing && <TouchableOpacity style={[{ backgroundColor: Colors[theme].softGrey, position: 'absolute', right: 0 }, style.stopEditingButton]} onPress={handlePress}>
                                <MaterialIcons name="keyboard-hide" size={22} color="black" />
                            </TouchableOpacity>}

                        </View>
                    </View>

                    {editing ?
                        (
                            <TextInput
                                style={{ padding: 16, marginTop: 35, color: Colors[theme].white, height: '95%' }}
                                inputAccessoryViewID={inputAccessoryViewID}
                                onChangeText={setContent}
                                value={content}
                                multiline
                                placeholder="Añade aqui los detalles con estilo Markdown..."
                                placeholderTextColor={Colors[theme].softGrey}
                                maxLength={2000}
                            />

                        ) :
                        (
                            <View style={{ height: '95%', padding: 16, marginTop: 20 }}>
                                <ScrollView
                                    contentInsetAdjustmentBehavior="automatic"
                                    style={{ height: '100%' }}>
                                    <Markdown style={markdownStyle}>{content}</Markdown>
                                </ScrollView>
                            </View>
                        )}
                    {
                        Platform.OS !== 'web' &&
                        (<InputAccessoryView nativeID={inputAccessoryViewID}>
                            <ToolBar />
                        </InputAccessoryView>)
                    }
                    {/* EDIT MODAL   */}
                    <CreateTaskModal
                        title="Editar"
                        // touch={hideEditPopUp}
                        editingTask={editingTask}
                        onAccept={updateTask}
                        isModalOpen={isEditModalOpen}
                        setIsModalOpen={setIsEditModalOpen}
                    />
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}


const style = StyleSheet.create({
    titleContainer: {
        fontSize: 30,
        fontWeight: "bold",
        maxWidth: "80%",
    },
    contextContainer: {
        borderRadius: 15,
        backgroundColor: Colors.dark.orange,
        padding: 10,
    },
    textStyle: {
        fontWeight: "bold",
        marginLeft: 10,
    },
    stopEditingButton: {
        padding: 10,
        borderRadius: 10,
        borderWidth: 0.5
    }
})

export default DetailScreen;