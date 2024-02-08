
import ActionScreen from "../tasks/actionScreen";
import TaskStates from '../../utils/enums/taskStates'
import { View, Text } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import Colors from "../../styles/colors";
import styles from "./ActionCommon.styles";


function Inbox(props) {
    return (
        <ActionScreen {...props} state={TaskStates.INBOX} emptyIcon={<FontAwesome5 style={styles.emptyIcon} name="inbox" color={Colors.grey}/>}>
            <View style={styles.action}>
                <FontAwesome5 name="inbox" style={styles.iconAction} color={'#f39f18'} />
                <Text style={styles.actionTitle}>Inbox</Text>
            </View>
        </ActionScreen>
    )
}

export default Inbox;