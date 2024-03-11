import { TouchableOpacity, View, Text, useColorScheme } from "react-native";
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { sidebarStyles } from "../../styles/globalStyles";
import Colors from "../../styles/colors";

const ActionScheme = ({ onPress, icon, iconColor, text, totalTasks, importantTasks, type }) => {
    const theme = useColorScheme();
    const sideBar = sidebarStyles(theme);
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <TouchableOpacity onPress={onPress}>
                <View style={sideBar.actionWrapper}>
                    <View style={sideBar.iconWrapper}>
                        {type === 'M' ? (<MaterialCommunityIcons name={icon} style={[sideBar.matIconStyle, { color: iconColor }]} />) : (<FontAwesome5 name={icon} style={[sideBar.iconStyle, { color: iconColor }]} />)}
                    </View>

                    <Text style={[sideBar.actionText, {color: Colors[theme].white}]}>{text}</Text>
                </View>
            </TouchableOpacity>
            <View style={[sideBar.countContainer, { justifyContent: importantTasks !== undefined && importantTasks !== 0 ? 'space-around' : 'flex-end' }]}>
                {importantTasks !== undefined && importantTasks !== 0 && (
                    <View style={sideBar.count}>
                        <Text style={{color: Colors[theme].red}}>{importantTasks <= 99 ? importantTasks : '+99'}</Text>
                    </View>
                )}
                {totalTasks !== undefined && totalTasks !== 0 && (
                   <View style={sideBar.count}>
                   <Text style={{color: Colors[theme].white}}>{totalTasks <= 99 ? totalTasks : '+99'}</Text>
               </View>
                )}

            </View>
        </View>

    )




}

export default ActionScheme;
