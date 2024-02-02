import * as React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView } from "@react-navigation/drawer";
import userService from '../../services/user/userService';
import taskService from '../../services/task/taskService';
import Profile from './Profile';
import { sideBar } from '../../styles/globalStyles';
import ActionScheme from './Actions';
import Colors from '../../styles/colors';
import Inbox from '../../screens/actions/inbox';
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
    const [totalTask, setTotalTask] = React.useState([])
    const [fixedTask, setFixedTask] = React.useState([])
    React.useEffect(() => {
        async function fetchData() {
            const userInfo = await userService.getInfo(1);
            const labelTask = await taskService.getTasks()
            console.log("AQUI", labelTask.length)
            setUsername(userInfo.name)
        }
        fetchData();
    }, [])


    return (
            <DrawerContentScrollView style={sideBar.container}>
                <Profile name={username} formattedDate={formattedDate}/>
                
                <Separator  />
                <View style={sideBar.actionContainer}>
                    <ActionScheme onPress={() => navigation.navigate('Inbox')} icon={"inbox"} iconColor={Colors.orange} text={"Entrada"} />
                    <View style={sideBar.actionContainer}>
                        <ActionScheme onPress={() => navigation.navigate('Hoy')} icon={"play"} iconColor={Colors.dark} text={"Hoy"}/>
                    </View>
                    
                    <ActionScheme onPress={() => navigation.navigate('Cuanto antes')} icon={"bolt"} iconColor={Colors.yellow} text={"Cuanto Antes"}/>
                    <ActionScheme onPress={() => navigation.navigate('Programadas')} icon={"calendar"} iconColor={Colors.green} text={"Programadas"}/>
                    <ActionScheme onPress={() => navigation.navigate('Algun dia')} icon={"archive"} iconColor={Colors.brown} text={"Algún día"}/>

                </View>
                
                <Separator />
                <ActionScheme onPress={() => navigation.navigate('Project')} icon={"folder-open"} iconColor={Colors.noir} text={"Proyecto"}/>
                <ActionScheme onPress={() => navigation.navigate('Project')} icon={"folder-open"} iconColor={Colors.noir} text={"Proyecto"}/>
                <ActionScheme onPress={() => navigation.navigate('Project')} icon={"folder-open"} iconColor={Colors.noir} text={"Proyecto"}/>
                <ActionScheme onPress={() => navigation.navigate('Project')} icon={"folder-open"} iconColor={Colors.noir} text={"Proyecto"}/>
                <ActionScheme onPress={() => navigation.navigate('Project')} icon={"folder-open"} iconColor={Colors.noir} text={"Proyecto"}/>
                <ActionScheme onPress={() => navigation.navigate('Project')} icon={"folder-open"} iconColor={Colors.noir} text={"Proyecto"}/>
                <ActionScheme onPress={() => navigation.navigate('Project')} icon={"folder-open"} iconColor={Colors.noir} text={"Proyecto"}/>
                <ActionScheme onPress={() => navigation.navigate('Project')} icon={"folder-open"} iconColor={Colors.noir} text={"Proyecto"}/>
                <ActionScheme onPress={() => navigation.navigate('Project')} icon={"folder-open"} iconColor={Colors.noir} text={"Proyecto"}/>
                <ActionScheme onPress={() => navigation.navigate('Project')} icon={"folder-open"} iconColor={Colors.noir} text={"Proyecto"}/>
            </DrawerContentScrollView>
        
    )
}