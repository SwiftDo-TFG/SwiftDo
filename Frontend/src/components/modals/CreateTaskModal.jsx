import PopUpModal from "./PopUpModal"
import { View, TextInput, TouchableOpacity, Modal, Text, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, ScrollView } from "react-native"
import styles from '../../screens/tasks/actionScreen.styles'
import { useState, useEffect } from "react"
import { FontAwesome5, Ionicons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import DatePickerModal from "./DatePickerModal";
import SelectStateModal from "./SelectStateModal"
import SelectContextModal from "./SelectContextModal";
import AssignToProjectModal from "./AsingToProjectModal";
import { MarkdownTextInput, MarkdownStyle} from '@expensify/react-native-live-markdown';





function CreateTaskModal(props) {
    const [state, setState] = useState({
        show: false,
        editedTitle: '',
        editedDescription: '',
        isImportant: false,
        date_name: 'Fecha',
        showDatePicker: false,
        state: "1"
    });

    const markdownStyle = {
        syntax: {
          color: 'gray',
        },
        link: {
          color: 'blue',
        },
        h1: {
          fontSize: 25,
          color: 'red'
        },
        h2: {
            fontSize: 18,
            color: 'green'
          },
        blockquote: {
          borderColor: 'gray',
          borderWidth: 6,
          marginLeft: 6,
          paddingLeft: 6,
        },
        code: {
          fontFamily: 'monospace',
          color: 'black',
          backgroundColor: 'lightgray',
        },
        pre: {
          fontFamily: 'monospace',
          color: 'black',
          backgroundColor: 'lightgray',
        },
        mentionHere: {
          color: 'green',
          backgroundColor: 'lime',
        },
        mentionUser: {
          color: 'blue',
          backgroundColor: 'cyan',
        },
      };

    //Modals state
    const [showStatusSelector, setShowStatusSelector] = useState(false);
    const [showContextSelector, setShowContextSelector] = useState(false)
    const [showAssProjectSelector, setShowAssProjectSelector] = useState(false)


    function setValuesToEdit() {
        if (props.editingTask) {
            let fecha = 'Fecha'
            if (props.editingTask.date_limit) {
                fecha = new Date(props.editingTask.date_limit);
                fecha = `${fecha.getFullYear()}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}/${fecha.getDate().toString().padStart(2, '0')} 00:00`
            }
            setState({
                ...state,
                editedTitle: props.editingTask.title ? props.editingTask.title : '',
                editedDescription: props.editingTask.description ? props.editingTask.description : '',
                isImportant: props.editingTask.important_fixed ? props.editingTask.important_fixed : false,
                state: props.editingTask.state ? props.editingTask.state : "1",
                date_name: fecha
            })
        }
    }

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
            if (state.context_id) updatedTask.context_id = state.context_id;
            updatedTask.title = title;
            updatedTask.important_fixed = state.isImportant;
            updatedTask.state = stateAux;
            if (state.project_id) {
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
            setState({ ...state, context_id: context_id, contex_name: context_name });
            setShowContextSelector(false);
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

        const ProjectBadge = ({ project }) => {
            return (
                <TouchableOpacity onPress={() => {
                    const { project, project_id, ...newState } = state
                    setState(newState)
                }}>
                    <View style={{ borderRadius: 100, borderWidth: 1, borderColor: project.color, paddingHorizontal: 6, backgroundColor: project.color }}>
                        <Text style={{ color: 'white' }}>{project.title} <MaterialCommunityIcons name="close" size={14} color="#FFFFFF" /></Text>
                    </View>
                </TouchableOpacity>
            )
        }

        return (
            <>
                {/* Title */}
                <View style={{ alignItems: 'flex-start', marginLeft: 20, marginRight: 8 }}>
                    <TextInput
                        style={{ color: '#182E44', fontSize: 23, fontWeight: '500', marginTop: 15, marginBottom: 10, width: '100%' }}
                        value={title}
                        placeholder="Nueva Tarea"
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
                                {/* <TextInput
                                    style={{ fontSize: 16, fontWeight: 'normal', color: '#182E44', }}
                                    value={description}
                                    placeholder="Descripcion..."
                                    onChangeText={onDescriptionChange}
                                    multiline={true}
                                    maxLength={200}
                                /> */}
                                {/* <MarkdownTextInput
                                    style={{ fontSize: 16, fontWeight: 'normal', color: '#182E44', height: '100%' }}
                                    value={description}
                                    placeholder="Descripcion..."
                                    onChangeText={onDescriptionChange}
                                    multiline={true}
                                    maxLength={200}
                                    markdownStyle={markdownStyle}
                                /> */}
                            </View>
                            <View style={{ height: '40%', width: '100%', flexDirection: 'column', marginTop: 10, justifyContent: 'flex-start' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10 }}>
                                    {state.project && <ProjectBadge project={state.project} />}
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <TouchableOpacity onPress={openDatePickerModal}>
                                        <Text style={{ color: '#a0a0a0' }}>
                                            <Ionicons name="calendar-outline" size={22} color="#a0a0a0" />
                                            &nbsp; {state.date_name}
                                        </Text>
                                    </TouchableOpacity>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '30%' }}>
                                        <TouchableOpacity onPress={() => {
                                            setState({ ...state, editedTitle: title, editedDescription: description })
                                            setShowContextSelector(true)
                                        }}>
                                            <Text>
                                                {state.contex_name ? (
                                                    state.contex_name
                                                ) : (
                                                    <FontAwesome5 name="user" size={22} color="#a0a0a0" />
                                                )}
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => {
                                            setState({ ...state, editedTitle: title, editedDescription: description })
                                            setShowAssProjectSelector(true)
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
                                        <TouchableOpacity>
                                            <Text>
                                                <MaterialCommunityIcons name="tag-outline" size={23} color="#a0a0a0" />
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'ceneter', marginTop: 13 }}>
                                    <TouchableOpacity onPress={() => {
                                        setState({ ...state, editedTitle: title, editedDescription: description })
                                        setShowStatusSelector(true)
                                    }}>
                                        <Text style={{ fontSize: 18 }}>
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

                                    <SelectStateModal modalVisible={showStatusSelector} handleSelectState={handleSelectState} onCloseModal={() => setShowStatusSelector(false)} />
                                    <SelectContextModal modalVisible={showContextSelector} handleContextAction={handleContextAction} onCloseModal={() => setShowContextSelector(false)} />
                                    <AssignToProjectModal modalVisible={showAssProjectSelector} handleSelectProject={handleSelectProject} onCloseModal={() => setShowAssProjectSelector(false)} />

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
    }

    return (
        <PopUpModal isModalOpen={props.isModalOpen} onCloseModal={onCloseModal} onShow={setValuesToEdit}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <Body />
                <DatePickerModal state={state} setState={setState} />
            </KeyboardAvoidingView>
        </PopUpModal>
    )
}

export default CreateTaskModal;