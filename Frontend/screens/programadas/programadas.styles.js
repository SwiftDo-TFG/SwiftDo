import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    taskContainer: {
        flex: 1,
        paddingHorizontal: 15,
        marginVertical: 10
    },
    taskItem: {

    },
    customDay: {
        margin: 10,
        fontSize: 24,
        color: 'green'
    },
    dayItem: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        flex: 1
    },
    dateText: {
        fontWeight: 'bold',
        // fontSize: '120%'
    },
    section: {
        // backgroundColor: lightThemeColor,
        fontSize: 16,
        color: 'grey',
        textTransform: 'capitalize',
        // textDecorationLine: 'underline'
    },
    horizontalLine:{
        marginTop: 5,
        borderBottomColor: 'grey', borderBottomWidth: 0.5
    },
    selectionPanel:{
        paddingVertical: 5, 
        paddingHorizontal: 20
    }
});

export default styles;
