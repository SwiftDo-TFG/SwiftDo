import { useState, useEffect } from "react";
import { Animated, View, TouchableWithoutFeedback, Dimensions} from "react-native"
import Modal from "../windows/Modal";

const dvHeight = Dimensions.get('window').height;


function PopUpModal(props) {
    //animationType={'fade'} transparent={true} 
    const [translateY, setTranslateY]  = useState(new Animated.Value(dvHeight));

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
        <Modal {...props} visible={props.isModalOpen} onCloseModal={props.onCloseModal} >
            <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' }}>
                {/* <OutSide onCloseModal={props.onCloseModal} isModalOpen={props.isModalOpen}/> */}
                <Animated.View style={{
                        transform: [{ translateY }],
                        backgroundColor: '#FFFFFF',
                        width: '100%',
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        paddingHorizontal: 10,
                        justifyContent: 'space-between',
                        maxHeight: dvHeight * 0.4,
                        minHeight: dvHeight * 0.4,
                    }}>
                    {props.children}
                </Animated.View>
            </View>
        </Modal>
    )
}

export default PopUpModal;