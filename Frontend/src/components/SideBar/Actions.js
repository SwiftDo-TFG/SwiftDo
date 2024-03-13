import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { TouchableOpacity, View, Text, useColorScheme } from "react-native";
import { sidebarStyles } from "../../styles/globalStyles";
import Colors from "../../styles/colors";
import { useState } from "react";

const ActionScheme = ({ onPress, icon, iconColor, text, totalTasks, importantTasks, type }) => {
    const theme = useColorScheme();
    const sideBar = sidebarStyles(theme);

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={{margin: 1, padding: 1, backgroundColor: 'transparent', borderRadius: 10}}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={sideBar.actionWrapper}>
                    <View style={sideBar.iconWrapper}>
                        {type === 'M' ? (<MaterialCommunityIcons name={icon} style={[sideBar.matIconStyle, { color: iconColor }]} />) : (<FontAwesome name={icon} style={[sideBar.iconStyle, { color: iconColor }]} />)}
                    </View>

                    <Text style={[sideBar.actionText, {color: Colors[theme].white}]}>{text}</Text>
                </View>
            
                <View style={[sideBar.countContainer, { justifyContent: importantTasks !== undefined && importantTasks !== 0 ? 'space-around' : 'flex-end' }]}>
                    {importantTasks !== undefined && importantTasks !== 0 && (
                        <View style={[sideBar.count, {backgroundColor: Colors[theme].red}]}>
                            <Text style={{color: theme === 'dark' ? Colors[theme].black : Colors[theme].softGrey, fontWeight: 'bold'}}>{importantTasks <= 99 ? importantTasks : '+99'}</Text>
                        </View>
                    )}
                    {totalTasks !== undefined && totalTasks !== 0 && (
                        <View style={sideBar.count}>
                            <Text style={{fontWeight: 'bold', color: Colors[theme].grey}}>{totalTasks <= 99 ? totalTasks : '+99'}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>

    )




}

export default ActionScheme;
