import { TouchableOpacity, Text, StyleSheet } from "react-native";

const CustomButton = ({handler, text}) => {

    return(
        <TouchableOpacity
            onPress={handler}
            style={styles.customButton}>
            <Text style={styles.buttonsText}>{text}</Text>
        </TouchableOpacity>
    )

}

const styles = StyleSheet.create({
    customButton: {
        marginTop: 15,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 100,
        backgroundColor: 'blue'
    },
    buttonsText:{
        alignSelf: 'center',
        color: 'white'
    }

})


export default CustomButton;