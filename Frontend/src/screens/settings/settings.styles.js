import { StyleSheet } from "react-native";
import Colors from "../../styles/colors";


const aboutapp = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 5,
        paddingBottom: 20,
        backgroundColor: 'white'
    },
    help: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 30,
    },
    icon: {
        fontSize: 40,
        textAlign: 'center',
        color: Colors.darkBlue

    },
    title: {
        fontSize: 28,
        marginLeft: 18,
        fontWeight: 'bold'
    },
    paragraph: {
        textAlign: "justify",
        marginBottom: 10,
    },
    guideContainer: {
        marginVertical: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    guideText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#272c34',
        marginRight: 10
    },
    animatedGuide: {
        overflow: 'hidden',
        marginLeft: 10
    },
});

const slider = StyleSheet.create({
    container: {
        flex: 3,
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    omitir:{
        fontWeight: 'bold',
        color: '#ffa420',
        fontSize: 18
    },
    containerSlider:{
        flex: 1,
        height: '80vh',
        justifyContent: 'center',
    },
    image: {
        height: '100%',
        justifyContent: 'center'
    },
    title: {
        fontWeight: '800',
        fontSize: 28,
        marginBottom: 10,
        color: '#ffa420',
        textAlign: 'center'
    },
    description: {
        fontWeight: '300',
        color: '#62656b',
        textAlign: 'center',
        paddingHorizontal: 44,
    },
    dot: {
        height: 10,
        borderRadius: 5,
        backgroundColor: '#ffa420',
        marginHorizontal: 8,

    },
    button:{
        position: 'absolute',
        backgroundColor: '#ffa420',
        borderRadius: 100,
        padding: 20,
    },
});

export {
    aboutapp,
    slider
};
