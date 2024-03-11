import React, { useState, useRef, useEffect, useContext } from "react";
import taskService from "../../services/task/taskService";
import { View, Text, Animated, TextInput, FlatList, TouchableOpacity, Modal, TouchableWithoutFeedback, useColorScheme } from "react-native";
import { FontAwesome5, Entypo, FontAwesome, Ionicons, MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import styles from './actionScreen.styles'
import AuthContext from '../../services/auth/context/authContext';
import Checkbox from "../../components/common/Tickbox";
import Colors from "../../styles/colors";
import ProjectBadge from "../../components/common/ProjectBadge";

const getTaskItemStyle = () => {
  return {
    ...styles.taskContainer,
  };
};

const LeftSwipeActions = (showMovePopUp, id, isMenuVisible) => {
  // const width = translateX.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: ['30%', '100%'],
  //   extrapolate: 'clamp',
  // });
  // const borderTopRightRadius = translateX.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: [0, 10],
  //   extrapolate: 'clamp',
  // });
  // const borderBottomRightRadius = translateX.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: [0, 10],
  //   extrapolate: 'clamp',
  // });

  return (
    // <Animated.View
    <TouchableOpacity
      // style={[styles.leftSwipe, { borderTopRightRadius }, { borderBottomRightRadius }]}
      style={[styles.leftSwipe, { height: (isMenuVisible ? 'auto' : 52) }]}
      onPress={() => showMovePopUp(id)}
    >
      <Text>
        <Entypo name="archive" size={20} color="white" />
      </Text>
    </TouchableOpacity>
  );
};

const RightSwipeActions = ({ showCompleteModal, id, translateX, isMenuVisible }) => {
  return (
    <TouchableOpacity
      style={[styles.rightSwipe, { transform: [{ translateX: translateX }], height: (isMenuVisible ? 'auto' : 52) }]}
      onPress={() => showCompleteModal(id)}
    >
      <Text>
        <FontAwesome5
          name="trash"
          size={20}
          color="white"
        />
      </Text>
    </TouchableOpacity>
  );
};

function formattedDate(date) {
  const dateLimit = new Date(date)
  const year = dateLimit.getFullYear();
  const month = (dateLimit.getMonth() + 1).toString().padStart(2, '0');
  const day = dateLimit.getDate().toString().padStart(2, '0');
  const hours = dateLimit.getHours().toString().padStart(2, '0');
  const minutes = dateLimit.getMinutes().toString().padStart(2, '0');

  return `${year}/${month}/${day} ${hours}:${minutes}`;
};

function recortarTitle(title) {
  let t = title;
  return `${t.substring(0, 20)}...`;
}

const SelectableTask = ({ task, onPress, onDelete, scale, opacity, selectedTasks, showMovePopUp, showEditPopUp, showCompleteModal }) => {
  const [isSwiped, setIsSwiped] = useState(true);
  const translateX = useRef(new Animated.Value(0)).current;
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const leftActions = selectedTasks.total > 0 ? () => null : () => LeftSwipeActions(showMovePopUp, task.task_id, isMenuVisible);
  const rightActions = selectedTasks.total > 0 ? () => null : () => RightSwipeActions({ showCompleteModal, id: task.task_id, translateX, isMenuVisible });
  // const backgroundTask = translateX.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: ['#f2f2f2', 'rgba(0, 0, 0, 0)'],
  //   extrapolate: 'clamp',
  // });
  const theme = useColorScheme();

  useEffect(() => {
    const subscription = translateX.addListener(({ value }) => {
      // setIsSwiped(value === 0);
    });

    return () => {
      translateX.removeListener(subscription);
    };
  }, [translateX]);


  return (<Swipeable
    renderLeftActions={leftActions}
    renderRightActions={rightActions}
    onSwipeableClose={selectedTasks.total > 0 ? () => null : () => {
      Animated.timing(translateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }}
    overshootLeft={false}
    overshootRight={false}
    onSwipeableLeftWillOpen={selectedTasks.total > 0 ? () => null : () => {
      Animated.timing(translateX, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          //ArchiveTask(id, title);
        }, 200);
      });
    }}
    onSwipeableLeftWillClose={selectedTasks.total > 0 ? () => null : () => {
      Animated.timing(translateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }}
    friction={2}
  >
    <TouchableWithoutFeedback
      // onLongPress={() => onPress(id)}
      onPress={() => {
        // if (isSelected) onPress(id);
        setIsMenuVisible(!isMenuVisible);
      }}
    >
      <Animated.View style={[getTaskItemStyle(), { flexDirection: 'column', justifyContent: 'center', backgroundColor: (isMenuVisible ?  Colors[theme].activeColor : Colors[theme].themeColor), transform: [{ scale }], opacity, height: (isMenuVisible && !selectedTasks[task.task_id] ? 'auto' : 52) }]}>
        {isSwiped && (
          <View style={{ flexDirection: 'row', width: '100%' }}>
            <View style={{ flexDirection: 'column', width: (isMenuVisible ? '100%' : '88%') }}>
              <View style={styles.innerContainer}>
                <View style={[
                  { flex: 1 },
                  { flexDirection: 'row' },
                  { alignItems: 'center' },
                  (!selectedTasks[task.task_id] && isMenuVisible) ? null : { marginRight: 20 }
                ]}>
                  <TouchableOpacity onPress={() => { onPress(task.task_id) }} style={{ marginRight: '5%' }}>
                    {!selectedTasks[task.task_id] && (
                      <Checkbox selected={false} />
                      // <FontAwesome name="circle-o" size={24} color="#a0a0a0" /> 
                    )}
                    {selectedTasks[task.task_id] && (
                      <Checkbox selected={true} />
                      // <FontAwesome name="check-circle" size={24} color="#f39f18" />
                    )}
                  </TouchableOpacity>
                  <Text style={{ color:Colors[theme].white, textAlign: 'center', fontSize: 15, fontWeight: (isMenuVisible && !selectedTasks[task.task_id] ? 'bold' : 'normal'), marginRight: '5%' }}>
                    {(task.title.length > 37 && (!isMenuVisible || selectedTasks[task.task_id])) ? `${task.title.substring(0, 30)}...` : task.title}
                  </Text>
                </View>
                <View
                  style={[
                    { flexDirection: 'row' },
                  ]}>
                  {isMenuVisible && task.important_fixed && (
                    <Ionicons name="flag" size={15} color="#be201c" />
                  )}
                </View>
              </View>
              {task.project_id != null && !isMenuVisible && <View style={{ marginTop: 3, marginLeft: 3 }}>
                <ProjectBadge project={{ title: task.project_title, color: task.project_color }} little={true} />
              </View>}
              {!selectedTasks[task.task_id] && isMenuVisible && (
                // <Menu
                //   trigger={(triggerProps) => (
                //     <TouchableOpacity {...triggerProps}>
                //       <Entypo name="dots-three-vertical" size={20} color="#a0a0a0" />
                //     </TouchableOpacity>
                //   )}
                //   style={styles.menuContainer}
                //   placement="left"
                // >
                //   <Menu.Item style={styles.menuItem} onPress={() => showMovePopUp(task.task_id)}>Mover a</Menu.Item>
                //   {/* <Separator /> */}
                //   <Menu.Item style={styles.menuItem}
                //     onPress={() => { showEditPopUp(task.task_id) }}>
                //     Editar
                //   </Menu.Item>
                // </Menu>
                <View style={{ flexDirection: 'column' }}>
                  <View style={{ marginLeft: '11%' }}>
                    <Text style={{ color:Colors[theme].white }}>{task.description}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', marginTop: 8, width: '100%', justifyContent: 'flex-end' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: task.date_limit ? '100%' : '100%' }}>
                      <View style={{ flexDirection: 'column', flexWrap: 'wrap', width: '80%', alignItems: 'flex-end', justifyContent: "flex-start", alignItems: 'flex-start' }}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                          {task.date_limit && (
                            <Text style={{ color:Colors[theme].white, fontSize: 12, marginBottom: 5, marginRight: 10, }}>
                              <Ionicons name="calendar-outline" size={16} color="#008080" />
                              &nbsp; {formattedDate(task.date_limit)}
                            </Text>
                          )}
                          {task.project_id != null && <ProjectBadge project={{ title: task.project_title, color: task.project_color }} />}
                        </View>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                          {task.tags && Object.keys(task.tags).map((key, index) => (
                            <View key={index} style={[styles.tagsOnTask, { backgroundColor: task.tags[key].color }]}>
                              <FontAwesome name="tag" size={10} color='white' style={{ marginRight: 3 }} />
                              <Text style={{ color:'white', paddingBottom: 3, fontSize: 12 }}>{task.tags[key].name}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <TouchableOpacity onPress={() => showEditPopUp(task.task_id)}>
                          <MaterialCommunityIcons name="circle-edit-outline" size={22} color="#ffa540" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </View>
            {!isMenuVisible && (
              <View style={{ flexDirection: 'row', alignItems: 'center', width: '12%', justifyContent: 'flex-end' }}>
                {task.important_fixed && (
                  <Ionicons name="flag" size={15} color="#be201c" />
                )}
                {task.tags && (
                  <FontAwesome name="tag" size={20} color={Colors[theme].white} style={{ marginLeft: 7 }} />
                )}
              </View>
            )}
          </View>
        )}
      </Animated.View >
    </TouchableWithoutFeedback>
  </Swipeable>)
};

export default SelectableTask;