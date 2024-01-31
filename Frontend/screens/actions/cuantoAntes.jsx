
import ActionScreen from "../tasks/actionScreen";
import TaskStates from '../../utils/enums/taskStates'
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';


function Inbox(props) {
    return (
        <ActionScreen {...props} state={TaskStates.CUANTO_ANTES}>
            <View style={styles.action}>
                <FontAwesome5 name="bolt" style={styles.iconAction} color={'#ffd700'} />
                <Text style={styles.actionTitle}>Cuanto antes</Text>
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