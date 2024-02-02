import * as React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView } from "@react-navigation/drawer";
import Profile from './Profile';
import { sideBar } from '../../styles/globalStyles';
import ActionScheme from './Actions';
import Colors from '../../styles/colors';
import taskService from '../../services/task/taskService';
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
    const [normalTask, setNormalTask ] = React.useState([])
    const [importantTask, setimportantTask ] = React.useState([])
    React.useEffect(() => {
        async function fetchData() {
        const userAndTaks = await taskService.getInfo();
        // console.log("DATOS AQUI", userAndTaks)
            setUsername(userAndTaks.userName)
            setNormalTask(userAndTaks.task_inbox[0])
            setNormalTask(userAndTaks.task_ca[0])
            
            setNormalTask(userAndTaks.task_prog[0])
            
            setNormalTask(userAndTaks.task_arch[0])
            if(task_inbox[1] != null){
                setimportantTask(userAndTaks.task_inbox[1])
            }
            if(task_ca[1] != null){
                setimportantTask(userAndTaks.task_ca[1])
            }
            if(task_prog[1] != null){
                setimportantTask(userAndTaks.task_prog[1])
            }
            if(task_arch[1] != null){
                setimportantTask(userAndTaks.task_arch[1])
            }
            
            

        }
        fetchData();
    }, [])


    return (
            <DrawerContentScrollView style={sideBar.container}>
                <Profile formattedDate={formattedDate}/>
                
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