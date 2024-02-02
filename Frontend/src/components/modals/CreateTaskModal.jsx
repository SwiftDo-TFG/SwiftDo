import PopUpModal from "./PopUpModalPadre"
import { View, TextInput, TouchableOpacity, Modal, Text } from "react-native"
import styles from '../../screens/tasks/actionScreen.styles'
import { useState } from "react"
import { FontAwesome5, Ionicons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';



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

    const [isEditingDescription, setIEditingDescription] = useState(false);
    const [isEditingTitle, setIsEditingTitle] = useState(false);

    const onAcceptFunction = (item, state) => {
        const updatedTask = {};
        Object.keys(item).forEach(key => {
            if (item[key] !== null) {
                updatedTask[key] = item[key];
            }
        });
        console.log("FECHA: ", state.date_name)
        if (state.date_name !== 'Fecha') updatedTask.date_limit = new Date(state.date_name.replace(/(\d{4})\/(\d{2})\/(\d{2}) (\d{2}:\d{2})/, '$1-$2-$3T$4:00'));
        else if (state === "3") updatedTask.date_limit = today
        if (state.editedDescription !== '') updatedTask.description = state.editedDescription;
        updatedTask.title = state.editedTitle;
        updatedTask.important_fixed = state.isImportant;
        updatedTask.state = state;
        console.log(updatedTask)
        // props.onAccept(updatedTask);
        props.onCloseModal();
    }

    const Title = () => {
        return (
            <View style={{ alignItems: 'flex-start', marginLeft: 20, marginRight: 8 }}>
                <TextInput
                    style={{ color: '#182E44', fontSize: 23, fontWeight: '500', marginTop: 15, marginBottom: 10, width: '100%' }}
                    // value={state.editedTitle}
                    placeholder="Nueva Tarea"
                    // onChangeText={(text) => setState({ ...state, editedTitle: text })}
                    maxLength={50}
                    multiline={true}
                />
            </View>
        )
    }
    
    const Body = () => {
        const toggleImportant = () => {
            setState((prevState) => ({
                ...prevState,
                isImportant: !prevState.isImportant,
            }));
        };
    
        return (
            <View style={{ height: '100%', justifyContent: 'flex-end' }}>
                <View style={{ height: '100%', marginLeft: 20, marginRight: 8 }}>
                    <View style={styles.editStyle}>
                        <View style={{ height: '50%' }}>
                            <TextInput
                                style={{ fontSize: 16, fontWeight: 'normal', color: '#182E44', }}
                                value={state.editedDescription}
                                placeholder="Descripcion..."
                                onChangeText={(text) => setState({ ...state, editedDescription: text })}
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
                                <Modal
                                    animationType="slide"
                                    transparent={true}
                                    visible={state.showStatusSelector}
                                    onRequestClose={() => setState({ ...state, showStatusSelector: false })}
                                >
                                    <View style={styles.modalContainer}>
                                        <View style={styles.modalStyle}>
                                            <TouchableOpacity onPress={() => handleSelectState("2")}>
                                                <View style={styles.textContainer}>
                                                    <FontAwesome5 name="bolt" size={20} color={'#ffd700'} style={{ width: '15%' }} />
                                                    <Text style={{ fontSize: 17 }}>Cuanto Antes</Text>
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => handleSelectState("3")}>
                                                <View style={styles.textContainer}>
                                                    <Ionicons name="calendar-outline" size={20} color={'#008080'} style={{ width: '15%' }} />
                                                    <Text style={{ fontSize: 17 }}>Programada</Text>
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => handleSelectState("4")}>
                                                <View style={styles.textContainer}>
                                                    <Entypo name="archive" size={20} color="#d2b48c" style={{ width: '15%' }} />
                                                    <Text style={{ fontSize: 17 }}>Archivadas</Text>
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => handleSelectState("1")}>
                                                <View style={styles.textContainer}>
                                                    <FontAwesome5 name="inbox" size={20} color="#f39f18" style={{ width: '15%' }} />
                                                    <Text style={{ fontSize: 17 }}>Inbox</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </Modal>
                                <TouchableOpacity
                                    style={styles.acceptButton}
                                    onPress={() => onAcceptFunction(item, state.state)}>
                                    <Text style={styles.acceptButtonText}>Aceptar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    function onCloseModal(){
        props.setIsModalOpen(false);
    }

    return (
        <PopUpModal isModalOpen={props.isModalOpen} onCloseModal={onCloseModal}>
            <Title />
            <Body />
        </PopUpModal>
    )
}

export default CreateTaskModal;