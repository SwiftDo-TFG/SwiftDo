import { TouchableOpacity, View, Text, StyleSheet } from "react-native"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const ProjectBadge = ({ project, little }) => {
    const badgeStyle = little ? { borderColor: project.color } : { ...styles.projectBadge, borderColor: project.color }
    const iconSize = little ? 10 : 14;

    return (
        <View style={badgeStyle}>
            <Text style={{...styles.badgeText, fontSize: little ? 12 : 14}}>
                <MaterialCommunityIcons name="circle-outline" size={iconSize} color={project.color} /> {(project.title.length > 8 ? `${project.title.substring(0, 8)}...` : project.title)}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    projectBadge: {
        borderRadius: 100,
        borderWidth: 1,
        paddingHorizontal: 6,
        backgroundColor: 'white',
        marginRight: 2,
        marginBottom: 3,
    },
    badgeText: {
        color: '#272c34',
        fontWeight: 600
    }

})

export default ProjectBadge