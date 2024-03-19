
import { View, TouchableWithoutFeedback, Text, TextInput } from "react-native";
import styles from '../../screens/tasks/actionScreen.styles'
// import DatePicker from "../DatePicker";
// import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePicker from 'react-native-ui-datepicker';
import Modal from "../windows/Modal";
import { useState, useEffect } from "react";


const DatePickerModal = (props) => {
    const [date, setDate] = useState(new Date())
    const today = new Date(new Date().toISOString().split('T')[0]); 

    useEffect(()=>{
        setDate(props.state.date_name === 'Fecha' ? new Date() : new Date(props.state.date_name))
    },[props.state])

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
                    <View>
                        {/* <Text style={{ color: 'black' }}>Selector de horas</Text> */}
                        <TextInput
                            style={{ color: 'black', backgroundColor: 'red', width: 50 }}
                            value="10:30"
                            placeholder="Nueva Tarea"
                        // onChangeText={onTitleChange}
                        // onEndEditing={() => { console.log("THIS END") }}
                        // maxLength={50}
                        // multiline={true}
                        />
                    </View>
                    {/* <DatePicker
                        today={new Date()}
                        state={props.state}
                        setState={props.setState}
                    /> */}
                    <DateTimePicker
                        calendarTextStyle={{color: 'black'}}
                        headerTextStyle={{color: 'black'}}
                        weekDaysTextStyle={{color: 'black'}}
                        headerButtonColor={"orange"}
                        selectedItemColor={"orange"}
                        mode="single"
                        locale="es"
                        minDate={today}
                        firstDayOfWeek={1}
                        timePicker={true}
                        date={date}
                        onChange={(params) => {
                            setDate(new Date(params.date))
                            const auxDate = new Date(params.date)
                            // const parsedDate = `${auxDate.getFullYear()}/${(auxDate.getMonth() + 1).toString().padStart(2, '0')}/${auxDate.getDate().toString().padStart(2, '0')} ${auxDate.getHours().toString().padStart(2, '0')}:${auxDate.getMinutes().toString().padStart(2, '0')}`
                            const parsedDate = params.date.replaceAll('-', '/');
                            props.setState({ ...props.state, date_name: parsedDate, state: "3" });
                        }}
                    />
                </View>
            </View>
        </Modal>
    )
}

export default DatePickerModal;