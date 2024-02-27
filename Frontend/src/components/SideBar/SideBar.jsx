import * as React from 'react';
import { View } from 'react-native';
import { DrawerContentScrollView } from "@react-navigation/drawer";
import Profile from './Profile';
import { sideBar } from '../../styles/globalStyles';
import ActionScheme from './Actions';
import Colors from '../../styles/colors';
import taskService from '../../services/task/taskService';
import AuthContext from '../../services/auth/context/authContext';
import ConfirmButton from '../common/ConfirmButton';
import { CommonActions } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import TaskStates from '../../utils/enums/taskStates';
import { useDrawerStatus } from '@react-navigation/drawer'


const Separator = () => {
    return (
        <View style={sideBar.separator} />
    )
}

const today = new Date();
const formattedDate = `${today.getDate()} de ${getMonthName(today.getMonth())} del ${today.getFullYear()}`;

function getMonthName(month) {
    const monthNames = ['Ene.', 'Feb.', 'Mar.', 'Abr.', 'May.', 'Jun.', 'Jul.', 'Ago.', 'Sep.', 'Oct.', 'Nov.', 'Dic.'];
    return monthNames[month];
}

export default ({ navigation }) => {
    const [username, setUsername] = React.useState('')
    const [caData, setCaData] = React.useState([])
    const [inboxData, setInboxData] = React.useState([])
    const [progData, setProgData] = React.useState([])
    const [archData, setArchData] = React.useState([])
    const [sideProjects, setSideProjects] = React.useState([]);
    const [sideContexts, setSideContexts] = React.useState([]);
    const authstate = React.useContext(AuthContext);

    const isDrawerOpen = useDrawerStatus() === "open";

    React.useEffect(() => {

        async function fetchData() {
            const userAndTasks = await taskService.getInfo();

            setUsername(userAndTasks.userName);
            setInboxData([userAndTasks.tasksInfo[TaskStates.INBOX].total, userAndTasks.tasksInfo[TaskStates.INBOX].important]);
            setCaData([userAndTasks.tasksInfo[TaskStates.CUANTO_ANTES].total, userAndTasks.tasksInfo[TaskStates.CUANTO_ANTES].important]);
            setProgData([userAndTasks.tasksInfo[TaskStates.PROGRAMADAS].total, userAndTasks.tasksInfo[TaskStates.PROGRAMADAS].important]);
            setArchData([userAndTasks.tasksInfo[TaskStates.ARCHIVADAS].total, userAndTasks.tasksInfo[TaskStates.ARCHIVADAS].important]);
            setSideProjects(userAndTasks.projects);
            setSideContexts(userAndTasks.contexts);

        }
        // const interval = setInterval(fetchData, 10000); // Llamada a fetchData cada 20 segundos
        // return () => clearInterval(interval); // Reseteamos el contador del intervalo
        if (isDrawerOpen) {
            // Drawer was focused
            fetchData();
            console.log("drawer focused", isDrawerOpen);
        }
        return () => {
            if (isDrawerOpen) {
                // Drawer was unfocused
                console.log("drawer was unfocused", isDrawerOpen);
            }
        };
    }, [isDrawerOpen])

    const progressIcon = (percentage) => {
        if (percentage === null)
            percentage = 0
        let slice = Math.ceil(percentage / 12.5);
        if (isNaN(slice)) slice = 0
        return slice !== 0 ? `circle-slice-${slice}` : "circle-outline";

    }

    function navigateFromProjectToProject(navigation, project) {
        navigation.dispatch(state => {
            const index = state.routes.findIndex(r => r.name === 'project');
            const routes = state.routes.slice(0, index + 1);

            routes.push({
                name: 'project',
                params: { project_id: project.project_id },
            })

            return CommonActions.reset({
                ...state,
                routes,
                index: routes.length - 1,
            });
        });
        navigation.closeDrawer();
    }

    const addProjects = () => {
        return sideProjects.map((project, i) => (
            <View key={i}>
                {/* <ActionScheme onPress={() => navigation.navigate(project.project_id)} icon={progressIcon(projectAttributes[i].completionPercentage)} type={'M'} iconColor={projectAttributes[i].color !== null ? projectAttributes[i].color : Colors.paper} text={project.title} /> */}
                <ActionScheme onPress={() => { navigateFromProjectToProject(navigation, project) }} icon={progressIcon(project.percentage)} type={'M'} iconColor={project.color !== null ? project.color : Colors.paper} text={project.title} />
            </View>

        ));

    };

    return (
        <View style={sideBar.container}>

            <DrawerContentScrollView showsVerticalScrollIndicator={false}>
                <Profile name={username} formattedDate={formattedDate} contexts={sideContexts} />
                <Separator />
                <View style={sideBar.actionContainer}>
                    <ActionScheme onPress={() => navigation.navigate('Inbox')} icon={"inbox"} iconColor={Colors.orange} text={"Entrada"} totalTasks={inboxData[0]} importantTasks={inboxData[1]} />
                    <ActionScheme icon={"play"} iconColor={Colors.dark} text={"Hoy"} />
                    <ActionScheme onPress={() => navigation.navigate('CuantoAntes')} icon={"bolt"} iconColor={Colors.yellow} text={"Cuanto Antes"} totalTasks={caData[0]} importantTasks={caData[1]} />
                    <ActionScheme onPress={() => navigation.navigate('Programadas')} icon={"calendar"} iconColor={Colors.green} text={"Programadas"} totalTasks={progData[0]} importantTasks={progData[1]} />
                    <ActionScheme onPress={() => navigation.navigate('Archivadas')} icon={"archive"} iconColor={Colors.brown} text={"Archivadas"} totalTasks={archData[0]} importantTasks={archData[1]} />
                </View>
                <Separator />

                {addProjects()}
            </DrawerContentScrollView>

            <ConfirmButton onPress={() => { navigation.closeDrawer(); authstate.signOut() }} text="Logout" />

        </View>


    )
}