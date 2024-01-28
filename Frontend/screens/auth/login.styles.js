import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginTop: 75
    },
    title: {
        fontSize: 30,
        textAlign: 'center',
        marginBottom: 40
    },
    formTitle: {
        fontSize: 20,
        marginBottom: 10
    },
    textInput:{
        padding: 5,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 5
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
    loadingIndicator: {
        padding: 10
    },
    linkContainer:{
        marginBottom: 15,
    },
    linkText: {
        color: 'grey',
        textDecorationLine: 'underline'
    }
})

export default styles;
