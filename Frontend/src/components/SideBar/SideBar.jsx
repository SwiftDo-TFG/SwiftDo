import * as React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView } from "@react-navigation/drawer";
import Profile from './Profile';
import { sideBar } from '../../styles/globalStyles';
import ActionScheme from './Actions';
import Colors from '../../styles/colors';
import taskService from '../../services/task/taskService';
import CustomButton from '../buttons/Button';

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

    const [username, setUsername] = React.useState([])
    const [caData, setCaData] = React.useState([])
    const [inboxData, setInboxData] = React.useState([])
    const [progData, setProgData] = React.useState([])
    const [archData, setArchData] = React.useState([])

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
    }, [])

    return (
        <DrawerContentScrollView style={sideBar.container}>
            <Profile name={username} formattedDate={formattedDate} />

            <Separator />
            <View style={sideBar.actionContainer}>
                <ActionScheme onPress={() => navigation.navigate('Inbox')} icon={"inbox"} iconColor={Colors.orange} text={"Entrada"} totalTasks={inboxData[0]?.total} importantTasks={inboxData[1]?.total} />
                <View style={sideBar.actionContainer}>
                    <ActionScheme icon={"play"} iconColor={Colors.dark} text={"Hoy"} />
                </View>

                <ActionScheme onPress={() => navigation.navigate('CuantoAntes')} icon={"bolt"} iconColor={Colors.yellow} text={"Cuanto Antes"} totalTasks={caData[0]?.total} importantTasks={caData[1]?.total} />
                <ActionScheme onPress={() => navigation.navigate('Programadas')} icon={"calendar"} iconColor={Colors.green} text={"Programadas"} totalTasks={progData[0]?.total} importantTasks={progData[1]?.total} />
                <ActionScheme onPress={() => navigation.navigate('Archivadas')} icon={"archive"} iconColor={Colors.brown} text={"Archivadas"} totalTasks={archData[0]?.total} importantTasks={archData[1]?.total} />

            </View>

            <Separator />
            <ActionScheme icon={"folder-open"} iconColor={Colors.noir} text={"Proyecto"} />
            {/* <ActionScheme onPress={() => navigation.navigate('Project')} icon={"folder-open"} iconColor={Colors.noir} text={"Proyecto"} />
            <ActionScheme onPress={() => navigation.navigate('Project')} icon={"folder-open"} iconColor={Colors.noir} text={"Proyecto"} />
            <ActionScheme onPress={() => navigation.navigate('Project')} icon={"folder-open"} iconColor={Colors.noir} text={"Proyecto"} />
            <ActionScheme onPress={() => navigation.navigate('Project')} icon={"folder-open"} iconColor={Colors.noir} text={"Proyecto"} />
            <ActionScheme onPress={() => navigation.navigate('Project')} icon={"folder-open"} iconColor={Colors.noir} text={"Proyecto"} />
            <ActionScheme onPress={() => navigation.navigate('Project')} icon={"folder-open"} iconColor={Colors.noir} text={"Proyecto"} />
            <ActionScheme onPress={() => navigation.navigate('Project')} icon={"folder-open"} iconColor={Colors.noir} text={"Proyecto"} />
            <ActionScheme onPress={() => navigation.navigate('Project')} icon={"folder-open"} iconColor={Colors.noir} text={"Proyecto"} />
            <ActionScheme onPress={() => navigation.navigate('Project')} icon={"folder-open"} iconColor={Colors.noir} text={"Proyecto"} /> */}

        </DrawerContentScrollView>

    )
}