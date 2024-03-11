
import ActionScreen from "../tasks/actionScreen";
import TaskStates from '../../utils/enums/taskStates'
import { View, Text, useColorScheme } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import Colors from "../../styles/colors";
import { actStyles } from "../../styles/globalStyles";



function Archivadas(props) {
    const theme = useColorScheme();
    const actStyle = actStyles(theme);
    return (
        <ActionScreen {...props} state={TaskStates.ARCHIVADAS} emptyIcon={<FontAwesome5 style={actStyle.emptyIcon} name="archive" color={Colors[theme].grey}/>}>
            <View style={actStyle.action}>
                <FontAwesome5 name="archive" style={actStyle.iconAction} color={'#d2b48c'} />
                <Text style={[actStyle.actionTitle, {color: Colors[theme].white}]}>Archivadas</Text>
            </View>
        </ActionScreen>
    )
}

export default Archivadas;