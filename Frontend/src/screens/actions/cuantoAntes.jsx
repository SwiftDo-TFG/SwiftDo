
import ActionScreen from "../tasks/actionScreen";
import TaskStates from '../../utils/enums/taskStates'
import { View, Text, useColorScheme } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Colors from "../../styles/colors";
import { actStyles } from "../../styles/globalStyles";
import PopUpModal from "../../components/modals/PopUpModal";
import { useState } from "react";

function CuantoAntes(props) {
    const theme = useColorScheme();
    const actStyle = actStyles(theme);

    return (
        <ActionScreen {...props} state={TaskStates.CUANTO_ANTES} emptyIcon={<FontAwesome style={actStyle.emptyIcon} name="bolt" color={Colors[theme].grey}/>}>
            <View style={actStyle.action}>
                <FontAwesome name="bolt" style={actStyle.iconAction} color={'#ffd700'} />
                <Text style={[actStyle.actionTitle, {color: Colors[theme].white}]}>Cuanto antes</Text>
            </View>
        </ActionScreen>
    )
}


export default CuantoAntes;