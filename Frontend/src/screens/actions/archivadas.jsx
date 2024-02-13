
import ActionScreen from "../tasks/actionScreen";
import TaskStates from '../../utils/enums/taskStates'
import { View, Text } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import Colors from "../../styles/colors";
import { actStyle } from "../../styles/globalStyles";



function Archivadas(props) {
    return (
        <ActionScreen {...props} state={TaskStates.ARCHIVADAS} emptyIcon={<FontAwesome5 style={actStyle.emptyIcon} name="archive" color={Colors.grey}/>}>
            <View style={actStyle.action}>
                <FontAwesome5 name="archive" style={actStyle.iconAction} color={'#d2b48c'} />
                <Text style={actStyle.actionTitle}>Algún día</Text>
            </View>
        </ActionScreen>
    )
}

export default Archivadas;