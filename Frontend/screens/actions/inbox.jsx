
import ActionScreen from "../tasks/actionScreen";
import TaskStates from '../../utils/enums/taskStates'
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';


function Inbox(props) {
    return (
        <ActionScreen {...props} state={TaskStates.INBOX}>
            <View style={styles.action}>
                <FontAwesome5 name="inbox" style={styles.iconAction} color={'#f39f18'} />
                <Text style={styles.actionTitle}>Inbox</Text>
            </View>
        </ActionScreen>
    )
}

const styles = StyleSheet.create({

    action: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '65%',
        marginVertical: 60,
        marginLeft: 20
    },
    iconAction: {
        fontSize: 26,
        marginRight: 10,
        width: '20%',
        textAlign: 'center'
    },
    actionTitle: {
        fontSize: 24,
        fontWeight: 'bold'
    }
})

export default Inbox;