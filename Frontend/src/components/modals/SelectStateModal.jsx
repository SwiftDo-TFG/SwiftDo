import { Modal, View, TouchableOpacity, Text} from "react-native"
import styles from '../../screens/tasks/actionScreen.styles'
import { FontAwesome5, Ionicons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';


const SelectStateModal = (props) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.state.showStatusSelector}
            onRequestClose={() => props.setState({ ...props.state, showStatusSelector: false })}
        >
            <View style={styles.stateModalContainer}>
                <View style={styles.modalStyle}>
                    <TouchableOpacity onPress={() => props.handleSelectState("2")}>
                        <View style={styles.textContainer}>
                            <FontAwesome5 name="bolt" size={20} color={'#ffd700'} style={{ width: '15%' }} />
                            <Text style={{ fontSize: 17 }}>Cuanto Antes</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => props.handleSelectState("3")}>
                        <View style={styles.textContainer}>
                            <Ionicons name="calendar-outline" size={20} color={'#008080'} style={{ width: '15%' }} />
                            <Text style={{ fontSize: 17 }}>Programada</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => props.handleSelectState("4")}>
                        <View style={styles.textContainer}>
                            <Entypo name="archive" size={20} color="#d2b48c" style={{ width: '15%' }} />
                            <Text style={{ fontSize: 17 }}>Archivadas</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => props.handleSelectState("1")}>
                        <View style={styles.textContainer}>
                            <FontAwesome5 name="inbox" size={20} color="#f39f18" style={{ width: '15%' }} />
                            <Text style={{ fontSize: 17 }}>Inbox</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}


export default SelectStateModal;