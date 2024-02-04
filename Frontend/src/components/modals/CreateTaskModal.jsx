import PopUpModal from "./PopUpModalPadre"
import { View, TextInput, TouchableOpacity, Modal, Text, TouchableWithoutFeedback } from "react-native"
import styles from '../../screens/tasks/actionScreen.styles'
import { useState, useEffect } from "react"
import { FontAwesome5, Ionicons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import DatePickerModal from "./DatePickerModal";
import SelectStateModal from "./SelectStateModal"



function CreateTaskModal(props) {
    const [state, setState] = useState({
        show: false,
        editedTitle: '',
        editedDescription: '',
        isImportant: false,
        date_name: 'Fecha',
        showDatePicker: false,
        state: "1",
        showStatusSelector: false,
    });

    function setValuesToEdit() {
        if (props.editingTask) {
            setState({
                ...state,
                editedTitle: props.editingTask.title ? props.editingTask.title : '',
                editedDescription: props.editingTask.description ? props.editingTask.description : '',
                isImportant: props.editingTask.important_fixed ? props.editingTask.important_fixed : false,
                state: props.editingTask.state ? props.editingTask.state : "1"
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
            updatedTask.title = title;
            updatedTask.important_fixed = state.isImportant;
            updatedTask.state = stateAux;
            console.log(updatedTask)
            props.onAccept(updatedTask);
        }

        const handleSelectState = (stateAux) => {
            setState({...state, state: stateAux, showStatusSelector: false}); 
        }

        const toggleImportant = () => {
            setState((prevState) => ({
                ...prevState,
                isImportant: !prevState.isImportant,
            }));
        };

        const onDescriptionChange = (text) => {
            //setState({ ...state, editedDescription: text })
            setDescription(text)
        };

        const onTitleChange = (text) => {
            // setState({ ...state, editedTitle: text })
            setTitle(text)
        };

        return (
            <>
                {/* Title */}
                <View style={{ alignItems: 'flex-start', marginLeft: 20, marginRight: 8 }}>
                    <TextInput
                        style={{ color: '#182E44', fontSize: 23, fontWeight: '500', marginTop: 15, marginBottom: 10, width: '100%' }}
                        value={title}
                        placeholder="Nueva Tarea"
                        onChangeText={onTitleChange}
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
                                    <TouchableOpacity onPress={() => setState({ ...state, showDatePicker: true })}>
                                        <Text style={{ color: '#a0a0a0' }}>
                                            <Ionicons name="calendar-outline" size={22} color="#a0a0a0" />
                                            &nbsp; {state.date_name}
                                        </Text>
                                    </TouchableOpacity>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '30%' }}>
                                        <TouchableOpacity>
                                            <Text>
                                                <FontAwesome5 name="user" size={22} color="#a0a0a0" />
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity>
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
                                    <TouchableOpacity onPress={() => setState({ ...state, showStatusSelector: true })}>
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
                                                ) : (
                                                    <>
                                                        <FontAwesome5 name="inbox" size={20} color="#f39f18" />
                                                        &nbsp; Inbox
                                                    </>
                                                )
                                            }
                                        </Text>
                                    </TouchableOpacity>
                                    
                                    <SelectStateModal state={state} setState={setState} handleSelectState={handleSelectState}/>

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
            <Body />
            <DatePickerModal state={state} setState={setState}/>
        </PopUpModal>
    )
}

export default CreateTaskModal;