
import ActionScreen from "../tasks/actionScreen";
import TaskStates from '../../utils/enums/taskStates'
import { View, Text } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import Colors from "../../styles/colors";
import styles from "./ActionCommon.styles";


function CuantoAntes(props) {
    return (
        <ActionScreen {...props} state={TaskStates.CUANTO_ANTES} emptyIcon={<FontAwesome5 style={styles.emptyIcon} name="bolt" color={Colors.grey}/>}>
            <View style={styles.action}>
                <FontAwesome5 name="bolt" style={styles.iconAction} color={'#ffd700'} />
                <Text style={styles.actionTitle}>Cuanto antes</Text>
            </View>
        </ActionScreen>
    )
}


export default CuantoAntes;