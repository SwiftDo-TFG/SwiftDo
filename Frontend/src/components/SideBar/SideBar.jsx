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

export default ({ navigation, projectAttributes }) => {

    // const [projects, setProjects] = React.useState([])
    const [username, setUsername] = React.useState([])
    const [caData, setCaData] = React.useState([])
    const [inboxData, setInboxData] = React.useState([])
    const [progData, setProgData] = React.useState([])
    const [archData, setArchData] = React.useState([])
    const authstate = React.useContext(AuthContext);

    React.useEffect(() => {
        async function fetchData() {
            const userAndTasks = await taskService.getInfo();

            setUsername(userAndTasks.userName);
            setInboxData(userAndTasks.task_inbox);
            setCaData(userAndTasks.task_ca);
            setProgData(userAndTasks.task_prog);
            setArchData(userAndTasks.task_arch);
        }
        fetchData();
        const interval = setInterval(fetchData, 10000); // Llamada a fetchData cada 20 segundos

        return () => clearInterval(interval); // Reseteamos el contador del intervalo
    }, [])

    const progressIcon = (percentage) => {
        if (percentage === null)
            percentage = 0
        let slice = Math.ceil(percentage / 12.5);
        if (isNaN(slice)) slice = 0
        return slice !== 0 ? `circle-slice-${slice}` : "circle-outline";

    }
    const addProjects = () => {
        return projectAttributes.map((project, i) => (
            <View key={i}>
                {/* <ActionScheme onPress={() => navigation.navigate(project.project_id)} icon={progressIcon(projectAttributes[i].completionPercentage)} type={'M'} iconColor={projectAttributes[i].color !== null ? projectAttributes[i].color : Colors.paper} text={project.title} /> */}
                <ActionScheme onPress={() => navigation.navigate("project", {project_id: project.project_id})} icon={progressIcon(projectAttributes[i].completionPercentage)} type={'M'} iconColor={projectAttributes[i].color !== null ? projectAttributes[i].color : Colors.paper} text={project.title} />
            </View>

        ));

    };

    return (
        <View style={sideBar.container}>

            <DrawerContentScrollView showsVerticalScrollIndicator={false}>
                <Profile name={username} formattedDate={formattedDate} />
                <Separator />
                <View style={sideBar.actionContainer}>
                    <ActionScheme onPress={() => navigation.navigate('Inbox')} icon={"inbox"} iconColor={Colors.orange} text={"Entrada"} totalTasks={inboxData[0]?.total} importantTasks={inboxData[1]?.total} />
                    <ActionScheme icon={"play"} iconColor={Colors.dark} text={"Hoy"} />
                    <ActionScheme onPress={() => navigation.navigate('CuantoAntes')} icon={"bolt"} iconColor={Colors.yellow} text={"Cuanto Antes"} totalTasks={caData[0]?.total} importantTasks={caData[1]?.total} />
                    <ActionScheme onPress={() => navigation.navigate('Programadas')} icon={"calendar"} iconColor={Colors.green} text={"Programadas"} totalTasks={progData[0]?.total} importantTasks={progData[1]?.total} />
                    <ActionScheme onPress={() => navigation.navigate('Archivadas')} icon={"archive"} iconColor={Colors.brown} text={"Archivadas"} totalTasks={archData[0]?.total} importantTasks={archData[1]?.total} />
                </View>
                <Separator />

                {addProjects()}
            </DrawerContentScrollView>

            <ConfirmButton onPress={() => { navigation.closeDrawer(); authstate.signOut() }} text="Logout" />

        </View>


    )
}