import PopUpModal from "./PopUpModalPadre"
import { View, TextInput, TouchableOpacity, Modal, Text } from "react-native"
import styles from '../../screens/tasks/actionScreen.styles'
import { FontAwesome5, Ionicons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';


function MoveTaskModal(props) {

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
        const onAcceptFunction = (stateAux) => {
            const updatedTask = {};
            
            Object.keys(props.editingTask).forEach(key => {
                if (props.editingTask[key] !== null) {
                    updatedTask[key] = props.editingTask[key];
                }
            });
    
            updatedTask.state = stateAux;
            if (stateAux === "3") updatedTask.date_limit = today
            console.log(updatedTask)
            props.onAccept(updatedTask);
        }
    
        return (
            <View style={{ height: '100%', justifyContent: 'flex-end' }}>
                <View style={{ height: '100%', marginLeft: 20, marginRight: 8 }}>
                    <View>
                        <View style={styles.moveContainer}>
                            <View style={styles.moveStyle}>
                                <TouchableOpacity onPress={() => {
                                    onAcceptFunction("2");
                                }}>
                                    <View style={styles.textContainer}>
                                        <FontAwesome5 name="bolt" size={20} color={'#ffd700'} style={{ width: '15%' }} />
                                        <Text style={{ fontSize: 17 }}>Cuanto Antes</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    onAcceptFunction("3");
                                }}>
                                    <View style={styles.textContainer}>
                                        <Ionicons name="calendar-outline" size={20} color={'#008080'} style={{ width: '15%' }} />
                                        <Text style={{ fontSize: 17 }}>Programada</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    onAcceptFunction("4");
                                }}>
                                    <View style={styles.textContainer}>
                                        <Entypo name="archive" size={20} color="#d2b48c" style={{ width: '15%' }} />
                                        <Text style={{ fontSize: 17 }}>Archivadas</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    onAcceptFunction("1");
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

export default MoveTaskModal;