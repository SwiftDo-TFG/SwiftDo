import { Modal, View, TouchableOpacity, Text, TouchableWithoutFeedback, ScrollView, useColorScheme, Platform, useWindowDimensions } from "react-native"
import styles from '../../screens/tasks/actionScreen.styles'
import { useEffect, useState, useContext } from "react";
import { contextModalStyles } from '../../styles/globalStyles'
import contextService from "../../services/context/contextService";
import Colors from "../../styles/colors";
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import ThemeContext from "../../services/theme/ThemeContext";


const SelectContextModal = (props) => {

    const [context, setContext] = useState([]);
    //Theme
    const themeContext = useContext(ThemeContext);
    const dimensions = useWindowDimensions();

    // const theme = useColorScheme();
    const theme = themeContext.theme;
    const contextModal = contextModalStyles(theme);
    useEffect(() => {
        async function fetchProjects() {
            const data = await contextService.showContextsByUser();
            console.log("Actions", data)
            setContext(data);
        }

        fetchProjects();
    }, [])

    const OutSide = ({ onCloseModal, isModalOpen }) => {
        const view = <View style={{ flex: 1, width: '100%' }} />;
        if (!isModalOpen) return view;
        return (
            <TouchableWithoutFeedback onPress={() => { onCloseModal() }} style={{ flex: 1, width: '100%' }}>
                {view}
            </TouchableWithoutFeedback>
        );
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.modalVisible}
            onRequestClose={() => props.setState({ ...props.state, showContextSelector: false })}
        >
            <View style={[styles.stateModalContainer, {backgroundColor: theme === 'dark' ? 'rgba(54, 49, 53, 0.5)' : 'rgba(0, 0, 0, 0.5)'}]}>
                <OutSide isModalOpen={props.modalVisible} onCloseModal={props.onCloseModal} />
                <View style={[styles.modalStyle, {backgroundColor: theme === 'light' ? 'white' : 'black', borderColor: theme === 'dark' ? Colors[theme].white : '', borderWidth: theme === 'dark' ? 0.5 : 0, width: (Platform.OS === 'web' && dimensions.width >= 768) ? '40%' : '100%',}]}>
                    <ScrollView>
                        {Object.keys(context).map((key, index) => (
                            <TouchableOpacity key={context[key].context_id} onPress={() => props.handleContextAction(context[key].context_id, context[key].name)}>
                                <View key={index} style={contextModal.context}>
                                <Text style={{fontSize: 16, marginLeft: 15, color: Colors[theme].white}}>
                                    <MaterialCommunityIcons name="home-city-outline" size={16} color={theme === 'light' ? '#272c34': Colors[theme].white} /> {context[key].name}
                                </Text>
                                {/* <AntDesign name="caretdown" size={16} color="#272c34" /> */}
                                </View>
                            </TouchableOpacity>
                        ))}
                        {/* <TouchableOpacity onPress={() => props.handleContextAction(null, null)}>
                            <View style={[contextModal.context, {backgroundColor: Colors.red, justifyContent: 'center'}]}>
                                <Text style={{ fontSize: 16, color: Colors.white, fontWeight: 'bold' }}>Borrar área</Text>
                            </View>
                        </TouchableOpacity> */}
                    </ScrollView>
                </View>
            </View>
        </Modal >
    )
}


export default SelectContextModal;