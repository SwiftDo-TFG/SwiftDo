import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';


export default ({ context_name, handlePress, style }) => {
    return (
        <TouchableOpacity onPress={handlePress}>
            <View style={{ borderRadius: 5, borderWidth: 1, borderColor: 'grey', paddingLeft: 2, backgroundColor: 'white' , ...style}}>
                <Text style={{ marginRight: 5 }}>
                    <MaterialCommunityIcons name="home-city-outline" size={14} color="#272c34" /> {context_name} <MaterialCommunityIcons name="close" size={14} color="#272c34" />
                    {/* <AntDesign name="caretdown" size={14} color="#272c34" /> */}
                </Text>
            </View>
        </TouchableOpacity>

    )
}