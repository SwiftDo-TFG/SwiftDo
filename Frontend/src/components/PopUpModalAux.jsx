import { FlatList, TextInput, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Animated, Modal, Dimensions, TouchableWithoutFeedback, View, Text } from 'react-native';
import styles from '../screens/tasks/actionScreen.styles'
import Modalize from 'react-native-modalize'
import { FontAwesome5, Ionicons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import DatePicker from './DatePicker';

const dvHeight = Dimensions.get('window').height;
const today = new Date();

function PopUpModal(props) {

    const [state, setState] = useState({
        translateY: new Animated.Value(dvHeight),
        show: false,
        editedTitle: '',
        editedDescription: '',
        isImportant: false,
        date_name: 'Fecha',
        showDatePicker: false,
        state: "1",
        showStatusSelector: false,
    })

    const [isEditingDescription, setIEditingDescription] = useState(false);
    const [isEditingTitle, setIsEditingTitle] = useState(false);

    const { touch, mode } = props;
    const { translateY } = state;

    useEffect(() => {
        animateModal()
    }, [props.isModalOpen]);

    const toggleImportant = () => {
        setState((prevState) => ({
            isImportant: !prevState.isImportant,
        }));
    };

    // componentDidUpdate(prevProps) {
    //     if (this.state.show !== prevProps.show) {
    //         this.animateModal();
    //     }
    // }

    function animateModal() {
        const { translateY } = state;
        const show = props.isModalOpen;
        
        Animated.timing(translateY, {
            toValue: show ? 0 : dvHeight,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }
    const onTitleChange = (text) => {
        setState({ ...state, editedTitle: text });
        setIEditingDescription(true)
    };
    const onDescriptionChange = (text) => {
        setState({ ...state, editedDescription: text });
        setIEditingDescription(true)
    };

    const todayDate = (date) => {
        return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} 00:00`;
    }

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
        props.onAccept(updatedTask);
        hide();
    }

    const handleSelectState = (stateAux) => {
        if (stateAux === "3") setState({ ...state, date_name: `${today.getFullYear()}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')} 00:00` })
        else setState({ ...state, date_name: 'Fecha' })
        console.log("STATE: ", state)
        setState({ ...state, state: stateAux, showStatusSelector: false });
    };

    const show = (task) => {
        console.log("SHOW MODAL LOCO",task)
        setState({ ...state, show: true });

        if (task) {
            setState({ ...state, editedTitle: task.title });
            if (task.description) {
                setState({ ...state, editedDescription: task.description });
            }
            setState({ ...state, isImportant: task.important_fixed })
            if (task.date_limit) {
                const dateLimit = new Date(task.date_limit)
                const formattedDate = `${dateLimit.getFullYear()}/${(dateLimit.getMonth() + 1).toString().padStart(2, '0')}/${dateLimit.getDate().toString().padStart(2, '0')} 00:00`;
                setState({ ...state, date_name: formattedDate });
            }
            setState({ ...state, state: task.state })
        }
    };

    const hide = () => {
        setState({ ...state, show: false, editedTitle: '', editedDescription: '', isImportant: false, date_name: 'Fecha', state: "1" });
        setIsEditingTitle(false);
        setIEditingDescription(false);
    };

    function OutSide(touch) {
        const view = <View style={{ flex: 1, width: '100%' }} />;
        if (!touch) return view;
        return (
            <TouchableWithoutFeedback onPress={touch} style={{ flex: 1, width: '100%' }}>
                {view}
            </TouchableWithoutFeedback>
        );
    }

    function ModalTitle(mode) {
        const { title } = props;
        console.log("MODAL TITLE", title, mode)
        return (
            <View style={(props.mode === 'edit' || props.mode === 'add') ? { alignItems: 'flex-start', marginLeft: 20, marginRight: 8 } : { alignItems: 'center' }}>
                {(props.mode === 'edit' || props.mode === 'add') ? (
                    <TextInput
                        style={{ color: '#182E44', fontSize: 23, fontWeight: '500', marginTop: 15, marginBottom: 10, width: '100%' }}
                        value={state.editedTitle}
                        placeholder="Nueva Tarea"
                        onChangeText={(text) => setState({...state, editedTitle: text})}
                        maxLength={50}
                        multiline={true}
                    />
                ) : (
                    <Text style={{ color: '#182E44', fontSize: 23, fontWeight: '500', marginTop: 15 }}>
                        {title}
                    </Text>
                )}
            </View>
        );
    }

    function ModalContent(props) {
        const { data } = props;
        return (
            <View style={{ height: '100%', justifyContent: 'flex-end' }}>
                <View style={{ height: '100%', marginLeft: 20, marginRight: 8 }}>
                <ModalItem mode={mode} item={data}/>
                </View>
            </View>
        );
    }

    function ModalItem() {
        return (
            <>
                {(props.mode === 'edit' || props.mode === 'add') ? (
                    <View style={styles.editStyle}>
                        <View style={{ height: '50%' }}>
                            <TextInput
                                style={{ fontSize: 16, fontWeight: 'normal', color: '#182E44', }}
                                value={state.editedDescription}
                                placeholder="Descripcion..."
                                onChangeText={(text)=>setState({...state, editedDescription: text})}
                                multiline={true}
                                maxLength={200}
                            />
                        </View>
                        <View style={{ height: '50%', width: '100%', flexDirection: 'column', marginTop: 10, justifyContent: 'flex-start' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TouchableOpacity onPress={() => setState({...state, showDatePicker: true })}>
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
                                    onRequestClose={() => setState({...state,  showStatusSelector: false })}
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
                ) : (
                    <View>
                        <View style={styles.moveContainer}>
                            <View style={styles.moveStyle}>
                                <TouchableOpacity onPress={() => {
                                    onAcceptFunction(item, "2");
                                }}>
                                    <View style={styles.textContainer}>
                                        <FontAwesome5 name="bolt" size={20} color={'#ffd700'} style={{ width: '15%' }} />
                                        <Text style={{ fontSize: 17 }}>Cuanto Antes</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    onAcceptFunction(item, "3");
                                }}>
                                    <View style={styles.textContainer}>
                                        <Ionicons name="calendar-outline" size={20} color={'#008080'} style={{ width: '15%' }} />
                                        <Text style={{ fontSize: 17 }}>Programada</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    onAcceptFunction(item, "4");
                                }}>
                                    <View style={styles.textContainer}>
                                        <Entypo name="archive" size={20} color="#d2b48c" style={{ width: '15%' }} />
                                        <Text style={{ fontSize: 17 }}>Archivadas</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    onAcceptFunction(item, "1");
                                }}>
                                    <View style={styles.textContainer}>
                                        <FontAwesome5 name="inbox" size={20} color="#f39f18" style={{ width: '15%' }} />
                                        <Text style={{ fontSize: 17 }}>Inbox</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            </>
        );
    }

    return (
        <Modal animationType={'fade'} transparent={true} visible={props.isModalOpen} onRequestClose={close} onShow={show}>
            <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' }}>
                <OutSide touch={touch} />
                <Animated.View
                    style={{
                        transform: [{ translateY }],
                        backgroundColor: '#FFFFFF',
                        width: '100%',
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        paddingHorizontal: 10,
                        justifyContent: 'space-between',
                        maxHeight: dvHeight * 0.4,
                        minHeight: dvHeight * 0.4,
                    }}
                >
                    <ModalTitle mode={mode} />
                    <ModalContent mode={mode} />
                </Animated.View>
                <Modal
                    transparent={true}
                    animationType={'fade'}
                    visible={state.showDatePicker}
                    onRequestClose={() => setState({ ...state, showDatePicker: false })}
                >
                    <View style={styles.modalDatePickerContainer}>

                        <TouchableWithoutFeedback onPress={() => setState({ ...state, showDatePicker: false })}>
                            <View style={styles.modalDatePickerBackground} />
                        </TouchableWithoutFeedback>

                        <View style={[styles.modalDatePickerContent, { zIndex: 2 }]}>
                            <DatePicker
                                today={today}
                                state={state}
                                setState={setState}
                            />
                        </View>
                    </View>
                </Modal>
            </View>
        </Modal>
    )
}

export default PopUpModal;