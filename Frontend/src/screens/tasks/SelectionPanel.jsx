import React, { useState, useContext } from "react";
import { View, Text, Animated, TouchableOpacity, useColorScheme } from "react-native";
import { FontAwesome5, Entypo, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeBaseProvider, VStack, Box, Menu, extendTheme, Checkbox, Icon } from "native-base";
import styles from './actionScreen.styles'
import Colors from "../../styles/colors";
import ThemeContext from "../../services/theme/ThemeContext";


function SelectionPanel (props){
    const [selectAll, setSelectAll] = useState(false);
    const themeContext = useContext(ThemeContext);
    // const theme = useColorScheme();
    const theme = themeContext.theme;
    
    const archiveSelectedTask = () => {
        props.setIsMoveModalOpen(true);
    }

    const deleteSelectedTask = () => {
        props.setIsCompleteModalOpen(true);
    }

    const toggleSelectAll = () => {
        let selecteds = props.selectedTasks;

        props.tasks.forEach(task => {
            selecteds[task.task_id] = !selectAll;
        });

        props.setSelectedTasks({ ...selecteds, total: !selectAll ? props.tasks.length : 0 })
        setSelectAll(!selectAll);
    };

    return (
        <VStack>
            <Box style={[styles.innerContainer, { marginBottom: 5 }]}>
                <Text style={{color:Colors[theme].white}}>({props.selectedTasks.total}) {props.selectedTasks.total > 1 ? 'tareas seleccionadas' : 'tarea seleccionada'} </Text>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => archiveSelectedTask()}>
                        <Entypo name="archive" size={20} color="#15ba53" style={{ marginRight: 15 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteSelectedTask()}>
                        <FontAwesome5 name="trash" size={20} color="red" style={[styles.trashIcon, { marginRight: 15 }]} />
                    </TouchableOpacity>
                    {/* <Menu
                        trigger={(triggerProps) => (
                            <TouchableOpacity {...triggerProps}>
                                <Entypo name="dots-three-vertical" size={20} color="#a0a0a0" />
                            </TouchableOpacity>
                        )}
                        style={styles.menuContainer}
                        placement="left"
                    >
                        <Menu.Item style={styles.menuItem} onPress={props.showMovePopUp}>Mover a</Menu.Item>
                    </Menu> */}
                </View>
            </Box>
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                <Text style={{color:Colors[theme].white}}>{selectAll ? 'Deseleccionar todo' : 'Seleccionar todo'}</Text>
                {props.tasks.length > 0 && (
                    <Checkbox
                        value={selectAll}
                        onChange={toggleSelectAll}
                        style={{ borderWidth: 0, padding: 0, backgroundColor: 'transparent' }}
                    >
                        <Icon style={{ marginLeft: -18 }} size={6} color="#f39f18" as={selectAll ? <MaterialCommunityIcons name="checkbox-multiple-marked-circle" /> : <MaterialCommunityIcons name="checkbox-multiple-blank-circle-outline" />} />
                    </Checkbox>
                )}
            </View>
        </VStack>
    )
}

export default SelectionPanel;