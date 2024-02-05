import { View, Image, StyleSheet, Dimensions } from 'react-native'

// const { width, height } = Dimensions.get('window');
// const maxWidth = 1000;
// const maxHeight = 1000; // Establece el alto máximo deseado
const LoginImg = () => {
    return (
        <View style={imageStyle.container}>
            <Image 
                source={require('../../assets/login.png')}
                style={imageStyle.image}
                // resizeMode='contain'
                />

        </View>
    )
}

const imageStyle = StyleSheet.create({
    container: {
        alignSelf: 'center'
    },    
    image: {
        width: 360,
        height: 360
    }
})

export default LoginImg