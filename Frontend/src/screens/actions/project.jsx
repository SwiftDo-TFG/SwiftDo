import { Text, View } from "react-native";
import ActionScreen from "../tasks/actionScreen";
import {MaterialCommunityIcons, Feather} from '@expo/vector-icons';
import React from "react";
import projectService from "../../services/project/projectService";
import TaskStates from "../../utils/enums/taskStates";
import { actStyle } from "../../styles/globalStyles";

function Project(props) {
    
    const [projectData, setData] = React.useState([])
    React.useEffect(() => {
        async function fetchData() {
            const project = await projectService.showContent(props.route.params.id);
            setData(project);
            console.log("ID PROJECT, ", project)
        }
        fetchData();
    }, []);

    const progressIcon = () => {
        let slice = Math.ceil(projectData.percentage / 12.5);
        if(isNaN(slice)) slice = 0
        return slice !== 0 ? `circle-slice-${slice}` : "circle-outline";
    }
    return (
        <ActionScreen {...props} state={TaskStates.PROJECT} project_id={props.route.params.id}>
            <View style={actStyle.action} >
                <MaterialCommunityIcons name={progressIcon()} style={actStyle.iconAction} color={props.route.params.color} />
                <Text style={actStyle.actionTitle}>{props.route.name}</Text>
            </View>
            <Text style={actStyle.description}> {props.route.params.description === null ? "Descripcion" : props.route.params.description} </Text>
        </ActionScreen>
    )
}

export default Project;