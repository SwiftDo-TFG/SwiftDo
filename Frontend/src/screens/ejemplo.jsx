import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

function EjemploScreen(){
    const [variable, setVariable] = React.useState({});
    const Barra = function(){
        return (
            <View style={styles.container}>
                <Text>Nombre: {variable.Nombre}</Text>
                <Text>Apellido: {variable.Apellido}</Text>
            </View>
        ) 
    }


    React.useEffect(() => {
        setVariable({Nombre: 'Pepe', Apellido: 'Jose Luis', Sexo: 'M', Edad: 21})
    }, []);

    return (
        <View style={styles.container}>
            <Text>Ejemplo {variable.Nombre} con edad {variable.Edad}</Text>
            <Button title="Aumentador" onPress={() => setVariable({...variable, Edad: variable.Edad + 1})}>Clicka aqui</Button>
            <Barra></Barra>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    title: {
        fontSize: 20,
        marginBottom: 10
    },
    textInput:{
        padding: 5,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 5
    }
})

export default EjemploScreen;