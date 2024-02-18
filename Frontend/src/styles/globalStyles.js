
import { StyleSheet } from "react-native";
import Colors from "./colors";


const sideBar = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: Colors.light
    },
    profileContainer: {
        padding: 2,
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        marginBottom: 5
    },
    profileImage: {
        width: 65,
        height: 65,
        borderWidth: 2,
        borderColor: '#f2f2f2',
        borderRadius: 15,
    },

    separator: {
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#e3e4e5',
        height: 2.5,
        marginVertical: 10,
        borderRadius: 50
    },
    actionContainer: { // estilo para el container de todos los actionScheme
        paddingTop: 20,
        paddingBottom: 20,
    },
    actionWrapper: { // Wrapper que estructura un solo actionScheme
        flexDirection: "row",
        justifyContent: 'flex-start',
        alignItems: 'center',
        // alignSelf: 'center',
        paddingTop: 10
    },
    actionText: {
        fontSize: 16.5,
        fontWeight: 'bold',
        color: '#272c34'
    },
    areaText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#272c34'
    },
    iconStyle: {
        fontSize: 22
    },
    iconWrapper: {
        width: 40,
        height: 35,
        justifyContent: 'center',
        alignItems: 'flex-start'
    },

    areaContainer: {
        marginVertical: 10,
        // backgroundColor: '#e3e4e5',
        paddingHorizontal: 22,
        // paddingVertical: 5,
        // borderRadius: 16,
        // shadowColor: '#000000',
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 4,
        // elevation: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    countContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '37%',
        marginTop: 10
    },
    count: {
        flexDirection: 'row',
        maxWidth: '50%',
        minWidth: '45%',
        justifyContent: 'center',
        paddingHorizontal: 10,
        borderRadius: 10,
    }
})
const buttonStyle = StyleSheet.create({
    container: {
        marginTop: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmButton: {
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
    },

})


const addButton = StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        bottom: 20,
        height: 50,
        width: 50,
        alignSelf: 'center',
        borderRadius: 100,
        backgroundColor: Colors.orange,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end'
    },
    buttonPressed: {
        transform: [{ scale: 1.4 }]
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    questionIcon: {
        marginTop: 20
    },
})

const textStyle = StyleSheet.create({
    largeText: {
        fontSize: 28,
        width: 300,
    },
    smallText: {
        fontSize: 12,
        fontWeight: 'bold'
    },
    textError: {
        fontSize: 10,
        marginVertical: 5,
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
        marginHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textWrapper: {
        alignSelf: 'center',
        marginTop: -30,
        marginBottom: 30
    },
    textInput: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: Colors.softGrey,
        borderRadius: 10,
        fontSize: 16,
        marginBottom: 14,

    },
    loadingIndicator: {
        padding: 10
    },
    linkContainer: {
        flexDirection: 'row',
    },
})

const taskStyle = StyleSheet.create({
    checkBox: {
        width: 15,
        height: 15,
        backgroundColor: Colors.dark,
        alignItems: 'center',
        justifyContent: 'center',
        // para ios
        shadowColor: Colors.noir,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2, // desenfocamos un poco la sombra
        elevation: 2, // para android
    },
    text: {
        fontSize: 15,
        fontWeight: 300,
        color: Colors.noir,
    }
})

const actStyle = StyleSheet.create({
    action: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 30,
    },
    iconAction: {
        fontSize: 30,
        marginLeft: 10,
        textAlign: 'center'
    },
    actionTitle: {
        fontSize: 28,
        marginLeft: 18,
        fontWeight: 'bold'
    },
    emptyIcon: {
        fontSize: 40
    },
    description: {
        color: Colors.dark,
        fontWeight: '600',
        marginVertical: 15
    }
})

export {
    actStyle,
    sideBar,
    addButton,
    formStyle,
    buttonStyle,
    textStyle
}