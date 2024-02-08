
import ActionScreen from "../tasks/actionScreen";
import TaskStates from '../../utils/enums/taskStates'
import { View, Text } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import Colors from "../../styles/colors";
import styles from "./ActionCommon.styles";


function Archivadas(props) {
    return (
        <ActionScreen {...props} state={TaskStates.ARCHIVADAS} emptyIcon={<FontAwesome5 style={styles.emptyIcon} name="archive" color={Colors.grey}/>}>
            <View style={styles.action}>
                <FontAwesome5 name="archive" style={styles.iconAction} color={'#d2b48c'} />
                <Text style={styles.actionTitle}>Algún día</Text>
            </View>
        </ActionScreen>
    )
}

export default Archivadas;