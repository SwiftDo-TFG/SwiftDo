import { View, Image, Text} from "react-native"
import { sideBar, textStyle } from "../../styles/globalStyles"
import Colors from "../../styles/colors"



const Profile = ({formattedDate, name}) =>{
    return (
        <View style={sideBar.profileContainer}>
            <Image
                style={sideBar.profileImage}
                source={require('../../assets/perfil.png')}
            />
            <View style={{marginLeft: 15}}>
                <Text style={[textStyle.largeText, {fontWeight: '600', paddingBottom: 5}]}>{name}</Text>
                <Text style={[textStyle.smallText, {color: Colors.grey}]}>{formattedDate}</Text>
            </View>
        </View>
        
    )
    {/* <TouchableOpacity>
                        <View style={styles.todasAreasContainer}>
                            <Text style={styles.areasTitle}>Todas las áreas</Text>
                            <FontAwesome name="chevron-right" size={20} color="#4f6072" />
                        </View>
                    </TouchableOpacity> */}
}

export default Profile