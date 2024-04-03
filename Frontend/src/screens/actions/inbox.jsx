
import ActionScreen from "../tasks/actionScreen";
import TaskStates from '../../utils/enums/taskStates'
import { useColorScheme, View, Text } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';

import { actStyles } from "../../styles/globalStyles";
import Colors from "../../styles/colors";



function Inbox(props) {
    const theme = useColorScheme();
    const actStyle = actStyles(theme);
    
    return (
        <ActionScreen {...props} state={TaskStates.INBOX} emptyIcon={<FontAwesome5 style={actStyle.emptyIcon} name="inbox" color={Colors[theme].grey}/>}>
            <View style={actStyle.action}>
                <FontAwesome5 name="inbox" style={actStyle.iconAction} color={Colors[theme].orange} />
                <Text style={[actStyle.actionTitle, {color: Colors[theme].white} /*isDarkTheme ? {color: 'white'} : {color: 'black'}*/]}>{props.route.name}</Text>
            </View>
        </ActionScreen>
    )
}

export default Inbox;