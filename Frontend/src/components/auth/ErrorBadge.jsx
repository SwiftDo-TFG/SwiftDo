import { textStyles } from "../../styles/globalStyles";
import { Text, useColorScheme } from "react-native";

const ErrorBadge = ({ msg }) => {
    const theme = useColorScheme();
    const textStyle = textStyles(theme)
    return (
        <Text style={textStyle.textError}>{msg}</Text>
    )
}

export default ErrorBadge;