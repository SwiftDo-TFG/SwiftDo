import {LocaleConfig} from 'react-native-calendars';
import XDate from "xdate";

LocaleConfig.locales['es'] = {
  monthNames: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ],
  monthNames: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ],
  monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
  today: "Hoy"
};

LocaleConfig.defaultLocale = 'es';

const getFormattedMonth = (month)=>{
    return XDate.locales[XDate.defaultLocale].monthNames[month]
}

const getFormattedDay = (day)=>{
  return XDate.locales[XDate.defaultLocale].dayNames[day]
}

const comapareDates = (date1, date2) => {
  return date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear();
}

const parseDatetoPretty = (date) =>{
  const auxDate = new XDate(date);
  const today = new XDate();
  const hoy = comapareDates(auxDate, today) ? 'Hoy, ' : ''

  return hoy + getFormattedDay(auxDate.getDay()) + ', ' +getFormattedMonth(auxDate.getMonth()) + " " + auxDate.getDate();
}

const getFormattedDateCalendar = (date) =>{
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const fullYear = date.getFullYear();

  return fullYear + '-'+ month + '-' + day;
}

function getMarkedDates(tasks) {
  const marked = {};

  tasks.forEach(item => {
    // NOTE: only mark dates with data
    if (item.data && item.data.length > 0 && !item.data.length !== 0) {
      marked[item.title] = {marked: true};
    } else {
      marked[item.title] = {disabled: true};
    }
  });
  return marked;
}

export default {getFormattedMonth, parseDatetoPretty, getFormattedDateCalendar, getMarkedDates};