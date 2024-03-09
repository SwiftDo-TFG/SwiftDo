import { StyleSheet, Dimensions } from "react-native";
import Colors from "../../styles/colors";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 5,
        paddingBottom: 20,
        backgroundColor: 'white'
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
    },
    innerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    trashIcon: {
        marginLeft: 'auto',
        marginRight: 10,
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
        marginBottom: 10,
    },
    leftSwipe: {
        backgroundColor: "#15ba53",
        alignItems: "center",
        justifyContent: "center",
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        width: '30%',
        marginBottom: 10,
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
    comfirmButtonText: {
        color: 'white',
        fontSize: 12,
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
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    stateModalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    assignProjectModalContainer: {
        flex: 1,
        justifyContent: "center",
        // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    confirmModalContainer: {
        flex: 1,
        justifyContent: "center"
        // maxHeight: 500
        // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalStyle: {
        backgroundColor: 'white',
        margin: 20,
        borderRadius: 16,
        paddingHorizontal: 30,
        paddingVertical: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        maxHeight: '25%'
    },
    moveContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    moveStyle: {
        backgroundColor: 'white',
        marginHorizontal: 20,
        paddingHorizontal: 12,
        paddingVertical: 12,
    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        width: '100%'
    },
    modalDatePickerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalDatePickerBackground: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalDatePickerContent: {
        backgroundColor: '#FFFFFF',
        width: '90%',
        borderRadius: 10,
        padding: 20,
    },
    closeDatePickerButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 2,
    },
    emptyListPanel: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyListPanelText: {
        fontSize: 12,
        color: Colors.grey
    },
    roundedPanel: {
        borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
        width: Dimensions.get('window').width * 0.5,
        height: Dimensions.get('window').width * 0.5,
        backgroundColor: Colors.softGrey,
        justifyContent: 'center',
        alignItems: 'center'
    },
    area: {
        borderRadius: 40,
        backgroundColor: 'lightgrey',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    textInput: {
        fontSize: 16,
        fontWeight: 'normal',
        color: '#182E44',
        height: '60%',
        width: '100%',
        marginBottom: 2
    },
    // TAGS
    tags: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 3,
        marginRight: 2,
        marginBottom: 2,
        height: '33%'
    },
    tagsOnTask:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 1.5,
        marginRight: 2,
        marginBottom: 3,
    }
});

export default styles;
