import { useState, useEffect, useContext } from "react";
import { Animated, View, TouchableWithoutFeedback, Modal, Dimensions, useColorScheme, Platform } from "react-native"
import Colors from "../../styles/colors";
import ThemeContext from "../../services/theme/ThemeContext";


const dvHeight = Dimensions.get('window').height;

function OutSide({ onCloseModal, isModalOpen, width }) {
    const view = <View style={{ flex: 1, width: '100%' }} />;
    if (!isModalOpen) return view;
    return (
        <TouchableWithoutFeedback onPress={() => { onCloseModal() }} style={{ flex: 1, width: width }}>
            {view}
        </TouchableWithoutFeedback>
    );
}

function PopUpModal(props) {
    const [translateY, setTranslateY] = useState(new Animated.Value(dvHeight));

    //Theme
    const themeContext = useContext(ThemeContext);
    // const theme = useColorScheme();
    const theme = themeContext.theme;

    useEffect(() => {
        animateModal()
    }, [props.isModalOpen]);


    function animateModal() {
        // const { translateY } = translateY;
        const show = props.isModalOpen;

        Animated.timing(translateY, {
            toValue: show ? 0 : dvHeight,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }

    return (
        <Modal {...props} animationType={'fade'} transparent={true} visible={props.isModalOpen} onCloseModal={props.onCloseModal} >
            <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end', alignItems: 'center' }}>
                <OutSide onCloseModal={props.onCloseModal} isModalOpen={props.isModalOpen} width={'100%'} />
                <View style={{width: '100%', flexDirection: 'row'}}>
                    {Platform.OS === 'web' && (
                        <OutSide onCloseModal={props.onCloseModal} isModalOpen={props.isModalOpen} width={'30%'}/>
                    )}
                    <Animated.View
                        style={{
                            transform: [{ translateY }],
                            backgroundColor: '#FFFFFF',
                            width: Platform.OS === 'web' ? '40%' : '100%',
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            paddingHorizontal: 10,
                            justifyContent: 'space-between',
                            maxHeight: dvHeight * 0.4,
                            minHeight: dvHeight * 0.4,
                            backgroundColor: Colors[theme].themeColor,
                            borderColor: theme === 'dark' ? Colors[theme].white : '',
                            borderTopWidth: theme === 'dark' ? 0.5 : 0,
                            borderLeftWidth: theme === 'dark' ? 0.5 : 0,
                            borderRightWidth: theme === 'dark' ? 0.5 : 0
                        }}
                    >
                        {props.children}
                    </Animated.View>
                    {Platform.OS === 'web' && (
                        <OutSide onCloseModal={props.onCloseModal} isModalOpen={props.isModalOpen} width={'30%'}/>
                    )}
                </View>
            </View>
        </Modal>
    )
}

export default PopUpModal;