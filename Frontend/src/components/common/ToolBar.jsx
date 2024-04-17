import { useEffect, useCallback, useState, useMemo, useRef } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../../styles/colors";
import { FontAwesome5, Entypo, FontAwesome, Ionicons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';


const ToolBar = () => {
    const [hasTag, toggleTag] = useState(false);
    const [hasDate, toggleDate] = useState(false);
    const [isUrgent, toggleUrgent] = useState(false);

    return (


        <View style={style.toolbarWrapper}>
            <View style={style.container}>
            <TouchableOpacity style={style.componentWrapper}>

                    <Entypo name="select-arrows" size={16} color="black" />
                    <Text><MaterialCommunityIcons name="home-city-outline" size={18} color="black" /> Contexto </Text>
                    
                </TouchableOpacity>
                <View style={style.componentGap}/>
                <TouchableOpacity style={style.componentWrapper} >
                    <Entypo name="select-arrows" size={16} color="black" />
                    <Text><FontAwesome5 name="inbox" size={18} color="black" /> Entrada </Text>
                </TouchableOpacity>
                <View style={style.componentGap}/>
                <View style={style.componentWrapper}> 
                    <TouchableOpacity onPress={() => {toggleTag(!hasTag)}}>
                        {hasTag ? (<MaterialCommunityIcons name="tag" size={24} color="#4F6E8C"/>) : (<MaterialCommunityIcons name="tag-outline" size={24} color="black"/>)}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {toggleDate(!hasDate)}}>
                        {hasDate ? (<MaterialCommunityIcons name="calendar-month" size={24} color="#008080" />) : (<MaterialCommunityIcons name="calendar-month" size={24} color='black' />)}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {toggleUrgent(!isUrgent)}}>
                        {isUrgent ?  (<Ionicons name="flag" size={22} color="#be201c" />) : (<Ionicons name="flag-outline" size={22} color='black' />) }
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        backgroundColor: 'grey',
      },
      contentContainer: {
        flex: 1,
        alignItems: 'center',
      },
})

export default ToolBar;