import { useState, useEffect, useContext } from "react";
import { Animated, View, TouchableWithoutFeedback, Modal, Dimensions, Text, useColorScheme, TouchableOpacity } from "react-native"
import { AntDesign } from '@expo/vector-icons';
import { filterModal } from "../../styles/globalStyles";
import Colors from "../../styles/colors";
import contextService from '../../services/context/contextService';
import projectService from '../../services/project/projectService';
import tagService from "../../services/tag/tagService";
import FilterContext from "../../services/filters/FilterContext";


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
    const [selectedContexts, setSelectedContexts] = useState([]);
    const [selectedProjects, setSelectedProjects] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    const theme = useColorScheme();
    const filterStyle = filterModal(theme);
    const filterContext = useContext(FilterContext);


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
            const dataTags = await tagService.getAllTags();
            setTags(dataTags);
        }
        animateModal()
        fetchProjects();
        getTags()
        console.log("ESTO ESTA CUANDO ABRRES FILTER MODAL", selectedProjects)

        if(filterContext.isFiltered){
            setSelectedContexts([...selectedContexts, filterContext.context_id])
        }

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
                toValue: Math.ceil(Object.keys(contexts).length / 3) * 24,
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
                toValue: Math.ceil(Object.keys(projects).length / 3) * 24,
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
                toValue: Math.ceil(Object.keys(tags).length / 4) * 25,
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

    const handleContextSelection = (context) => {
        if (selectedContexts.includes(context.context_id)) {
            // filterContext.clearFilter(context)
            setSelectedContexts(selectedContexts.filter(item => item !== context.context_id));
        } else {
            // filterContext.applyFilter(context)
            setSelectedContexts([...selectedContexts, context.context_id]);
        }
    };
    const handleProjectSelection = (project) => {
        if (selectedProjects.includes(project.project_id)) {
            setSelectedProjects(selectedProjects.filter(item => item !== project.project_id));
        } else {
            setSelectedProjects([...selectedProjects, project.project_id]);
        }
    };
    const handleTagsSelection = (tags) => {
        if (selectedTags.includes(tags.name)) {
            setSelectedTags(selectedTags.filter(item => item !== tags.name));
        } else {
            setSelectedTags([...selectedTags, tags.name]);
        }
    };


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

    function onCloseModal() {
        props.setIsModalOpen(false);
    }

    return (
        <Modal {...props} animationType={'fade'} transparent={true} visible={props.isModalOpen} onCloseModal={onCloseModal} >
            <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', height: '100%' }}>
                <Animated.View
                    style={{
                        transform: [{ translateY }],
                        backgroundColor: Colors[theme].themeColor,
                        width: '100%',
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        paddingHorizontal: 18,
                        paddingTop: 20,
                        maxHeight: dvHeight,
                        minHeight: dvHeight,
                        height: '100%'
                    }}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingLeft: 7, marginBottom: 10, height: '5%' }}>
                        <Text style={{ fontSize: 26, fontWeight: 'bold', color: Colors[theme].white }}>Filtros</Text>
                        <TouchableOpacity onPress={onCloseModal}>
                            <AntDesign name="closecircle" size={24} color={Colors[theme].softGrey} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: '87%' }}>
                        <TouchableOpacity onPress={() => toggleArea()}>
                            <View style={filterStyle.filterContainer}>
                                <Text style={[filterStyle.filterText, { color: (!mostrarAreas) ? Colors[theme].white : Colors[theme].orange }]}>Contextos</Text>
                                <Animated.View style={{ transform: [{ rotate: rotateIcon(iconRotationArea) }] }}>
                                    <AntDesign name="caretright" size={22} color={(!mostrarAreas) ? Colors[theme].white : Colors[theme].orange} />
                                </Animated.View>
                            </View>
                        </TouchableOpacity>
                        {mostrarAreas && (
                            <Animated.View style={[filterStyle.sectionContainer, { height: animatedHeightArea }]}>
                                {Object.keys(contexts).map((key, index) => (
                                    <View key={index} style={[filterStyle.tags, { flexBasis: '32.5%' }, selectedContexts.includes(contexts[key].context_id) && filterStyle.selectedTag]}>
                                        <TouchableOpacity onPress={() => {
                                            handleContextSelection(contexts[key])
                                        }}>
                                            <Text style={{ paddingBottom: 3 , color: Colors[theme].white}}>{contexts[key].name}</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </Animated.View>
                        )}
                        <View style={filterStyle.separator} />
                        <TouchableOpacity onPress={() => toggleProject()}>
                            <View style={filterStyle.filterContainer}>
                                {/* {selectedProjects.length > 0 ? '(' +selectedProjects.length + ')' : ''} */}
                                <Text style={[filterStyle.filterText, { color: (!mostrarProyectos) ? Colors[theme].white : Colors[theme].orange }]}>Proyectos</Text>
                                <Animated.View style={{ transform: [{ rotate: rotateIcon(iconRotationProject) }] }}>
                                    <AntDesign name="caretright" size={22} color={(!mostrarProyectos) ? Colors[theme].white : Colors[theme].orange} />
                                </Animated.View>
                            </View>
                        </TouchableOpacity>
                        {mostrarProyectos && (
                            <Animated.View style={[filterStyle.sectionContainer, { height: animatedHeightProject }]}>
                                {Object.keys(projects).map((key, index) => (
                                    <View key={index} style={[filterStyle.tags, { flexBasis: '32.5%', borderColor: (theme === 'light') ? projects[key].color : '#e3e4e5', backgroundColor: (theme === 'dark') ? projects[key].color : null }, selectedProjects.includes(projects[key].project_id) && filterStyle.selectedTag]}>
                                        <TouchableOpacity onPress={() => { handleProjectSelection(projects[key]) }}>
                                            <Text style={{ paddingBottom: 3, color: (theme === 'light') ? projects[key].color : 'white' }}>{(projects[key].title.length > 13) ? `${projects[key].title.substring(0, 10)}...` : projects[key].title}</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </Animated.View>
                        )}
                        <View style={filterStyle.separator} />
                        <TouchableOpacity onPress={() => toggleTags()}>
                            <View style={filterStyle.filterContainer}>
                                <Text style={[filterStyle.filterText, { color: (!mostrarTags) ? Colors[theme].white : Colors[theme].orange }]}>Etiquetas</Text>
                                <Animated.View style={{ transform: [{ rotate: rotateIcon(iconRotationTags) }] }}>
                                    <AntDesign name="caretright" size={22} color={(!mostrarTags) ? Colors[theme].white : Colors[theme].orange} />
                                </Animated.View>
                            </View>
                        </TouchableOpacity>
                        {mostrarTags && (
                            <Animated.View style={[filterStyle.sectionContainer, { height: animatedHeightTags }]}>
                                {Object.keys(tags).map((key, index) => (
                                    <View key={index} style={[filterStyle.tags, { backgroundColor: tags[key].colour, flexBasis: '24%' }, selectedTags.includes(tags[key].name) && filterStyle.selectedTag]}>
                                        <TouchableOpacity onPress={() => { handleTagsSelection(tags[key]) }}>
                                            <Text style={{ paddingBottom: 3, color: 'white' }}>{tags[key].name}</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </Animated.View>
                        )}
                        <View style={filterStyle.separator} />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 'auto', alignItems: 'flex-end', paddingBottom: 15 }}>
                        <TouchableOpacity onPress={() => {
                            const newContexts = [];

                            if(filterContext.isFiltered){
                                newContexts.push(filterContext.context_id);
                            }
                            
                            setSelectedContexts(newContexts)
                            setSelectedProjects([])
                            setSelectedTags([])
                            props.onAccept();
                            onCloseModal()
                        }}>
                            <View style={filterStyle.button}>
                                <Text style={{ color: '#b4b6b9' }}>Limpiar filtros</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            const newFilter = {...props.filerState};

                            if(selectedProjects.length !== 0){
                                newFilter.project_id = selectedProjects
                            }

                            if(selectedContexts.length !== 0){
                                newFilter.context_id = selectedContexts
                            }

                            if(selectedTags.length !== 0){
                                newFilter.tags = selectedTags
                            }

                            props.onAccept(newFilter);
                            onCloseModal()
                        }}>
                            <View style={[filterStyle.button, { backgroundColor: Colors[theme].orange }]}>
                                <Text style={{ color: 'white', fontWeight: 'bold' }}>Aplicar filtros</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    )
}

export default FilterModal;