import PopUpModal from "./PopUpModalPadre"
import { View, TextInput, TouchableOpacity, Modal, Text } from "react-native"
import styles from '../../screens/tasks/actionScreen.styles'
import { useState } from "react"
import { FontAwesome5, Ionicons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';


const Title = () => {
    return (
        <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#182E44', fontSize: 23, fontWeight: '500', marginTop: 15 }}>
                Mover a
            </Text>
        </View>
    )
}

const Body = () => {
    const onAcceptFunction = (item, stateAux) => {
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
        updatedTask.state = stateAux;
        console.log(updatedTask)
        props.onAccept(updatedTask);
        hide();
    }


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


    return (
        <View style={{ height: '100%', justifyContent: 'flex-end' }}>
            <View style={{ height: '100%', marginLeft: 20, marginRight: 8 }}>
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
            </View>
        </View>
    );
}


function MoveTaskModal(props) {


    return (
        <PopUpModal isModalOpen={props.isModalOpen}>
            <Title />
            <Body />
        </PopUpModal>
    )
}

export default MoveTaskModal;