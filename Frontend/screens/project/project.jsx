import React, { useState, useRef, useEffect, useContext } from "react";
import { View, Text, Animated } from "react-native";
import styles from "./project.styles";
import SelectableTask from "../tasks/selectableTask";
import projectService from "../../services/project/projectService";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TaskList from "../tasks/TaskList";
import { NativeBaseProvider } from "native-base";
function Project() {
    const scrollY = useRef(new Animated.Value(0)).current;
    const ITEM_SIZE = 62; //Tamaño tarea + margin
    const [project_data, set_project_data] = React.useState({ title: "Proyecto 1", project_id: 1 },)
    const [tasks, set_tasks] = React.useState([])
    React.useEffect(() => {
        async function fetchData() {
            const project = await projectService.showContent(1);//aqui iria el id del project
            set_project_data(project.project);
            set_tasks(project.tasks);
            console.log(project.tasks);
        }
        fetchData();
    }, []);
    return ( //html aqui
        //div
        <View style={styles.project}>
            <Text style={styles.header}>
                <MaterialCommunityIcons style={styles.icon} name="hexagon-slice-6" size={26} color="red" />
                <Text style={styles.title}> {project_data.title} </Text>
            </Text>
            <NativeBaseProvider>
                <View style={styles.header}>
                    <TaskList tasks={tasks} />
                </View>
            </NativeBaseProvider>
        </View>
    )
}
export default Project;