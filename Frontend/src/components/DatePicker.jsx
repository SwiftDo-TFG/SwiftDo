import DatePicker from 'react-native-modern-datepicker';

export default function DatePickerFuntion(today, state, setState) {
    <DatePicker
        onSelectedChange={(date) => {
            if (date !== state.dateName) {
                if (state.dateName !== 'Fecha') setState({...state, showDatePicker: false })
                setState({...state, date_name: date, state: "3" });
            }
        }}
        selected={state.dateName === 'Fecha' ? today.toISOString().split('T')[0] : state.dateName}
        current={state.dateName === 'Fecha' ? today.toISOString().split('T')[0] : state.dateName}
        minimumDate={today.toISOString().split('T')[0]}
        options={{
            backgroundColor: '#ffffff',
            textHeaderColor: '#666666',
            textDefaultColor: '#808080',
            selectedTextColor: 'white',
            mainColor: '#f39f18',
            textSecondaryColor: '#f39f18',
        }}
        configs={{
            dayNames: [
                "Domingo",
                "Lunes",
                "Martes",
                "Miércoles",
                "Jueves",
                "Viernes",
                "Sábado",
            ],
            dayNamesShort: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
            monthNames: [
                "Enero",
                "Febrero",
                "Marzo",
                "Abril",
                "Mayo",
                "Junio",
                "Julio",
                "Agosto",
                "Septiembre",
                "Octubre",
                "Noviembre",
                "Diciembre",
            ],
            hour: 'Hora',
            minute: 'Minuto',
            timeSelect: 'Aceptar',
            timeClose: 'Cerrar',
        }}
    />
}