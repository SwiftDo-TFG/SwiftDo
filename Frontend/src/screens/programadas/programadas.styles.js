import { StyleSheet, useColorScheme, Appearance } from "react-native";
import Colors from "../../styles/colors";

const theme = Appearance.getColorScheme()

const styles = StyleSheet.create({
    container:{
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 5,
        paddingBottom: 20,
        // backgroundColor: theme === 'dark' ? Colors[theme].themeColor: 'white'
    },
    taskContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    taskContainerFirst: {
        flex: 1,
        paddingHorizontal: 20,
        marginTop: 10,
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
        backgroundColor: Colors[theme].activeColor,
        fontSize: 16,
        color: theme ==='light' ? 'grey': Colors[theme].themeColor,
        textTransform: 'capitalize',
        // textDecorationLine: 'underline'
    },
    horizontalLine:{
        marginTop: 5,
        borderBottomColor: 'grey', borderBottomWidth: 0.5
    },
    selectionPanel:{ 
        paddingHorizontal: 20,
        paddingTop: 15
    },
    action: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '65%',
        marginVertical: 60,
        marginLeft: 20,
    },
    iconAction: {
        fontSize: 26,
        marginRight: 10,
        width: '20%',
        textAlign: 'center'
    },
    actionTitle: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    expandableCalendar: {
        borderRadius: 50,
        borderWidth: 1,
        borderColor: 'white',
        padding: 3,
        width: 30,
        height: 30,
        alignItems: 'center',
    },
    numTasksBadge: {
        borderRadius: 50,
        borderWidth: 1,
        borderColor: 'white',
        padding: 3,
        width: 15,
        height: 15,
        position: 'absolute',
        alignItems: 'center',
        right: -6,
        top: -5,
        backgroundColor: 'red',
        marginLeft: 10
    }
});

export default styles;
