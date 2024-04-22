
import ActionScreen from "../tasks/actionScreen";
import TaskStates from '../../utils/enums/taskStates'
import { View, Text, useColorScheme } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import Colors from "../../styles/colors";
import { actStyles } from "../../styles/globalStyles";
import ThemeContext from "../../services/theme/ThemeContext";
import { useContext } from "react";


function CuantoAntes(props) {
    const themeContext = useContext(ThemeContext);
    const theme = themeContext.theme;
    const actStyle = actStyles(theme);

    return (
        <ActionScreen {...props} state={TaskStates.CUANTO_ANTES} emptyIcon={<FontAwesome5 style={actStyle.emptyIcon} name="bolt" color={Colors[theme].grey}/>}>
            <View style={actStyle.action}>
                <FontAwesome5 name="bolt" style={actStyle.iconAction} color={'#ffd700'} />
                <Text style={[actStyle.actionTitle, {color: Colors[theme].white}]}>Cuanto antes</Text>
            </View>
        </ActionScreen>
    )
}


export default CuantoAntes;