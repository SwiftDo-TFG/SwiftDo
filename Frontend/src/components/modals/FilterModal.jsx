import { useState, useEffect } from "react";
import { Animated, View, TouchableWithoutFeedback, Modal, Dimensions, Text, useColorScheme, TouchableOpacity } from "react-native"
import { AntDesign } from '@expo/vector-icons';
import { filterModal } from "../../styles/globalStyles";
import Colors from "../../styles/colors";
import contextService from '../../services/context/contextService';
import projectService from '../../services/project/projectService';
import tagService from "../../services/tag/tagService";


const dvHeight = Dimensions.get('window').height;

function FilterModal(props) {
    const [translateY, setTranslateY] = useState(new Animated.Value(dvHeight));
    const [contexts, setUserContext] = useState([]);
    const [projects, setProjects] = useState([]);
    const [tags, setTags] = useState([]);
    const [mostrarAreas, setMostrarAreas] = useState(false);
    const [iconRotationArea] = useState(new Animated.Value(0));
    const [animatedHeightArea] = useState(new Animated.Value(0));
    const [mostrarProyectos, setMostrarProyectos] = useState(false);
    const [iconRotationProject] = useState(new Animated.Value(0));
    const [animatedHeightProject] = useState(new Animated.Value(0));
    const [mostrarTags, setMostrarTags] = useState(false);
    const [iconRotationTags] = useState(new Animated.Value(0));
    const [animatedHeightTags] = useState(new Animated.Value(0));

    const theme = useColorScheme();
    const filterStyle = filterModal(theme);

    useEffect(() => {
        async function getAreas() {
            const userContext = await contextService.showContextsByUser();
            setUserContext(userContext);
        }
        getAreas()
        async function fetchProjects() {
            const data = await projectService.showProjectsByUser();
            setProjects(data);
        }
        async function getTags() {
            const dataTags = await tagService.getTags();
            setTags(dataTags);
            console.log(dataTags)
        }
        animateModal()
        fetchProjects();
        getTags()
    }, [props.isModalOpen])

    useEffect(() => {
        animateModal()
    }, [props.isModalOpen]);

    const toggleArea = () => {
        if (mostrarAreas) {
            Animated.timing(animatedHeightArea, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }).start(() => setMostrarAreas(!mostrarAreas));
            Animated.timing(iconRotationArea, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            setMostrarAreas(!mostrarAreas);
            Animated.timing(animatedHeightArea, {
                toValue: Math.ceil(Object.keys(contexts).length/3) * 22,
                duration: 300,
                useNativeDriver: false,
            }).start();
            Animated.timing(iconRotationArea, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }

    const toggleProject = () => {
        if (mostrarProyectos) {
            Animated.timing(animatedHeightProject, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }).start(() => setMostrarProyectos(!mostrarProyectos));
            Animated.timing(iconRotationProject, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            setMostrarProyectos(!mostrarProyectos);
            Animated.timing(animatedHeightProject, {
                toValue: Math.ceil(Object.keys(projects).length/3) * 22,
                duration: 300,
                useNativeDriver: false,
            }).start();
            Animated.timing(iconRotationProject, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }

    const toggleTags = () => {
        if (mostrarTags) {
            Animated.timing(animatedHeightTags, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }).start(() => setMostrarTags(!mostrarTags));
            Animated.timing(iconRotationTags, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            setMostrarTags(!mostrarTags);
            Animated.timing(animatedHeightTags, {
                toValue: Math.ceil(Object.keys(tags).length/4) * 22,
                duration: 300,
                useNativeDriver: false,
            }).start();
            Animated.timing(iconRotationTags, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }

    const rotateIcon = (iconRotation) => iconRotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '90deg'],
    });

    function animateModal() {
        // const { translateY } = translateY;
        const show = props.isModalOpen;

        Animated.timing(translateY, {
            toValue: show ? 0 : dvHeight,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }

    return (
        <Modal {...props} animationType={'fade'} transparent={true} visible={props.isModalOpen} onCloseModal={props.onCloseModal} >
            <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <Animated.View
                    style={{
                        transform: [{ translateY }],
                        backgroundColor: '#FFFFFF',
                        width: '100%',
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        paddingHorizontal: 18,
                        paddingTop: 20,
                        maxHeight: dvHeight,
                        minHeight: dvHeight,
                    }}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 7, marginBottom: 10 }}>
                        <Text style={{ fontSize: 26, fontWeight: 'bold' }}>Filtros</Text>
                        <TouchableOpacity onPress={() => { props.onCloseModal }}>
                            <AntDesign name="closecircle" size={24} color={Colors[theme].softGrey} />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => toggleArea()}>
                            <View style={filterStyle.filterContainer}>
                                <Text style={[filterStyle.filterText, { color: (!mostrarAreas) ? Colors[theme].white : Colors[theme].orange }]}>Contextos</Text>
                                <Animated.View style={{ transform: [{ rotate: rotateIcon(iconRotationArea) }]}}>
                                    <AntDesign name="caretright" size={22} color={(!mostrarAreas) ? Colors[theme].white : Colors[theme].orange} />
                                </Animated.View>
                            </View>
                        </TouchableOpacity>
                        {mostrarAreas && (
                            <Animated.View style={[filterStyle.sectionContainer, { height: animatedHeightArea }]}>
                                {Object.keys(contexts).map((key, index) => (
                                    <View key={index} style={[filterStyle.tags]}>
                                        <TouchableOpacity>
                                            <Text style={{paddingBottom: 3 }}>{contexts[key].name}</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </Animated.View>
                        )}
                        <View style={filterStyle.separator} />
                        <TouchableOpacity onPress={() => toggleProject()}>
                            <View style={filterStyle.filterContainer}>
                                <Text style={[filterStyle.filterText, { color: (!mostrarProyectos) ? Colors[theme].white : Colors[theme].orange }]}>Proyectos</Text>
                                <Animated.View style={{ transform: [{ rotate: rotateIcon(iconRotationProject) }] }}>
                                    <AntDesign name="caretright" size={22} color={(!mostrarProyectos) ? Colors[theme].white : Colors[theme].orange} />
                                </Animated.View>
                            </View>
                        </TouchableOpacity>
                        {mostrarProyectos && (
                            <Animated.View style={[filterStyle.sectionContainer, { height: animatedHeightProject }]}>
                                {Object.keys(projects).map((key, index) => (
                                    <View key={index} style={[filterStyle.tags, {borderColor: (theme === 'light') ? projects[key].color : '#e3e4e5', backgroundColor: (theme === 'dark') ? projects[key].color : null}]}>
                                        <TouchableOpacity>
                                            <Text style={{paddingBottom: 3, color: (theme === 'light') ? projects[key].color : 'white' }}>{(projects[key].title.length > 13 ) ? `${projects[key].title.substring(0, 10)}...` : projects[key].title}</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </Animated.View>
                        )}
                        <View style={filterStyle.separator} />
                        <TouchableOpacity onPress={() => toggleTags()}>
                            <View style={filterStyle.filterContainer}>
                                <Text style={[filterStyle.filterText, { color: (!mostrarTags) ? Colors[theme].white : Colors[theme].orange }]}>Etiquetas</Text>
                                <Animated.View style={{ transform: [{ rotate: rotateIcon(iconRotationTags) }]}}>
                                    <AntDesign name="caretright" size={22} color={(!mostrarTags) ? Colors[theme].white : Colors[theme].orange} />
                                </Animated.View>
                            </View>
                        </TouchableOpacity>
                        {mostrarTags && (
                            <Animated.View style={[filterStyle.sectionContainer, { height: animatedHeightTags }]}>
                                 {Object.keys(tags).map((key, index) => (
                                    <View key={index} style={[filterStyle.tags, {backgroundColor: tags[key].colour}]}>
                                        <TouchableOpacity>
                                            <Text style={{paddingBottom: 3, color:'white' }}>{tags[key].name}</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </Animated.View>
                        )}
                        <View style={filterStyle.separator} />
                    </View>
                </Animated.View>
            </View>
        </Modal>
    )
}

export default FilterModal;