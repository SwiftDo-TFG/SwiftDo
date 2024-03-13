import { useState, useEffect } from "react";
import { Animated, View, TouchableWithoutFeedback, Dimensions } from "react-native"
import Modal from "../windows/Modal";

const dvHeight = Dimensions.get('window').height;

function OutSide({onCloseModal, isModalOpen}) {
    const view = <View style={{ flex: 1, width: '100%' }} />;
    if (!isModalOpen) return view;
    return (
        <TouchableWithoutFeedback onPress={()=>{onCloseModal()}} style={{ flex: 1, width: '100%' }}>
            {view}
        </TouchableWithoutFeedback>
    );
}

function PopUpModal(props) {
    const [translateY, setTranslateY]  = useState(new Animated.Value(dvHeight));

    useEffect(() => {
        animateModal()
        if(props.isModalOpen && props.onShow){
            props.onShow();
        }
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
            <View style={{ flex: 1, backgroundColor: 'white', padding: 10}}>
                {/* <OutSide onCloseModal={props.onCloseModal} isModalOpen={props.isModalOpen}/> */}
                <Animated.View
                    // style={{
                    //     transform: [{ translateY }],
                    //     backgroundColor: '#FFFFFF',
                    //     width: '100%',
                    //     borderTopLeftRadius: 20,
                    //     borderTopRightRadius: 20,
                    //     paddingHorizontal: 10,
                    //     justifyContent: 'space-between',
                    //     maxHeight: dvHeight * 0.4,
                    //     minHeight: dvHeight * 0.4,
                    // }}
                >
                    {props.children}
                </Animated.View>
            </View>
        </Modal>
    )
}

export default PopUpModal;