
import { StyleSheet } from "react-native";
import Colors from "./colors";


const sidebarStyles = (theme) => {

    return StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
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
            borderRadius: 15
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
        matIconStyle: {
            fontSize: 28
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
            minWidth: '31%',
            marginTop: 10,
        },
        count: {
            flexDirection: 'row',
            // maxWidth: '50%',
            minWidth: '15%',
            justifyContent: 'center',
            paddingHorizontal: 10,
            borderRadius: 10,
        }
    })
}

const buttonStyles = (theme) =>{

    return StyleSheet.create({
        container: {
            marginTop: 40,
            justifyContent: 'center',
            alignItems: 'center',
        },
        confirmButton: {
            width: '60%',
            borderRadius: 15,
            backgroundColor: Colors[theme].noir,
            padding: 15,
            alignItems: 'center'
        },
        buttonText: {
            fontWeight: 'bold',
            textAlign: 'center',
            color: Colors[theme].light,
            fontSize: 18
        },
        
    })
}
 
const addButtonStyle = (theme) =>{

    return StyleSheet.create({
        container: {
            flex: 1,
            position: 'absolute',
            bottom: 20,
            height: 50,
            width: 50,
            alignSelf: 'center',
            borderRadius: 100,
            backgroundColor: Colors[theme].orange,
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'flex-end',
        },
        buttonPressed: {
            transform: [{ scale: 1.4 }],
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
} 

const textStyles = (theme) => {
    return StyleSheet.create({
        largeText: {
            fontSize: 28,
            width: 300,
        },
        smallText: {
            fontSize: 12,
            fontWeight: 'bold'
        },
        textError: {
            fontSize: 12,
            marginVertical: 5,
            color: 'white',
            textAlign: 'center',
            padding: 5,
            borderWidth: 1,
            borderRadius: 10,
            backgroundColor: '#FB6868',
            borderColor: 'white',
            maxWidth: '70%',
            alignSelf: 'center'
        },
        linkText: {
            color: Colors[theme].noir,
            textDecorationLine: 'underline'
        },
    })
} 

const formStyles = (theme) =>{
    return StyleSheet.create({
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
            backgroundColor: Colors[theme].softGrey,
            borderRadius: 10,
            fontSize: 16,
            marginBottom: 14,
    
        },
        textInputError: {
            padding: 10,
            borderWidth: 1,
            borderRadius: 5,
            backgroundColor: Colors.softGrey,
            borderRadius: 10,
            fontSize: 16,
            // marginBottom: 8,
            borderColor: 'red'
    
        },
        textInputErrorText: {
            color: 'red',
            fontSize: 12,
            marginBottom: 6,
            paddingLeft: 8
        },
        loadingIndicator: {
            padding: 10
        },
        linkContainer: {
            flexDirection: 'row',
        },
    })
}

const taskStyles = (theme) =>{
    return StyleSheet.create({
        completed: {
            width: 22,
            height: 22,
            backgroundColor: Colors[theme].orange,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 5,
            // para ios
            shadowColor: Colors[theme].dark,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 2, // desenfocamos un poco la sombra
            elevation: 2, // para android
        },
        unCompleted: {
            width: 20,
            height: 20,
            borderColor: Colors[theme].softGrey,
            borderRadius: 5,
            borderWidth: 2,
            // borderColor: Colors.grey,
            // alignItems: 'center',
            // justifyContent: 'center',
            // borderRadius: 5,
            // // para ios
            // shadowColor: Colors.grey,
            // shadowOffset: { width: 0, height: 2 },
            // shadowOpacity: 0.2,
            // shadowRadius: 2, // desenfocamos un poco la sombra
            // elevation: 2, // para android
        },
        text: {
            fontSize: 15,
            fontWeight: 300,
            color: Colors.noir,
            alignItems: 'center'
        }
    })
} 

const actStyles = (theme) => {
    return StyleSheet.create({
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
            fontWeight: 'bold',
            
        },
        emptyIcon: {
            fontSize: 40
        },
        description: {
            color: Colors[theme].dark,
            fontWeight: '600',
            marginVertical: 15
        }
    })
} 

const contextModalStyles = (theme) =>{
    return StyleSheet.create({
        context: {
            paddingVertical: 8,
            marginLeft: 15, flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            borderRadius: 10
        }
    })
} 

export {
    actStyles,
    sidebarStyles,
    addButtonStyle,
    formStyles,
    buttonStyles,
    taskStyles,
    textStyles,
    contextModalStyles
}
