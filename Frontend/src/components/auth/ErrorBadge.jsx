import { textStyle } from "../../styles/globalStyles";
import { Text } from "react-native";

const ErrorBadge = ({ msg }) => {
    return (
        <Text style={textStyle.textError}>{msg}</Text>
    )
}

export default ErrorBadge;