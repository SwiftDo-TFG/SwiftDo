import { TouchableOpacity, View, Text } from "react-native";
import {FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { sideBar } from "../../styles/globalStyles";
import Colors from "../../styles/colors";

const ActionScheme = ({onPress, icon, iconColor, text, totalTasks, importantTasks, type}) =>{

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <TouchableOpacity onPress={onPress} style={{ width: '63%' }}>
                <View style={sideBar.actionWrapper}>
                    <View style={sideBar.iconWrapper}>
                        {type === 'M' ? (<MaterialCommunityIcons name={icon} style={[sideBar.matIconStyle, {color: iconColor}]} /> ): (<FontAwesome5 name={icon} style={[sideBar.iconStyle, {color: iconColor}]}/>)}
                    </View>

                    <Text style={[sideBar.actionText,]}>{text}</Text>
                </View>
            </TouchableOpacity>
            <View style={[sideBar.countContainer, { justifyContent: importantTasks !== undefined && importantTasks !== 0 ? 'space-around' : 'flex-end' }]}>
                {importantTasks !== undefined && importantTasks !== 0 && (
                    <View style={[sideBar.count, { backgroundColor: Colors.red }]}>
                        {importantTasks <= 99 ? (
                            <Text>{importantTasks}</Text>
                        ) : (
                            <Text>+99</Text>
                        )}
                    </View>
                )}
                {totalTasks !== undefined && totalTasks !== 0 && (
                    <View style={[sideBar.count, { backgroundColor: Colors.green }]}>
                        {totalTasks <= 99 ? (
                            <Text>{totalTasks}</Text>
                        ) : (
                            <Text>+99</Text>
                        )}
                    </View>
                )}

            </View>
        </View>

    )




}

export default ActionScheme;
