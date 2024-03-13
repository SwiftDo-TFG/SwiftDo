
import ActionScreen from "../tasks/actionScreen";
import TaskStates from '../../utils/enums/taskStates'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useColorScheme, View, Text } from "react-native";

import { actStyles } from "../../styles/globalStyles";
import Colors from "../../styles/colors";



function Inbox(props) {
    const theme = useColorScheme();
    const actStyle = actStyles(theme);

    return (
        <ActionScreen {...props} state={TaskStates.INBOX} emptyIcon={<FontAwesome style={actStyle.emptyIcon} name="inbox" color={Colors[theme].grey}/>}>
            <View style={actStyle.action}>
                <FontAwesome name="inbox" style={actStyle.iconAction} color={Colors[theme].orange} />
                <Text style={[actStyle.actionTitle, {color: Colors[theme].white} /*isDarkTheme ? {color: 'white'} : {color: 'black'}*/]}>{props.route.name}</Text>
            </View>
        </ActionScreen>
    )
}

export default Inbox;