import { useState } from "react";
import { KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from "react-native";
import { AntDesign, Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { sidebarStyles } from "../../styles/globalStyles";
import styles from '../tasks/actionScreen.styles'
import Colors from "../../styles/colors";
import MarkdownEditor from "./markdownHandler";


const DetailScreen = ({ navigation, route }) => {
    const lastScreen = route.params.currentScreen
    const theme = useColorScheme()
    const sideBar = sidebarStyles(theme)
    const task = route.params.task
    const [editing, toggleEdit] = useState(false);
    const mdtext = route.params.task.description

    return (
        <SafeAreaView>
            <View style={{padding: 18}}>
                {/* TITLE + TAGS + CONTEXT */}
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <AntDesign name="left" size={20} color= {Colors[theme].white} />
                    </TouchableOpacity>
                    <View style={[style.contextContainer, {flexDirection: 'row'}]}>
                        <MaterialCommunityIcons name="home-city-outline" size={16} color={Colors[theme].white} />
                        <Text style={[style.textStyle, {color: Colors[theme].white}]}>
                            {task.context_name}
                        </Text>
                    </View>
                </View>
               
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20}}>
                    <Text style={[style.titleContainer, {color: Colors[theme].white}]}> {task.title} </Text>
                    <Ionicons name="flag" size={22} color= {task.important_fixed ? "#be201c": "transparent"} />
                </View>
               <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'flex-end', marginTop: 8 }}>
                        {task.tags && Object.keys(task.tags).map((key, index) => (
                        <View key={index} style={[styles.tagsOnTask, { backgroundColor: task.tags[key].color }]}>
                            <FontAwesome name="tag" size={10} color='white' style={{ marginRight: 3 }} />
                            <Text style={{ color:'white', paddingBottom: 3, fontSize: 12 }}>{task.tags[key].name}</Text>
                        </View>
                        ))}
                </View>
               
                
                
                <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignSelf: 'flex-end', marginBottom: 15}}>
                    {editing ? (<TouchableOpacity style={[{backgroundColor: Colors[theme].softGrey}, style.stopEditingButton]} onPress={() => toggleEdit(!editing)}>
                        <Text> Previsualizar </Text>
                    </TouchableOpacity>) : 
                    (<TouchableOpacity style={[{backgroundColor: Colors[theme].selectColor}, style.stopEditingButton]} onPress={() => toggleEdit(!editing)}>
                        <Text> Editar </Text>
                    </TouchableOpacity>)}
                </View>

                <View style={[sideBar.separator]} />
                
                {/* MARKDOWN */}
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    style={{height: '100%'}}>
                    <MarkdownEditor text={mdtext} editing={editing}/>
                </ScrollView>
               
            </View>
        </SafeAreaView>
    )
}


const style = StyleSheet.create({
    titleContainer: {
        fontSize: 30,
        fontWeight: "bold",
        maxWidth: "80%",
    },
    contextContainer : {
        borderRadius: 15, 
        backgroundColor: Colors.dark.orange,
        padding: 10,
    },
    textStyle: {
        fontWeight: "bold",
        marginLeft: 10,
    },
    stopEditingButton : {
        padding: 10,
        borderRadius: 10
    }, 
})

export default DetailScreen;