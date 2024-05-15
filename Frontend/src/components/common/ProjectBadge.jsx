import { TouchableOpacity, View, Text, StyleSheet } from "react-native"
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useContext } from "react";
import ThemeContext from "../../services/theme/ThemeContext";
import Colors from "../../styles/colors";

const ProjectBadge = ({ project, little }) => {
    const badgeStyle = little ? { borderColor: project.color } : { ...styles.projectBadge, borderColor: project.color }
    const iconSize = little ? 10 : 14;
    //Theme
    const themeContext = useContext(ThemeContext);
    // const theme = useColorScheme();
    const theme = themeContext.theme;

    return (
        <View style={{...badgeStyle, borderColor: project.color, backgroundColor: Colors[theme].themeColor }}>
            <Text style={{...styles.badgeText, fontSize: little ? 12 : 14, color: theme === 'light' ? '#272c34' : Colors[theme].white}}>
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