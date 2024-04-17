import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../../styles/colors";
import { FontAwesome5, Entypo, FontAwesome, Ionicons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';

const ToolBar = () => {

    const handle = () =>{

    }
    const handleDate = () =>{

    }

    const handleUrgent = () =>{

    }
    return (
        <View style={style.toolbarWrapper}>
            <View style={style.container}>
            <TouchableOpacity style={style.componentWrapper}>

                    <Entypo name="select-arrows" size={16} color="black" />
                    <Text><MaterialCommunityIcons name="home-city-outline" size={18} color="black" /> Contexto </Text>
                    
                </TouchableOpacity>
                <View style={style.componentGap}/>
                <TouchableOpacity style={style.componentWrapper}>
                    <Entypo name="select-arrows" size={16} color="black" />
                    <Text><FontAwesome5 name="inbox" size={18} color="black" /> Entrada </Text>
                </TouchableOpacity>
                <View style={style.componentGap}/>
                <View style={style.componentWrapper}> 
                    <TouchableOpacity >
                        <MaterialCommunityIcons name="tag-outline" size={24} color="black"/>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <MaterialCommunityIcons name="calendar-month" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity >
                            <Ionicons name="flag-outline" size={22} color='black' /*"#be201c" */ />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        
    )
}

const style = StyleSheet.create({
    toolbarWrapper : {
    }, 
    container: {
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'space-between', 
        backgroundColor: colors.dark.softGrey, 
        borderRadius: 10,

        
    },
    componentGap : {
        width: 1,
        backgroundColor : 'black'
    },
    componentWrapper : {flexDirection: 'row', alignContent: 'center', gap: 8, padding: 10}

})

export default ToolBar;