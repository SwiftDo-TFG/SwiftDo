import { TouchableOpacity, View, Text } from "react-native";
import {FontAwesome5} from '@expo/vector-icons';
import { sideBar } from "../../styles/globalStyles";
import Colors from "../../styles/colors";

const ActionScheme = ({onPress, icon, iconColor, text, totalTasks, importantTasks}) =>{

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <TouchableOpacity onPress={onPress} >
                <View style={sideBar.actionWrapper}>
                    <View style={sideBar.iconWrapper}>
                        <FontAwesome5 name={icon} style={[sideBar.iconStyle, {color: iconColor}]} />
                    </View>
                    
                    <Text style={[sideBar.actionText, ]}>{text}</Text>
                </View>            
            </TouchableOpacity>
            <View style={sideBar.countContainer}>
                { importantTasks !== undefined && importantTasks !== 0 && (
                <>
                    <View style={[sideBar.count, { backgroundColor: Colors.red }]}>
                        <Text>{importantTasks}</Text>
                    </View>
                </>
                )}
                {totalTasks !== undefined && totalTasks !== 0 &&  (
                <>
                    <View style={sideBar.count}>
                        <Text>{totalTasks}</Text>
                    </View>
                </>  
                )}
                        
            </View>
        </View>
        
    )
    
    


} 

export default ActionScheme;
