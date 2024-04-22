import PopUpModal from "./PopUpModal"
import { View, TextInput, TouchableOpacity, Modal, Text, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, ScrollView, useColorScheme } from "react-native"
import styles from '../../screens/tasks/actionScreen.styles'
import { useState, useEffect, useContext } from "react"
import { FontAwesome5, Ionicons, MaterialCommunityIcons, Entypo, AntDesign, FontAwesome } from '@expo/vector-icons';
import DatePickerModal from "./DatePickerModal";
import SelectStateModal from "./SelectStateModal"
import SelectContextModal from "./SelectContextModal";
import AssignToProjectModal from "./AsingToProjectModal";
import AddTagModal from "./AddTagModal";
import TaskStates from "../../utils/enums/taskStates"
import projectService from "../../services/project/projectService";
import ContextBadge from "../common/ContextBadge";
import Colors from "../../styles/colors";
import ThemeContext from "../../services/theme/ThemeContext";


function CreateTaskModal(props) {
    const [state, setState] = useState({
        show: false,
        editedTitle: '',
        editedDescription: '',
        isImportant: false,
        date_name: 'Fecha',
        showDatePicker: false,
        state: "1",
        tags: []
    });
    const colours = ['#c93c20', '#6455d2', '#337474', '#5b6597', '#926442', '#490085', '#2c73c5', '#184bc0', '#b5541b', '#d32778', '#6e1249', '#20825b', '#ae2a32', '#11680c', '#3b7a5c']

    //Modals state
    const [showStatusSelector, setShowStatusSelector] = useState(false);
    const [showContextSelector, setShowContextSelector] = useState(false)
    const [showAssProjectSelector, setShowAssProjectSelector] = useState(false)
    const [showTagSelector, setShowTagSelector] = useState(false)
    const [colorIndex, setcolorIndex] = useState(0)

    //Theme
    const themeContext = useContext(ThemeContext);
    // const theme = useColorScheme();
    const theme = themeContext.theme;

    async function openModalInProject() {
        if (!state.project) {
            const projectData = await projectService.showContent(props.project_id);
            setState({ ...state, project_id: props.project_id, project: projectData.project })
        }
    }

    useEffect(() => {
        if (props.currentState) {
            if (props.currentState !== TaskStates.PROJECT) {
                setState({ ...state, state: props.currentState.toString() })
            } else {
                openModalInProject();
            }
        }
    }, [props])


    function setValuesToEdit() {
        if (props.editingTask) {
            let fecha = 'Fecha'
            if (props.editingTask.date_limit) {
                fecha = new Date(props.editingTask.date_limit);
                fecha = `${fecha.getFullYear()}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}/${fecha.getDate().toString().padStart(2, '0')} ${fecha.getHours().toString().padStart(2, '0')}:${fecha.getMinutes().toString().padStart(2, '0')}`
            }
            setState({
                ...state,
                editedTitle: props.editingTask.title ? props.editingTask.title : '',
                editedDescription: props.editingTask.description ? props.editingTask.description : '',
                isImportant: props.editingTask.important_fixed ? props.editingTask.important_fixed : false,
                state: props.editingTask.state ? props.editingTask.state : "1",
                date_name: fecha,
                project_id: props.editingTask.project_id ? props.editingTask.project_id : null,
                project: props.editingTask.project_id ? { project_id: props.editingTask.project_id, title: props.editingTask.project_title, color: props.editingTask.project_color } : null,
                context_id: props.editingTask.context_id ? props.editingTask.context_id : null,
                context_name: props.editingTask.context_id ? props.editingTask.context_name : null,
                tags: props.editingTask.tags ? props.editingTask.tags : []
            })
            setcolorIndex(props.editingTask.tags ? props.editingTask.tags.length : 0)
        }
    }

    function addColor() {
        const color = colours[colorIndex];
        setcolorIndex((colorIndex + 1) === colours.length ? 0 : colorIndex + 1);
        return color;
    }

    const handleRemoveTag = (index) => {
        const updatedTags = [...state.tags];
        updatedTags.splice(index, 1);
        setState({ ...state, tags: updatedTags });
    };

    const Body = () => {
        const [title, setTitle] = useState(state.editedTitle);
        const [description, setDescription] = useState(state.editedDescription);

        const onAcceptFunction = (stateAux) => {
            const updatedTask = {};

            if (props.editingTask) {
                Object.keys(props.editingTask).forEach(key => {
                    if (props.editingTask[key] !== null) {
                        updatedTask[key] = props.editingTask[key];
                    }
                });
            }
            console.log("FECHA: ", state.date_name)
            if (state.date_name !== 'Fecha') updatedTask.date_limit = new Date(state.date_name.replace(/(\d{4})\/(\d{2})\/(\d{2}) (\d{2}:\d{2})/, '$1-$2-$3T$4:00'));
            else if (stateAux === "3") updatedTask.date_limit = today
            if (description !== '') updatedTask.description = description;
            if (state.context_name) updatedTask.context_id = state.context_id;
            updatedTask.title = title;
            if (state.tags.length !== 0) updatedTask.tags = state.tags;
            updatedTask.important_fixed = state.isImportant;
            updatedTask.state = stateAux;
            if (state.project) {
                updatedTask.project_id = state.project_id;
            }
            console.log("UPDATED TASK", updatedTask)
            props.onAccept(updatedTask);
        }

        const handleSelectState = (stateAux) => {
            setState({ ...state, state: stateAux });
            setShowStatusSelector(false);
        }

        const handleSelectProject = (project_id, project) => {
            setState({ ...state, project_id: project_id, project: project });
            setShowAssProjectSelector(false);
        }

        const handleContextAction = (context_id, context_name) => {
            setState({ ...state, context_id: context_id, context_name: context_name });
            setShowContextSelector(false);
        }
        const handleSearchedTag = (name, color) => {
            let newArray = state.tags
            if (!state.tags) newArray = [{ name: name, color: color }];
            else if (!state.tags.some(item => item.name === name)) { newArray.push({ name: name, color: color }) }
            setState({ ...state, tags: newArray });
            setShowTagSelector(false);
        }
        const handleSelectTag = (tag) => {
            let newArray = state.tags
            if (!state.tags) newArray = [{ name: tag, color: addColor() }];
            else if (!state.tags.some(item => item.name === tag)) {
                newArray.push({ name: tag, color: addColor() })
            }
            setState({ ...state, tags: newArray });
            setShowTagSelector(false);
        }

        const toggleImportant = () => {
            setState((prevState) => ({
                ...prevState,
                isImportant: !prevState.isImportant,
                editedTitle: title,
                editedDescription: description
            }));
        };

        const onDescriptionChange = (text) => {
            setDescription(text)
        };

        const onTitleChange = (text) => {
            setTitle(text)
        };

        const openDatePickerModal = () => {
            setState({ ...state, showDatePicker: true, editedTitle: title, editedDescription: description })
        }


        const ProjectBadgeSelectable = ({ project }) => {
            return (
                <TouchableOpacity onPress={() => {
                    const newState = { ...state, project_id: null }
                    setState(newState)
                }}>
                    <View style={[styles.selectionProjectPanel, {borderColor: project.color}]}>
                        <Text style={{ color: theme === 'light' ? '#272c34': Colors[theme].white, fontWeight: 600 }}>
                            <MaterialCommunityIcons name="circle-outline" size={14} color={project.color} /> {(project.title.length > 8 ? `${project.title.substring(0, 8)}...` : project.title)} <MaterialCommunityIcons name="close" size={14} color={project.color} />
                        </Text>
                    </View>
                </TouchableOpacity>
            )
        }

        const SelectProjectPanel = () => {
            return (
                <TouchableOpacity onPress={() => {
                    setState({ ...state, editedTitle: title, editedDescription: description })
                    setShowAssProjectSelector(true)
                }}>
                    <View style={styles.selectionProjectPanel}>
                        <Text style={{ color: 'lightgrey', fontWeight: 600 }}><MaterialCommunityIcons name="circle-outline" size={16} color='lightgrey' /> Proyecto</Text>
                    </View>
                </TouchableOpacity>
            )
        }

        return (
            <>
                {/* Title */}
                <View style={{ alignItems: 'flex-start', marginLeft: 20, marginRight: 8, height: '20%' }}>
                    <TextInput
                        style={{ color: theme === 'light' ? '#182E44': Colors[theme].white, fontSize: 23, fontWeight: '500', marginTop: 15, marginBottom: 10, width: '100%' }}
                        value={title}
                        placeholder="Nueva Tarea"
                        placeholderTextColor={theme === 'light' ? '#182E44' : Colors[theme].white}
                        onChangeText={onTitleChange}
                        onEndEditing={() => { console.log("THIS END") }}
                        maxLength={50}
                        multiline={true}
                    />
                </View>
                {/* Description */}
                <View style={{ height: '80%', justifyContent: 'flex-end' }}>
                    <View style={{ height: '100%', marginLeft: 20, marginRight: 8 }}>
                        <View style={styles.editStyle}>
                            <View style={{ height: '60%', width: '100%', flexDirection: 'column' }}>
                                <TextInput
                                    style={styles.textInput}
                                    value={description}
                                    placeholder="Descripcion..."
                                    placeholderTextColor={theme === 'light' ? '#182E44' : Colors[theme].white}
                                    onChangeText={onDescriptionChange}
                                    multiline={true}
                                    maxLength={200}
                                />
                                <ScrollView style={{ flexDirection: 'row', width: '100%' }} horizontal={true} showsHorizontalScrollIndicator={false}>
                                    {state.tags && Object.keys(state.tags).map((key, index) => (
                                        <View key={index} style={[styles.tags, { backgroundColor: state.tags[key].color }]}>
                                            <Text style={{ color: 'white', paddingBottom: 3 }}>{state.tags[key].name}</Text>
                                            <TouchableOpacity onPress={() => handleRemoveTag(index)}>
                                                <FontAwesome name="close" size={12} color="white" style={{ marginLeft: 3 }} />
                                            </TouchableOpacity>
                                        </View>
                                    ))}

                                </ScrollView>
                            </View>
                            <View style={{ height: '40%', width: '100%', flexDirection: 'column', marginTop: 10, justifyContent: 'flex-start' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <TouchableOpacity onPress={openDatePickerModal}>
                                        <Text style={{ color: '#a0a0a0' }}>
                                            <Ionicons name="calendar-outline" size={22} color="#a0a0a0" />
                                            &nbsp; {state.date_name}
                                        </Text>
                                    </TouchableOpacity>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: state.context_name ? '50%' : '30%' }}>
                                        <TouchableOpacity onPress={() => {
                                            setState({ ...state, editedTitle: title, editedDescription: description })
                                            setShowContextSelector(true)
                                        }}>
                                            {state.context_id ? (
                                                <ContextBadge context_name={state.context_name} handlePress={() => {
                                                    handleContextAction(null, state.context_name);
                                                }} />
                                            ) : (
                                                <FontAwesome5 name="user" size={22} color="#a0a0a0" />
                                            )}
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => {

                                        }}>
                                            <Text>
                                                <MaterialCommunityIcons name="file-document-outline" size={23} color="#a0a0a0" />
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={toggleImportant}>
                                            <Text>
                                                {state.isImportant ? (
                                                    <Ionicons name="flag" size={22} color="#be201c" />
                                                ) : (
                                                    <Ionicons name="flag-outline" size={22} color="#a0a0a0" />
                                                )}
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => {
                                            setState({ ...state, editedTitle: title, editedDescription: description });
                                            setShowTagSelector(true);
                                        }}>
                                            <Text>
                                                <MaterialCommunityIcons name="tag-outline" size={23} color="#a0a0a0" />
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 13 }}>
                                    <TouchableOpacity onPress={() => {
                                        setState({ ...state, editedTitle: title, editedDescription: description })
                                        setShowStatusSelector(true)
                                    }}>
                                        <Text style={{ fontSize: 18, color: Colors[theme].white }}>
                                            {
                                                (state.state === "2") ? (
                                                    <>
                                                        <FontAwesome5 name="bolt" size={20} color={'#ffd700'} />
                                                        &nbsp; Cuanto Antes
                                                    </>
                                                ) : (state.state === "3") ? (
                                                    <>
                                                        <Ionicons name="calendar-outline" size={20} color={'#008080'} />
                                                        &nbsp; Programada
                                                    </>
                                                ) : (state.state === "4") ? (
                                                    <>
                                                        <Entypo name="archive" size={20} color="#d2b48c" />
                                                        &nbsp; Archivadas
                                                    </>
                                                ) : (state.state === "1") ? (
                                                    <>
                                                        <FontAwesome5 name="inbox" size={20} color="#f39f18" />
                                                        &nbsp; Inbox
                                                    </>
                                                ) : (
                                                    <>
                                                        <MaterialCommunityIcons style={{ width: '15%' }} name="hexagon-slice-6" size={20} color={state.project.color} />
                                                        &nbsp; {state.project.title}
                                                    </>
                                                )
                                            }
                                        </Text>
                                    </TouchableOpacity>
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                        {state.project_id ? <ProjectBadgeSelectable project={state.project} /> : <SelectProjectPanel />}
                                    </View>

                                    <SelectStateModal modalVisible={showStatusSelector} handleSelectState={handleSelectState} onCloseModal={() => setShowStatusSelector(false)} />
                                    <SelectContextModal modalVisible={showContextSelector} handleContextAction={handleContextAction} onCloseModal={() => setShowContextSelector(false)} />
                                    <AssignToProjectModal modalVisible={showAssProjectSelector} handleSelectProject={handleSelectProject} onCloseModal={() => setShowAssProjectSelector(false)} />
                                    <AddTagModal modalVisible={showTagSelector} handleSelectTag={handleSelectTag} handleSearchedTag={handleSearchedTag} onCloseModal={() => setShowTagSelector(false)} />

                                    <TouchableOpacity
                                        style={styles.acceptButton}
                                        onPress={() => onAcceptFunction(state.state)}>
                                        <Text style={styles.acceptButtonText}>Aceptar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </>
        );
    }

    function onCloseModal() {
        props.setIsModalOpen(false);
        setState(
            {
                show: false,
                editedTitle: '',
                editedDescription: '',
                isImportant: false,
                date_name: 'Fecha',
                showDatePicker: false,
                state: "1",
                tags: []
            }
        )
    }

    return (
        <PopUpModal isModalOpen={props.isModalOpen} onCloseModal={onCloseModal} onShow={setValuesToEdit}>
            <KeyboardAvoidingView style={{ flex: 1, height: '100%' }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <Body />
                <DatePickerModal state={state} setState={setState} />
            </KeyboardAvoidingView>
        </PopUpModal>
    )
}

export default CreateTaskModal;