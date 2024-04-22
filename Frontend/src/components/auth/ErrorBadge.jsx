import { textStyles } from "../../styles/globalStyles";
import { Text, useColorScheme } from "react-native";
import ThemeContext from "../../services/theme/ThemeContext";
import { useContext } from "react";

const ErrorBadge = ({ msg }) => {
    //Theme
    const themeContext = useContext(ThemeContext);
    // const theme = useColorScheme();
    const theme = themeContext.theme;
    const textStyle = textStyles(theme)
    return (
        <Text style={textStyle.textError}>{msg}</Text>
    )
}

export default ErrorBadge;