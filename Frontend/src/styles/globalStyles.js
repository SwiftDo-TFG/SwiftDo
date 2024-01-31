
import { StyleSheet } from "react-native";
import Colors from "./colors";

const buttonStyle = StyleSheet.create({
    container: {
        marginTop: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmButton:{
        width: '60%',
        borderRadius: 15,
        backgroundColor: Colors.noir,
        padding: 15,
        alignItems: 'center'
    },
    buttonText: {
        fontWeight: 'bold',
        textAlign: 'center',
        color: Colors.light,
        fontSize: 18
    }
})

const textStyle = StyleSheet.create({
    largeText: {
        fontSize: 28,
        textAlign: 'center',
        width: 300,
    },
    smallText: {
        fontSize: 12,
        fontWeight: 'bold' 
    },
    textError: {
        fontSize: 10,
        marginVertical: 5 ,
        color: 'white',
        textAlign: 'center',
        padding: 5,
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#FB6868'
    },
    linkText: {
        color: Colors.noir,
        textDecorationLine: 'underline'
    },
})

const formStyle = StyleSheet.create({
    container: {
        flex: 1,
        padding: 35,
    },
    textWrapper: {
        marginTop: -30,
        marginBottom: 30
    },
    textInput:{
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: "#EEEDED",
        borderRadius: 10,
        fontSize: 16,
        marginBottom: 14
    },
    loadingIndicator: {
        padding: 10
    },
    linkContainer:{
        flexDirection: 'row',
    },
})

export {formStyle, buttonStyle, textStyle}