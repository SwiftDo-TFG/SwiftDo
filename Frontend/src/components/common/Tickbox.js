import { TouchableOpacity, View, useColorScheme } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { taskStyles } from "../../styles/globalStyles";
import Colors from "../../styles/colors";
import { useContext } from "react";
import ThemeContext from "../../services/theme/ThemeContext";

const Checkbox = ({selected}) => {
    const themeContext = useContext(ThemeContext);
    // const theme = useColorScheme();
    const theme = themeContext.theme;
    const taskStyle = taskStyles(theme);
    return (
        <View style={selected ? taskStyle.completed : taskStyle.unCompleted}>
            {selected && <MaterialCommunityIcons name={"check"} size={15} color={Colors.softGrey} />}
        </View>
    )
}

export default Checkbox;