import PopUpModal from "./PopUpModal"
import { View, TextInput, TouchableOpacity, Modal, Text, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, ScrollView } from "react-native"
import styles from '../../screens/tasks/actionScreen.styles'
import { useState, useEffect } from "react"
import { FontAwesome5, Ionicons, MaterialCommunityIcons, Entypo, AntDesign } from '@expo/vector-icons';
import DatePickerModal from "./DatePickerModal";
import SelectStateModal from "./SelectStateModal"
import SelectContextModal from "./SelectContextModal";
import AssignToProjectModal from "./AsingToProjectModal";
import AddTagModal from "./AddTagModal";

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

    //Modals state
    const [showStatusSelector, setShowStatusSelector] = useState(false);
    const [showContextSelector, setShowContextSelector] = useState(false)
    const [showAssProjectSelector, setShowAssProjectSelector] = useState(false)
    const [showTagSelector, setShowTagSelector] = useState(false)


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
                date_name: fecha,
                project_id: props.editingTask.project_id ? props.editingTask.project_id : null,
                project: props.editingTask.project_id ? { project_id: props.editingTask.project_id, title: props.editingTask.project_title, color: props.editingTask.project_color } : null,
                context_id: props.editingTask.context_id ? props.editingTask.context_id : null,
                context_name: props.editingTask.context_id ? props.editingTask.context_name : null,
                tag_name: props.editingTask.tag_name,
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
            setState({ ...state, context_id: context_id, context_name: context_name });
            setShowContextSelector(false);
        }

        const handleSelectTag = (tag) => {
           // setState({ ...state, tag: tag });
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
                    const { project, project_id, ...newState } = state
                    setState(newState)
                }}>
                    <View style={{ borderRadius: 100, borderWidth: 1, borderColor: project.color, paddingHorizontal: 6, backgroundColor: 'white' }}>
                        <Text style={{ color: '#272c34', fontWeight: 600 }}>
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
                    <View style={{ borderRadius: 100, borderWidth: 1, borderColor: 'lightgrey', paddingHorizontal: 6, backgroundColor: 'white' }}>
                        <Text style={{ color: 'lightgrey', fontWeight: 600 }}><MaterialCommunityIcons name="circle-outline" size={16} color='lightgrey' /> Proyecto</Text>
                    </View>
                </TouchableOpacity>
            )
        }

        const ContextBadge = ({ context_name }) => {
            return (
                <TouchableOpacity onPress={() => {
                    handleContextAction(null, null);
                }}>
                    <View style={{ borderRadius: 5, borderWidth: 1, borderColor: 'grey', paddingLeft: 2, backgroundColor: 'white' }}>
                        <Text style={{ marginRight: 5 }}>
                            <MaterialCommunityIcons name="home-city-outline" size={14} color="#272c34" /> {context_name} <MaterialCommunityIcons name="close" size={14} color="#272c34" />
                            {/* <AntDesign name="caretdown" size={14} color="#272c34" /> */}
                        </Text>
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
                <View style={{ height: '100%', justifyContent: 'flex-end' }}>
                    <View style={{ height: '100%', marginLeft: 20, marginRight: 8 }}>
                        <View style={styles.editStyle}>
                            <View style={{ height: '50%' }}>
                                <TextInput
                                    style={{ fontSize: 16, fontWeight: 'normal', color: '#182E44', }}
                                    value={description}
                                    placeholder="Descripcion..."
                                    onChangeText={onDescriptionChange}
                                    multiline={true}
                                    maxLength={200}
                                />
                            </View>
                            <View style={{ height: '50%', width: '100%', flexDirection: 'column', marginTop: 10, justifyContent: 'flex-start' }}>
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
                                            {state.context_name ? (
                                                <ContextBadge context_name={state.context_name} />
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
                                        <TouchableOpacity onPress={()=>{
                                            setShowTagSelector(true);
                                        }}>
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
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                        {state.project ? <ProjectBadgeSelectable project={state.project} /> : <SelectProjectPanel />}
                                    </View>

                                    <SelectStateModal modalVisible={showStatusSelector} handleSelectState={handleSelectState} onCloseModal={() => setShowStatusSelector(false)} />
                                    <SelectContextModal modalVisible={showContextSelector} handleContextAction={handleContextAction} onCloseModal={() => setShowContextSelector(false)} />
                                    <AssignToProjectModal modalVisible={showAssProjectSelector} handleSelectProject={handleSelectProject} onCloseModal={() => setShowAssProjectSelector(false)} />
                                    <AddTagModal modalVisible={showTagSelector} handleSelectTag={handleSelectTag} onCloseModal={() => setShowTagSelector(false)} />

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