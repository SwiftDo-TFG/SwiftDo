
import ActionScreen from "../tasks/actionScreen";
import { View, Text, useColorScheme } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import Colors from "../../styles/colors";
import { actStyles } from "../../styles/globalStyles";
import { useContext } from "react";
import ThemeContext from "../../services/theme/ThemeContext";

function Today(props) {
    const themeContext = useContext(ThemeContext);
    // const theme = useColorScheme();
    const theme = themeContext.theme;
    const actStyle = actStyles(theme);

    return (
        <ActionScreen {...props} state={0} emptyIcon={<FontAwesome5 name="play" style={[actStyle.emptyIcon]} color={Colors[theme].grey} />}>
            <View style={actStyle.action}>
                <FontAwesome5 name="play" style={[actStyle.iconAction]} color={"#515f8f"} />
                <Text style={[actStyle.actionTitle, { color: Colors[theme].white }]}>Hoy</Text>
            </View>
        </ActionScreen>
    )
}


export default Today;