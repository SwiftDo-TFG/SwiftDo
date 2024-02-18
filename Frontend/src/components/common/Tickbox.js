import { TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { taskStyle } from "../../styles/globalStyles";
import Colors from "../../styles/colors";
const Checkbox = () => {

    return (
        <TouchableOpacity style={taskStyle.unCompleted}>
            {/* {isSelected && <MaterialCommunityIcons name={"check"} size={15} color={Colors.softGrey} />} */}
        </TouchableOpacity>
    )
}

export default Checkbox;