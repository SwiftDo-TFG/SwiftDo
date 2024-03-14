import { Flyout, Popup } from 'react-native-windows';
import { View, TextInput, TouchableOpacity, Text, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, ScrollView } from "react-native"
import { useState, useEffect } from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import styles from '../../screens/tasks/actionScreen.styles'


const Modal = (props) => {
    
    if (props.popup) {
        return (
            <Popup isOpen={props.visible} isLightDismissEnabled={true} onDismiss={() => { props.setIsModalVisible(false) }} verticalOffset={props.verticalOffset} horizontalOffset={props.horizontalOffset}>
                <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0)',}}>
                    {props.children}
                </View>
            </Popup>
        )
    }

    return (
        <Flyout isOpen={props.visible} placement={props.placement ? props.placement :'bottom'} isOverlayEnabled={true} onDismiss={() => { props.setIsModalVisible(false) }}>
            <View style={{flex: 1, borderWidth: 1, borderTopLeftRadius: 16, borderTopRightRadius: 16, backgroundColor: 'rgba(0, 0, 0, 0)'}}>
                {props.children}
            </View>
        </Flyout>
    )
}

export default Modal