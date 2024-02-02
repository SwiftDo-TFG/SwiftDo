import { FlatList, TextInput, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Animated, Modal, Dimensions, TouchableWithoutFeedback, View, Text } from 'react-native';
import styles from '../screens/tasks/actionScreen.styles'
import Modalize from 'react-native-modalize'
import { FontAwesome5, Ionicons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import DatePicker from 'react-native-modern-datepicker';


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
            <View style={(mode === 'edit' || mode === 'add') ? { alignItems: 'flex-start', marginLeft: 20, marginRight: 8 } : { alignItems: 'center' }}>
                {(mode === 'edit' || mode === 'add') ? (
                    <TextInput
                        style={{ color: '#182E44', fontSize: 23, fontWeight: '500', marginTop: 15, marginBottom: 10, width: '100%' }}
                        value={state.editedTitle}
                        placeholder="Nueva Tarea"
                        onChangeText={onTitleChange}
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
                {/* {mode === 'move' ? (
                    <FlatList
                        style={{ marginBottom: 20 }}
                        showsVerticalScrollIndicator={false}
                        data={data}
                        renderItem={({ item }) => this.renderItem(item, mode)}
                        extraData={data}
                        keyExtractor={(item, index) => index.toString()}
                        ItemSeparatorComponent={this.renderSeparator()}
                        contentContainerStyle={{ paddingBottom: 40 }}
                    />
                ) : (
                    <View style={{ height: '100%', marginLeft: 20, marginRight: 8 }}>
                        {this.renderItem(data[0], mode)}
                    </View>
                )} */}
            </View>
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
                                onSelectedChange={(date) => {
                                    if (date !== state.date_name) {
                                        if (state.date_name !== 'Fecha') setState({ ...state, showDatePicker: false })
                                        setState({ ...state, date_name: date, state: "3" });
                                    }
                                }}
                                selected={state.date_name === 'Fecha' ? today.toISOString().split('T')[0] : state.date_name}
                                current={state.date_name === 'Fecha' ? today.toISOString().split('T')[0] : state.date_name}
                                minimumDate={today.toISOString().split('T')[0]}
                                options={{
                                    backgroundColor: '#ffffff',
                                    textHeaderColor: '#666666',
                                    textDefaultColor: '#808080',
                                    selectedTextColor: 'white',
                                    mainColor: '#f39f18',
                                    textSecondaryColor: '#f39f18',
                                }}
                                configs={{
                                    dayNames: [
                                        "Domingo",
                                        "Lunes",
                                        "Martes",
                                        "Miércoles",
                                        "Jueves",
                                        "Viernes",
                                        "Sábado",
                                    ],
                                    dayNamesShort: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
                                    monthNames: [
                                        "Enero",
                                        "Febrero",
                                        "Marzo",
                                        "Abril",
                                        "Mayo",
                                        "Junio",
                                        "Julio",
                                        "Agosto",
                                        "Septiembre",
                                        "Octubre",
                                        "Noviembre",
                                        "Diciembre",
                                    ],
                                    hour: 'Hora',
                                    minute: 'Minuto',
                                    timeSelect: 'Aceptar',
                                    timeClose: 'Cerrar',
                                }}
                            />
                        </View>
                    </View>
                </Modal>
            </View>
        </Modal>
    )
}

export default PopUpModal;