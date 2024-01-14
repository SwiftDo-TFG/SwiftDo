import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 5,
        paddingBottom: 5,
    },
    checkgroup: {
        flex: 1,
        flexDirection: 'row',
    },
    taskContainer: {
        padding: 10,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        marginBottom: 10,
        height: 52
    },
    innerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    trashIcon: {
        marginLeft: 'auto',
        marginRight: 10,
    },
    addButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: 'orange',
        borderRadius: 50,
        padding: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20,
    },
    modalInput: {
        padding: 5,
        borderWidth: 1,
        borderRadius: 5,
        margin: 10,
        backgroundColor: null,
        width: '80%',
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    button: {
        flex: 1,
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        margin: 5,
    },
    cancelButton: {
        backgroundColor: 'red',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
    rightSwipe: {
        backgroundColor: "red",
        justifyContent: "center",
        alignItems: "center",
        // borderTopLeftRadius: 10,
        // borderBottomLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        width: '30%',
        height: 52
    },
    leftSwipe: {
        backgroundColor: "#15ba53",
        alignItems: "center",
        // justifyContent: "center",
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        width: '30%',
        height: 52
    },
    menuContainer: {
        marginVertical: 10,
    },
    menuItem: {
        padding: 6,
        fontSize: 16,
    },
    editContainer: {
        flex: 1,
        justifyContent: 'space-between',
        marginLeft: 20,
    },
    moveContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    editStyle: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    editTextInput: {
        fontSize: 16,
        fontWeight: 'normal',
        color: '#182E44',
        borderBottomWidth: 1,
        borderColor: '#182E44',
        backgroundColor: 'red',
    },
    editButtonContainer: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'center',
        backgroundColor: 'blue',
    },
    moveStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    moveContent: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    moveText: {
        fontSize: 16,
        fontWeight: 'normal',
        color: '#182E44',
    },
    acceptButton: {
        backgroundColor: '#f39f18',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    acceptButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default styles;
