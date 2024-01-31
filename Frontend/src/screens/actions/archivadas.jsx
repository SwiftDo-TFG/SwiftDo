
import ActionScreen from "../tasks/actionScreen";
import TaskStates from '../../utils/enums/taskStates'
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';


function Archivadas(props) {
    return (
        <ActionScreen {...props} state={TaskStates.ARCHIVADAS}>
            <View style={styles.action}>
                <FontAwesome5 name="archive" style={styles.iconAction} color={'#d2b48c'} />
                <Text style={styles.actionTitle}>Algún día</Text>
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

export default Archivadas;