
import { View, TouchableWithoutFeedback, Text } from "react-native";
import styles from '../../screens/tasks/actionScreen.styles'
import DatePicker from "../DatePicker";
import Modal from "../windows/Modal";


const DatePickerModal = (props) => {
    return (
        <Modal
            transparent={true}
            animationType={'fade'}
            visible={props.state.showDatePicker}
            onRequestClose={() => props.setState({ ...props.state, showDatePicker: false })}
            // WindowsProps
            popup={true}
            onDismiss={() => props.setState({ ...props.state, showDatePicker: false })}
            {...props}
        >
            <View style={styles.modalDatePickerContainer}>

                {/* <TouchableWithoutFeedback onPress={() => props.setState({ ...props.state, showDatePicker: false })}>
                    <View style={styles.modalDatePickerBackground} />
                </TouchableWithoutFeedback> */}

                <View style={[styles.modalDatePickerContent, { zIndex: 2 }]}>
                    <DatePicker
                        today={new Date()}
                        state={props.state}
                        setState={props.setState}
                    />
                </View>
            </View>
        </Modal>
    )
}

export default DatePickerModal;