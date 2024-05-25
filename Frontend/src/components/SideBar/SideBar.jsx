import * as React from 'react';
import { View, useColorScheme, TouchableOpacity, Text } from 'react-native';
import { DrawerContentScrollView } from "@react-navigation/drawer";
import Profile from './Profile';
import { sidebarStyles } from '../../styles/globalStyles';
import ActionScheme from './Actions';
import Colors from '../../styles/colors';
import taskService from '../../services/task/taskService';
import AuthContext from '../../services/auth/context/authContext';
import ConfirmButton from '../common/ConfirmButton';
import { CommonActions } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import TaskStates from '../../utils/enums/taskStates';
import { useDrawerStatus } from '@react-navigation/drawer'
import { useWindowDimensions } from 'react-native';
import deviceStorage from '../../offline/deviceStorage';

import { useContext } from 'react';
import ThemeContext from '../../services/theme/ThemeContext';
import { FontAwesome5, Feather } from '@expo/vector-icons';
import OfflineContext from '../../offline/offlineContext/OfflineContext';


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
    const dimensions = useWindowDimensions();

    //Theme
    const themeContext = useContext(ThemeContext);
    // const theme = useColorScheme();
    const theme = themeContext.theme;
    const sideBar = sidebarStyles(theme)

    //Offline
    const offlineContext = useContext(OfflineContext);
    const [userAndTasks, setUserAndTasks] = React.useState({})


    if (dimensions.width >= 768 && !isDrawerOpen) {
        navigation.openDrawer();
    }

    React.useEffect(() => {
        console.log("THIS IS THE OFFLINE CONTEXTT", offlineContext.catchedContent)
        async function fetchData() {
            let userAndTasks = await taskService.getInfo();

            if (userAndTasks.error && userAndTasks.error.status === 'timeout') {
                // const offlineSidebar = await deviceStorage.getSidebarData();
                const userAndTasksOffline = getOfflineDataSideBar();
                if (Object.keys(userAndTasksOffline).length !== 0) {
                    userAndTasks = userAndTasksOffline;
                    setDataInSidebar(userAndTasks)
                } else {
                    userAndTasks = {};
                }
            } else {
                setDataInSidebar(userAndTasks)
                offlineContext.updateSideBarCatcheData(userAndTasks);
                // deviceStorage.storeSidebarData(userAndTasks);
            }
            // offlineContext.storeCatchedIndevice(offlineContext.catchedContent, userAndTasks);
        }

        const setDataInSidebar = (userAndTasks) => {
            setUsername(userAndTasks.userName);
            setInboxData([userAndTasks.tasksInfo[TaskStates.INBOX].total, userAndTasks.tasksInfo[TaskStates.INBOX].important]);
            setCaData([userAndTasks.tasksInfo[TaskStates.CUANTO_ANTES].total, userAndTasks.tasksInfo[TaskStates.CUANTO_ANTES].important]);
            setProgData([userAndTasks.tasksInfo[TaskStates.PROGRAMADAS].total, userAndTasks.tasksInfo[TaskStates.PROGRAMADAS].important]);
            setArchData([userAndTasks.tasksInfo[TaskStates.ARCHIVADAS].total, userAndTasks.tasksInfo[TaskStates.ARCHIVADAS].important]);
            setSideProjects(userAndTasks.projects);
            setSideContexts(userAndTasks.contexts);
            setUserAndTasks(userAndTasks);
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


    const getOfflineDataSideBar = () => {
        console.log("THIS IS WHAT WE GET FROM CATCHED SIDEBAR", offlineContext.catchedSidebarData)
        return offlineContext.catchedSidebarData;
    }

    const progressIcon = (percentage) => {
        if (percentage === null)
            percentage = 0
        let slice = Math.ceil(percentage / 12.5);
        if (isNaN(slice)) slice = 0
        return slice !== 0 ? `circle-slice-${slice}` : "circle-outline";

    }

    function navigateFromProjectToProject(navigation, project) {
        navigation.dispatch(state => {
            console.log("PROJECT NAVIGATION", state, project)
            const index = state.routes.findIndex(r => r.name === 'project');
            const routes = state.routes.slice(0, index + 1);

            routes.push({
                name: 'project',
                params: { ...project },
            })

            console.log("PROJECT NAVIGATION END", routes)

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
                <ActionScheme onPress={() => {
                    offlineContext.storeCatchedIndevice(offlineContext.catchedContent, userAndTasks, offlineContext.nextNewIndex);
                    navigateFromProjectToProject(navigation, project)
                }} icon={progressIcon(project.percentage)} type={'M'} iconColor={project.color !== null ? project.color : Colors.paper} text={project.title} />
            </View>
        ));
    };

    const navigateToScreen = (key) => {
        // if(!offlineContext.isOffline){
        offlineContext.storeCatchedIndevice(offlineContext.catchedContent, userAndTasks, offlineContext.nextNewIndex);
        // }else{
            // console.log("WE ARE NOT STORING ANYTHING IN DEVICE")
        // }
        navigation.navigate(key);
    }

    return (
        <View style={sideBar.container}>

            <DrawerContentScrollView showsVerticalScrollIndicator={false}>
                <Profile name={username} formattedDate={formattedDate} contexts={sideContexts} navigation={navigation} />
                <View style={sideBar.separator} />
                <View style={sideBar.actionContainer}>
                    <ActionScheme onPress={() => navigateToScreen('Inbox')} icon={"inbox"} iconColor={Colors[theme].orange} text={"Entrada"} totalTasks={inboxData[0]} importantTasks={inboxData[1]} />
                    <ActionScheme onPress={() => navigateToScreen('Today')} icon={"play"} iconColor={"#515f8f"} text={"Hoy"} />
                    <ActionScheme onPress={() => navigateToScreen('CuantoAntes')} icon={"bolt"} iconColor={Colors[theme].yellow} text={"Cuanto Antes"} totalTasks={caData[0]} importantTasks={caData[1]} />
                    <ActionScheme onPress={() => navigateToScreen('Programadas')} icon={"calendar"} iconColor={Colors[theme].green} text={"Programadas"} totalTasks={progData[0]} importantTasks={progData[1]} />
                    <ActionScheme onPress={() => navigateToScreen('Archivadas')} icon={"archive"} iconColor={Colors[theme].brown} text={"Archivadas"} totalTasks={archData[0]} importantTasks={archData[1]} />
                </View>
                <View style={sideBar.separator} />

                {addProjects()}
            </DrawerContentScrollView>

            {/* <ConfirmButton onPress={() => { navigation.closeDrawer(); authstate.signOut() }} text="Logout" /> */}
            <TouchableOpacity onPress={() => { themeContext.openSettingsModal() }} >
                <Feather name="settings" size={26} color={'#d2b48c'} />
            </TouchableOpacity>
        </View>


    )
}