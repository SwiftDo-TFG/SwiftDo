
import { useState, useEffect } from "react";
import { KeyboardAvoidingView, Pressable, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from "react-native";
import Markdown from 'react-native-markdown-display';
import Colors from "../../styles/colors";


const markdownStyle = () => {

    const theme = useColorScheme()
    return ({
        heading1:{
            fontSize: 32, 
            color: Colors[theme].white,
            fontFamily: 'Helvetica',
            fontWeight: 'bold'
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
        body: {fontSize: 14, fontWeight: '500', color: Colors[theme].white}, 
        link: {
            textDecorationLine: 'underline',
            color: Colors[theme].white
        },

    })
}






export default markdownStyle