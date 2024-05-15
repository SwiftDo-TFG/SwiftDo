import { StyleSheet, Platform } from "react-native";
import Colors from "../../../styles/colors";


const settingStyles = StyleSheet.create({
    topContainer: {
        padding: 2,
        alignItems: 'center',
        flex: Platform.OS === 'web' ? 1 : 0,
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: '100%',
        marginBottom: 25
    },
    sideSettingsText: {
        color: 'white',
        fontSize: 16,
        marginLeft: 10
    },
    sideSettingContainer: {
        marginBottom: 10,
        padding: 7,
        flexDirection: 'row',
        borderWidth: 0.5,
        borderRadius: 10,
        alignItems: 'center'
    },
    sideContainerBackgrLight: {
        borderColor: "lightgrey",
        backgroundColor: "lightgrey",
    },
    sideContainerBackgrDark: {
        borderColor: Colors["dark"].activeColor,
        backgroundColor: Colors["dark"].activeColor,
    },
    icon: {
        width: 45,
        height: 45,
        borderRadius: 15
    },
    themeSelectorPill: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    themeSelectorPillSelected: {
        borderWidth: 1,
        borderRadius: 20,
        padding: 10,
    },
    serverSettingText: {
        color: 'white',
        // fontSize: 16,
        // marginLeft: 10
    },
    createServerButton: {
        paddingVertical: 3,
        paddingHorizontal: 10,
        borderRadius: 5,
        borderWidth: 0.5,
        alignItems: 'center'
    },
    createServerTextInput: {
        fontWeight: 'normal',
        width: '100%',
        marginBottom: 10
    },
    connectServerButton: {
        paddingVertical: 3,
        paddingHorizontal: 6,
        borderRadius: 5,
        borderWidth: 0.5,
        alignItems: 'center'
    }
})


export default settingStyles;