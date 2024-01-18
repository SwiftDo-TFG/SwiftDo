import { View, Text } from "react-native";
import { Agenda, AgendaList, ExpandableCalendar, CalendarProvider, WeekCalendar } from "react-native-calendars";
import SelectableTask from "../inbox/selectableTask";
import styles from './programadas.styles'
import utils from "./calendar/utils"
import { useState } from "react";


const ProgramadasScreen = (props) => {
    const [calendarHeight, setCalendarHeight] = useState(0);


    return (
        // <Agenda
        //     // The list of items that have to be displayed in agenda. If you want to render item as empty date
        //     // the value of date key has to be an empty array []. If there exists no value for date key it is
        //     // considered that the date in question is not yet loaded
        //     items={{
        //         '2024-01-17': [{ task_id: 1, title: 'Task 1, this is the title' }],
        //     }}
        //     // Callback that gets called when items for a certain month should be loaded (month became visible)
        //     loadItemsForMonth={month => {
        //         console.log('trigger items loading');
        //     }}
        //     // Callback that fires when the calendar is opened or closed
        //     onCalendarToggled={calendarOpened => {
        //         console.log(calendarOpened);
        //     }}
        //     // Callback that gets called on day press
        //     onDayPress={day => {
        //         console.log('day pressed');
        //     }}
        //     // Callback that gets called when day changes while scrolling agenda list
        //     onDayChange={day => {
        //         console.log('day changed');
        //     }}
        //     // // Initially selected day
        //     // selected={'2012-05-16'}
        //     // // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
        //     // minDate={'2012-05-10'}
        //     // // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
        //     // maxDate={'2012-05-30'}
        //     // Max amount of months allowed to scroll to the past. Default = 50
        //     pastScrollRange={50}
        //     // Max amount of months allowed to scroll to the future. Default = 50
        //     futureScrollRange={50}
        //     // Specify how each item should be rendered in agenda
        //     // renderItem={(item, firstItemInDay) => {
        //     //     return (
        //     //         <View style={styles.taskContainer}>
        //     //             <SelectableTask task={item} selectedTasks={{ total: 0 }} />
        //     //             {/* <Text>{item.title}</Text> */}
        //     //         </View>
        //     //     );
        //     // }}
        //     // // Specify how each date should be rendered. day can be undefined if the item is not first in that day
        //     // renderDay={(day, item) => {
        //     //     console.log("PROGAMADAS", day, item)
        //     //     return (
        //     //         <View style={styles.dayItem}>
        //     //             <Text style={styles.dateText}>{utils.getFormattedMonth(day.getMonth())}</Text>
        //     //         </View>
        //     //     );
        //     // }}
        //     dayComponent={Date => {
        //         console.log("ESTA ES LA DATE", Date)
        //     }}
        //     // Specify how empty date content with no items should be rendered
        //     // renderEmptyDate={() => {
        //     //     return (
        //     //         <View style={styles.emptyDate}>
        //     //           <Text>This is empty date!</Text>
        //     //         </View>
        //     //       );
        //     // }}
        //     // // Specify how agenda knob should look like
        //     // renderKnob={() => {
        //     //     return <View />;
        //     // }}
        //     // // Override inner list with a custom implemented component
        //     // renderList={listProps => {
        //     //     console.log("LISTPROPS", listProps)
        //     //     return (
        //     //         <View>
        //     //             <SelectableTask task={listProps.items['2024-01-17'][0]} selectedTasks={{ total: 0 }} />
        //     //         </View>
        //     //     );
        //     // }}
        //     // Specify what should be rendered instead of ActivityIndicator
        //     // renderEmptyData={() => {
        //     //     return <View />;
        //     // }}
        //     // // Specify your item comparison function for increased performance
        //     // rowHasChanged={(r1, r2) => {
        //     //     return r1.text !== r2.text;
        //     // }}
        //     // Hide knob button. Default = false
        //     hideKnob={true}
        //     // // When `true` and `hideKnob` prop is `false`, the knob will always be visible and the user will be able to drag the knob up and close the calendar. Default = false
        //     // showClosingKnob={false}
        //     // By default, agenda dates are marked if they have at least one item, but you can override this if needed
        //     // markedDates={{
        //     //     '2012-05-16': { selected: true, marked: true },
        //     //     '2012-05-17': { marked: true },
        //     //     '2012-05-18': { disabled: true }
        //     // }}
        //     // If disabledByDefault={true} dates flagged as not disabled will be enabled. Default = false
        //     disabledByDefault={true}
        //     // If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make sure to also set the refreshing prop correctly
        //     onRefresh={() => console.log('refreshing...')}
        //     // Set this true while waiting for new data from a refresh
        //     refreshing={false}
        //     // Add a custom RefreshControl component, used to provide pull-to-refresh functionality for the ScrollView
        //     refreshControl={null}
        //     // Agenda theme
        //     theme={{
        //         // ...calendarTheme,
        //         agendaDayTextColor: 'blue',
        //         agendaDayNumColor: 'green',
        //         agendaTodayColor: 'red',
        //         agendaKnobColor: 'blue'
        //     }}
        //     // Agenda container style
        //     style={{}}
        // />
        <CalendarProvider date={'2023-01-17'}>
            <WeekCalendar testID={"weekCalendar"} firstDay={1}/>
            <AgendaList
                // sections={{
                //     '2024-01-17': [{ task_id: 1, title: 'Task 1, this is the title' }],
                // }}
                sections={[{
                    title: '2024-01-17',
                    data: [{ task_id: 1, title: 'Task 1, this is the title' }, { task_id: 1, title: 'Task 1, this is the title' }]
                },
                {
                    title: '2024-01-18',
                    data: [{ task_id: 1, title: 'Task 1, this is the title' }]
                },
                {
                    title: '2024-02-18',
                    data: [{ task_id: 1, title: 'Task 1, this is the title' }]
                },
                {
                    title: '2024-03-18',
                    data: [{ task_id: 1, title: 'Task 1, this is the title' }]
                },
                {
                    title: '2024-04-18',
                    data: [{ task_id: 1, title: 'Task 1, this is the title' }]
                },
                {
                    title: '2024-05-18',
                    data: [{ task_id: 1, title: 'Task 1, this is the title' }]
                },
                {
                    title: '2024-06-18',
                    data: [{ task_id: 1, title: 'Task 1, this is the title' }]
                },
                {
                    title: '2024-07-18',
                    data: [{ task_id: 1, title: 'Task 1, this is the title' }]
                },
                {
                    title: '2024-08-18',
                    data: [{ task_id: 1, title: 'Task 1, this is the title' }]
                },
                {
                    title: '2024-09-18',
                    data: [{ task_id: 1, title: 'Task 1, this is the title' }]
                },
                {
                    title: '2024-10-18',
                    data: [{ task_id: 1, title: 'Task 1, this is the title' }]
                }
                ]}
                renderItem={(item, firstItemInDay) => {
                    console.log("THIS IS THE ITEM", item.item)
                    return (
                        <View style={styles.taskContainer}>
                            <SelectableTask task={item.item} selectedTasks={{ total: 0 }} />
                            {/* <Text>{item.title}</Text> */}
                        </View>
                    );
                }}

                // renderSectionHeader={(info) => {
                //     console.log("THIS IS INFO", info)
                //     return (
                //         <View style={styles.dayItem}>
                //             <Text style={styles.dateText}>{utils.parseDatetoPretty(info)}</Text>
                //             <View style={styles.horizontalLine} />
                //         </View>
                //     )
                // }}

                // scrollToNextEvent
                sectionStyle={styles.section}
            // dayFormat={'yyyy-MM-d'}
            />
        </CalendarProvider>
        // <CalendarProvider date={'2022-10-28'} >
        //     <ExpandableCalendar
        //         onCalendarToggled={(isExpanded) => {
        //             setCalendarHeight(isExpanded ? 400 : 200);
        //         }}
        //         calendarStyle={{ height: calendarHeight }}
        //     />
        // </CalendarProvider>
    )
}


export default ProgramadasScreen;