import { View, Image, ActivityIndicator } from "react-native";
import { useContext } from "react";
import ThemeContext from "../../services/theme/ThemeContext";


const SplashScreen = () => {
    const themeContext = useContext(ThemeContext);
    // const theme = useColorScheme();
    const theme = themeContext.theme;

    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme === 'dark' ? '#131720': ''}}>
            <Image
                style={{ width: 150, height: 150, borderRadius: 15, marginBottom: 20}}
                source={require('../../assets/icon.png')}
            />
            <ActivityIndicator size="large" />
        </View>
    )
}


export default SplashScreen;