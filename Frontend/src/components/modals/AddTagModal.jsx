import { Modal, View, TextInput, TouchableOpacity, Text, TouchableWithoutFeedback, ScrollView, ActivityIndicator, useColorScheme } from "react-native"
import styles from '../../screens/tasks/actionScreen.styles'
import { useEffect, useState, useContext } from "react";
import { contextModalStyles } from '../../styles/globalStyles'
import contextService from "../../services/context/contextService";
import Colors from "../../styles/colors";
import { FontAwesome, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import taskService from "../../services/task/taskService";
import tagService from "../../services/tag/tagService";
import ThemeContext from "../../services/theme/ThemeContext";


const AddTagModal = (props) => {

    const [tag, setTag] = useState([]);
    const [search, setSearch] = useState([]);
    const [isSearching, setIsSearching] = useState(false)
    
    //Theme
    const themeContext = useContext(ThemeContext);
    // const theme = useColorScheme();
    const theme = themeContext.theme;


    const onNameChange = async (text) => {
        console.log("TESTING", tag, search, isSearching)
        if (text != tag && text.length > 0) {
            let t = text + '%'
            setIsSearching(true)
            let res = tagService.searchTags({ search: t });
            res.then(result => {
                setIsSearching(false)
                setSearch(result);
            })
        } else if (text.length === 0) {
            setSearch([]);
        }
        setTag(text)
        console.log(search);
    };
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
            onRequestClose={() => props.setState({ ...props.state, showTagSelector: false })}
        >
            <View style={styles.stateModalContainer}>
                <OutSide isModalOpen={props.modalVisible} onCloseModal={props.onCloseModal} />
                <View style={styles.modalStyle}>

                    <TextInput
                        style={{ color: theme === 'light' ? '#182E44': Colors[theme].white, fontSize: 16, fontWeight: 'normal', width: '100%', marginBottom: 10 }}
                        placeholder="Busca una etiqueta..."
                        placeholderTextColor={theme === 'light' ? '#182E44': Colors[theme].white}
                        value={tag}
                        onChangeText={onNameChange}
                        maxLength={15}
                        multiline={true}
                    />

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: '100%', alignItems: 'flex-end', marginBottom: 10 }}>
                        {search ? Object.keys(search).map((key, index) => (
                            <View key={index} style={[styles.tags, { backgroundColor: search[key].colour }]}>
                                <TouchableOpacity onPress={() => props.handleSearchedTag(search[key].name, search[key].colour)}>
                                    <Text style={{ color: 'white', paddingBottom: 3 }}>{search[key].name}</Text>
                                </TouchableOpacity>
                            </View>
                            // Modo oscuro adaptar
                        )) : <Text>No hay resultados para {tag}</Text>} 
                        {isSearching &&
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <ActivityIndicator size={"small"} />
                            </View>
                        }

                    </View>

                    {!isSearching && !search && tag.length > 0 && <View style={{alignItems: 'flex-end'}}>
                        <TouchableOpacity
                            style={styles.acceptButton}
                            onPress={() => props.handleSelectTag(tag)}>
                            <Text style={styles.acceptButtonText}>Crear Etiqueta</Text>
                        </TouchableOpacity>
                    </View>}
                </View>
            </View>
        </Modal >
    )
}


export default AddTagModal;