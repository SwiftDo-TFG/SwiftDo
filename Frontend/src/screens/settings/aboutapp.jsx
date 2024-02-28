import { View, Text, SafeAreaView, TouchableOpacity, Dimensions } from "react-native";
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { aboutapp } from "./settings.styles";
import styles from "../../screens/tasks/actionScreen.styles";

function AboutApp(props) {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', justifyContent: Dimensions.get('window').width <= 768 ? 'space-between' : 'flex-end', alignItems: 'flex-end', marginTop: 25 }}>
                    {Dimensions.get('window').width <= 768 && (<TouchableOpacity onPress={() => props.navigation.toggleDrawer()}>
                        <Feather name="sidebar" size={28} color="black" />
                    </TouchableOpacity>)}
                </View>
                <View style={aboutapp.container}>
                    <View style={aboutapp.help}>
                        <MaterialCommunityIcons name="help-circle" size={24} style={aboutapp.icon} color="black" />
                        <Text style={aboutapp.title}>Sobre la aplicación</Text>
                    </View>
                    <View style={{ flexDirection: 'column', marginLeft: 10, }}>
                        <Text style={aboutapp.paragraph}>
                            El método GTD, creado por David Allen, ayuda a liberar la mente de la carga de recordar todo al volcar el desorden mental en un sistema organizado externo. Esto permite concentrarse en las tareas importantes en el momento adecuado.
                        </Text>
                        <Text style={aboutapp.paragraph}>
                            Es útil para quienes se sienten abrumados por la cantidad de tareas, preocupados por olvidar detalles importantes, o tienen dificultades para completar proyectos.
                        </Text>
                        <Text style={aboutapp.paragraph}>
                            Esta guía proporciona una introducción a los principios del GTD y cómo implementarlos, aunque los conceptos son aplicables a cualquier herramienta de gestión de tareas.
                        </Text>
                        <Text style={aboutapp.paragraph}>
                            La clave para el éxito radica en la adopción de hábitos diarios que fomenten la reflexión sobre el trabajo y la asignación adecuada de prioridades.
                        </Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}


export default AboutApp;