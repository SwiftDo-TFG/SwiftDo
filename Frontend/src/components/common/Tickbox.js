import { TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { taskStyle } from "../../styles/globalStyles";
import Colors from "../../styles/colors";

const Checkbox = ({selected}) => {

    return (
        <View style={selected ? taskStyle.completed : taskStyle.unCompleted}>
            {selected && <MaterialCommunityIcons name={"check"} size={15} color={Colors.softGrey} />}
        </View>
    )
}

export default Checkbox;