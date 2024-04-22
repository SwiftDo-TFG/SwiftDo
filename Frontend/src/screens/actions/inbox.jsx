
import ActionScreen from "../tasks/actionScreen";
import TaskStates from '../../utils/enums/taskStates'
import { useColorScheme, View, Text, TouchableOpacity } from "react-native";
import { FontAwesome5, Feather } from '@expo/vector-icons';

import { actStyles } from "../../styles/globalStyles";
import Colors from "../../styles/colors";
import React from "react";
import SettingsModal from "../../components/modals/settings/SettingsModal";
import { useContext } from "react";
import ThemeContext from "../../services/theme/ThemeContext";

function Inbox(props) {
    const themeContext = useContext(ThemeContext);
    // const theme = useColorScheme();
    const theme = themeContext.theme;
    const actStyle = actStyles(theme);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = React.useState(false);


    return (
        <ActionScreen {...props} state={TaskStates.INBOX} emptyIcon={<FontAwesome5 style={actStyle.emptyIcon} name="inbox" color={Colors[theme].grey} />}>
            <View style={actStyle.action}>
                <TouchableOpacity onPress={() => { setIsSettingsModalOpen(true) }}>
                    <Feather name="settings" size={24} color={'#d2b48c'} />
                </TouchableOpacity>
                <FontAwesome5 name="inbox" style={actStyle.iconAction} color={Colors[theme].orange} />
                <Text style={[actStyle.actionTitle, { color: Colors[theme].white } /*isDarkTheme ? {color: 'white'} : {color: 'black'}*/]}>{props.route.name}</Text>
            </View>
            <SettingsModal isVisible={isSettingsModalOpen} setVisible={setIsSettingsModalOpen} />

        </ActionScreen>


    )
}

export default Inbox;