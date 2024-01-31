import * as React from 'react'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    profileContainer: {
        flex: 1,
        flexDirection: 'column',
        width: '100%'
    },
    profileInfoContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    profile: {
        width: 88,
        height: 88,
        borderWidth: 2,
        borderColor: '#f2f2f2',
        borderRadius: 16,
    },
    profileInfo: {
        flex: 1,
        justifyContent: 'flex-start',
        marginLeft: 15
    },
    profileUser: {
        fontSize: 25,
        fontWeight: 'bold'
    },
    profileDate: {
        fontSize: 14,
        color: '#a9a9a9'
    },
    todasAreasContainer: {
        marginTop: 10,
        marginBottom: 15,
        backgroundColor: '#e3e4e5',
        paddingHorizontal: 22,
        paddingVertical: 5,
        borderRadius: 16,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    areasTitle: {
        fontWeight: 'bold',
        color: '#1d2129'
    },
    separator: {
        width: '100%',
        backgroundColor: '#e3e4e5',
        height: 2.5,
        marginVertical: 10,
        borderRadius: 50
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginVertical: 8
    },
    action: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '65%',
    },
    iconAction: {
        fontSize: 26,
        marginRight: 10,
        width: '20%',
        textAlign: 'center'
    },
    actionTitle: {
        fontSize: 17,
        fontWeight: 'bold'
    },
    countContainer:{
        flexDirection: 'row',
        width: '35%',
        justifyContent: 'flex-end'
    },
    count:{
        paddingHorizontal: 9,
        paddingVertical: 1,
        borderRadius: 10,
        marginLeft: 3
    }
});

export default styles;