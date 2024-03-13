import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity, View, useColorScheme } from "react-native";
import { taskStyles } from "../../styles/globalStyles";
import Colors from "../../styles/colors";

const Checkbox = ({selected}) => {
    const theme = useColorScheme();
    const taskStyle = taskStyles(theme);
    return (
        <View style={selected ? taskStyle.completed : taskStyle.unCompleted}>
            {selected && <MaterialCommunityIcons name={"check"} size={15} color={Colors.softGrey} />}
        </View>
    )
}

export default Checkbox;