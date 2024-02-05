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
                    <View style={[sideBar.count]}>
                        <Text>{totalTasks}</Text>
                    </View>
                </>  
                )}
                        
            </View>
        </View>
        
    )
    
    


} 

export default ActionScheme;
{/* <View>
<TouchableOpacity onPress={() => navigation.navigate('Inbox')}>
    <View style={styles.actionContainer}>
        <View style={styles.action}>
            <FontAwesome5 name="inbox" style={styles.iconAction} color={'#f39f18'} />
            <Text style={styles.actionTitle}>Inbox</Text>
        </View>
        <View style={styles.countContainer}>
            <View style={[styles.count, { backgroundColor: '#e3e4e5' }]}>
                <Text>3</Text>
            </View>
        </View>
    </View>
</TouchableOpacity>
<TouchableOpacity>
    <View style={styles.actionContainer}>
        <View style={styles.action}>
            <FontAwesome5 name="play" style={styles.iconAction} color={'#4f6072'} />
            <Text style={styles.actionTitle}>Hoy</Text>
        </View>
        <View style={styles.countContainer}>
            <View style={[styles.count, { backgroundColor: '#e14736' }]}>
                <Text>1</Text>
            </View>
            <View style={[styles.count, { backgroundColor: '#e3e4e5' }]}>
                <Text>4</Text>
            </View>
        </View>
    </View>
</TouchableOpacity>
<TouchableOpacity onPress={() => navigation.navigate('CuantoAntes')}>
    <View style={styles.actionContainer}>
        <View style={styles.action}>
            <FontAwesome5 name="bolt" style={styles.iconAction} color={'#ffd700'} />
            <Text style={styles.actionTitle}>Cuanto antes</Text>
        </View>
        <View style={styles.countContainer}>
            <View style={[styles.count, { backgroundColor: '#e3e4e5' }]}>
                <Text>1</Text>
            </View>
        </View>
    </View>
</TouchableOpacity>
<TouchableOpacity onPress={() => navigation.navigate('Programadas')}>
    <View style={styles.actionContainer}>
        <View style={styles.action}>
            <Ionicons name="calendar-outline" style={styles.iconAction} color={'#008080'} />
            <Text style={styles.actionTitle}>Programadas</Text>
        </View>
        <View style={styles.countContainer}>
            <View style={[styles.count, { backgroundColor: '#e3e4e5' }]}>
                <Text>1</Text>
            </View>
        </View>
    </View>
</TouchableOpacity>
<TouchableOpacity onPress={() => navigation.navigate('Archivadas')}>
    <View style={styles.actionContainer}>
        <View style={styles.action}>
            <FontAwesome5 name="archive" style={styles.iconAction} color={'#d2b48c'} />
            <Text style={styles.actionTitle}>Algún día</Text>
        </View>
        <View style={styles.countContainer}>
            <View style={[styles.count, { backgroundColor: '#e3e4e5' }]}>
                <Text>1</Text>
            </View>
        </View>
    </View>
</TouchableOpacity>
<TouchableOpacity onPress={() => navigation.navigate('Project')}>
    <View style={styles.actionContainer}>
        <View style={styles.action}>
            <MaterialCommunityIcons name="hexagon-slice-6" style={styles.iconAction} size={26} color="red" />
            <Text style={styles.actionTitle}>Proyecto</Text>
        </View>
        <View style={styles.countContainer}>
            <View style={[styles.count, { backgroundColor: '#e3e4e5' }]}>
                <Text>1</Text>
            </View>
        </View>
    </View>
</TouchableOpacity>
</View> */}