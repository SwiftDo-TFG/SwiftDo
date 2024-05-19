import { View, Image, Text, SafeAreaView, Modal, TouchableWithoutFeedback } from "react-native";
import { useContext, useState } from "react";
import ThemeContext from "../../services/theme/ThemeContext";
import { formStyles, textStyles } from '../../styles/globalStyles';
import Colors from "../../styles/colors";
import ConfirmButton from "../../components/common/ConfirmButton";
import styles from "../tasks/actionScreen.styles";
import ConfigServer from "../../components/modals/settings/pages/ConfigServer";
import InitialConfigModal from "./InitialConfigModal";

const InitialConfigScreen = ({navigation}) => {
    const themeContext = useContext(ThemeContext);
    // const theme = useColorScheme();
    const theme = themeContext.theme;

    const textStyle = textStyles(theme);

    const [isServerModalVisible, setIsServerModalVisible] = useState(false)

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme === 'dark' ? '#131720' : '' }}>
            <SafeAreaView>
                <Text style={[textStyle.largeText, { fontWeight: 'bold', textAlign: 'center', color: Colors[theme].white, alignSelf: 'center', marginBottom: 15 }]}>
                    Bienvenido a SwiftDo
                </Text>
                <Image
                    style={{ width: 150, height: 150, borderRadius: 15, marginBottom: 20, alignSelf: 'center' }}
                    source={require('../../assets/icon.png')}
                />
                <Text style={[{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', color: Colors[theme].white, paddingHorizontal: 10 }]}>
                    Parece que no hay ningún servidor configurado
                </Text>
                <ConfirmButton onPress={() => {setIsServerModalVisible(true)}} text="Configurar Servidor" />
                <InitialConfigModal isVisible={isServerModalVisible} setVisible={setIsServerModalVisible} navigation={navigation}/>
            </SafeAreaView>
        </View>
    )
}



export default InitialConfigScreen;