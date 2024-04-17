import { useState, useEffect } from "react";
import { Keyboard, TextInput, KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme, InputAccessoryView, Platform } from "react-native";
import { AntDesign, Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import styles from '../tasks/actionScreen.styles'
import Colors from "../../styles/colors";
import Markdown from 'react-native-markdown-display';
import ToolBar from "../../components/common/ToolBar";
import { MaterialIcons, Feather } from '@expo/vector-icons';



const DetailScreen = ({ navigation, route }) => {
    const lastScreen = route.params.currentScreen
    const theme = useColorScheme()
    const task = route.params.task
    console.log(route.params.task.description)
    const [editing, toggleEdit] = useState(false);
    const mdtext = route.params.task.description
    const inputAccessoryViewID = 'uniqueID';
    const initialText = mdtext === null ? '' : mdtext;
    const [content, setContent] = useState(initialText)
    useEffect(() =>{
        if(mdtext !== null)
            setContent(mdtext);
        else
            setContent('');
    }, [mdtext])
    const handlePress = () => {
        Keyboard.dismiss();
        toggleEdit(false)
    }

    // Estilos de markdown 
    const markdownStyle = {
        heading1:{
            fontSize: 32, 
            color: Colors[theme].white,
            fontFamily: 'Helvetica',
            fontWeight: 'bold',
        }, 
        heading2 : {
            fontSize: 24, 
            color: Colors[theme].white,
            fontFamily: '',
            fontWeight: 'bold'
        }, 
        heading3: {
            fontSize: 18, 
            color: Colors[theme].white,
            fontFamily: '',
            fontWeight: 'bold'
        },
        body: {fontSize: 14, fontWeight: '400', color: Colors[theme].white}, 
        link: {
            textDecorationLine: 'underline',
            color: Colors[theme].white
        },
    
    }






    return (
        <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : null}
                style={{ flex: 1 }}>
            <SafeAreaView style={{flex:1}}>
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
                </View>
                {/* Markdown && Edit Description */}
                <View style={{height: '55%'}}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignSelf: 'flex-end', margin: 15}}>
                        {/* Habilitamos la escritura */}
                        {!editing && <TouchableOpacity style={[{backgroundColor: Colors[theme].softGrey, position: 'absolute', right: 0}, style.stopEditingButton]} onPress={() => toggleEdit(true)}>
                            <Feather name="edit-3" size={24} color="black" />
                        </TouchableOpacity>}
                        {/* Bajamos el teclado y cancelamos la escritura */}
                        {editing && <TouchableOpacity style={[{backgroundColor: Colors[theme].softGrey, position: 'absolute', right: 0}, style.stopEditingButton]} onPress={handlePress}>
                        <MaterialIcons name="keyboard-hide" size={22} color="black" /> 
                        </TouchableOpacity>}
                        
                    </View>

                    {editing ? 
                    (
                        <TextInput 
                            style={{padding: 16, marginTop: 35, color: Colors[theme].white}}
                            inputAccessoryViewID={inputAccessoryViewID} 
                            onChangeText={setContent}
                            value={content}
                            multiline
                            placeholder="¡Prueba a añadir detalles a la tarea!"
        
                        />

                    ) : 
                    (
                        <View style={{ height: '125%', padding: 16, marginTop: 20}}>
                            <ScrollView
                                contentInsetAdjustmentBehavior="automatic"
                                style={{height: '100%'}}>
                                <Markdown style={markdownStyle}>{content}</Markdown>
                            </ScrollView>
                        </View>
                    )}
                    {
                        Platform.OS !== 'web' && (<InputAccessoryView nativeID={inputAccessoryViewID}><ToolBar/></InputAccessoryView>)
                    }
                </View>
            </SafeAreaView> 
        </KeyboardAvoidingView>
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