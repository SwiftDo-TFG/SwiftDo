
import ActionScreen from "../tasks/actionScreen";
import TaskStates from '../../utils/enums/taskStates'
import { View, Text } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Colors from "../../styles/colors";
import { actStyle } from "../../styles/globalStyles";



function Inbox(props) {
    return (
        <ActionScreen {...props} state={TaskStates.INBOX} emptyIcon={<FontAwesome style={actStyle.emptyIcon} name="inbox" color={Colors.grey}/>}>
            <View style={actStyle.action}>
                <FontAwesome name="inbox" style={actStyle.iconAction} color={Colors.orange} />
                <Text style={actStyle.actionTitle}>Inbox</Text>
            </View>
        </ActionScreen>
    )
}

export default Inbox;