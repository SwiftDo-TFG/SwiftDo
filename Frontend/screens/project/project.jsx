import React, { useState, useRef, useEffect, useContext } from "react";
import { View, Text, Animated } from "react-native";
import styles from "./project.styles";
import SelectableTask from "../inbox/selectableTask";
import projectService from "../../services/project/projectService";
import { MaterialCommunityIcons } from '@expo/vector-icons';

function Project() {
    const scrollY = useRef(new Animated.Value(0)).current;
    const ITEM_SIZE = 62; //Tamaño tarea + margin
    const [project_data, set_project_data] = React.useState({ title: "Proyecto 1", project_id: 1 },)
    React.useEffect(() => {
        const project = projectService.showContent(1);//aqui iria el id del project
        set_project_data({ title: "Proyecto 1", project_id: 1 })
    }, []);
    return ( //html aqui
        //div
        <View style={styles.project}>
            <Text style={styles.header}>
                <MaterialCommunityIcons style={styles.icon} name="hexagon-slice-6" size={26} color="red" />
                <Text style={styles.title}> {project_data.title} </Text>
            </Text>
            {/* <SelectableTask task={{ title: "Tarea 1", id: 1 }} selectedTasks={{ total: 0 }} /> */}
            <Animated.FlatList style={styles.tareas}
                data={[{ title: "Tarea 1", task_id: 1 }, { title: "Tarea 2", task_id: 2 }]}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                keyExtractor={(item) => item.task_id.toString()}
                renderItem={({ item, index }) => {
                    const inputRange = [-1, 0, ITEM_SIZE * index, ITEM_SIZE * (index + 2)]
                    const scale = scrollY.interpolate({
                        inputRange,
                        outputRange: [1, 1, 1, 0],
                        extrapolate: 'clamp',
                    })

                    const opacityinputRange = [-1, 0, ITEM_SIZE * index, ITEM_SIZE * (index + .5)]
                    const opacity = scrollY.interpolate({
                        inputRange: opacityinputRange,
                        outputRange: [1, 1, 1, 0],
                        extrapolate: 'clamp',
                    })

                    return (<SelectableTask
                        task={item}
                        //     onPress={() => toggleSelectTask(item.task_id)}
                        //     onDelete={deleteTask}
                        //     scale={scale}
                        //     opacity={opacity}
                        selectedTasks={{ total: 0 }}
                    //     showMovePopUp={showMovePopUp}
                    //     showEditPopUp={showEditPopUp}
                    />)
                }}
            // ItemSeparatorComponent={() => <Separator />}
            />
        </View>
    )
}
export default Project;