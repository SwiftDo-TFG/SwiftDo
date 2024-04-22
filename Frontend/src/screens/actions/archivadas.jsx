
import ActionScreen from "../tasks/actionScreen";
import TaskStates from '../../utils/enums/taskStates'
import { View, Text, useColorScheme } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import Colors from "../../styles/colors";
import { actStyles } from "../../styles/globalStyles";
import { useContext } from "react";
import ThemeContext from "../../services/theme/ThemeContext";


function Archivadas(props) {
    const themeContext = useContext(ThemeContext);
    // const theme = useColorScheme();
    const theme = themeContext.theme;
    
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