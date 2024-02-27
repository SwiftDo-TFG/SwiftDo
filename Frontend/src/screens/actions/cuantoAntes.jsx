
import ActionScreen from "../tasks/actionScreen";
import TaskStates from '../../utils/enums/taskStates'
import { View, Text } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import Colors from "../../styles/colors";
import { actStyle } from "../../styles/globalStyles";


function CuantoAntes(props) {
    return (
        <ActionScreen {...props} state={TaskStates.CUANTO_ANTES} emptyIcon={<FontAwesome5 style={actStyle.emptyIcon} name="bolt" color={Colors.grey}/>}>
            <View style={actStyle.action}>
                <FontAwesome5 name="bolt" style={actStyle.iconAction} color={'#ffd700'} />
                <Text style={actStyle.actionTitle}>Cuanto antes</Text>
            </View>
        </ActionScreen>
    )
}


export default CuantoAntes;