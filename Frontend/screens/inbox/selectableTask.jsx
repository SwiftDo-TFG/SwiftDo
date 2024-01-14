import React, { useState, useRef, useEffect, useContext } from "react";
import taskService from "../../services/task/taskService";
import { View, Text, Animated, TextInput, FlatList, TouchableOpacity, Modal, TouchableWithoutFeedback } from "react-native";
import { FontAwesome5, Entypo, FontAwesome } from '@expo/vector-icons';
import { NativeBaseProvider, VStack, Box, Menu, extendTheme, Checkbox } from "native-base";
import Swipeable from 'react-native-gesture-handler/Swipeable';

import styles from './inbox.styles'
import { PopUpModal } from "../../components/PopUpModal";
import AuthContext from '../../services/auth/context/authContext';

const getTaskItemStyle = () => {
    return {
      ...styles.taskContainer,
    };
};

const LeftSwipeActions = (showMovePopUp) => {
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
        style={[styles.leftSwipe]}
        onPress={showMovePopUp}
      >
        <Text
          style={{
            paddingHorizontal: '5%',
            paddingVertical: '10%',
          }}
        // style={{
        //   paddingHorizontal: 10,
        //   fontWeight: "600",
        //   paddingHorizontal: 30,
        //   paddingVertical: 20,
        // }}
        >
          <Entypo name="archive" size={20} color="white" />
        </Text>
      </TouchableOpacity>
    );
  };

  const RightSwipeActions = ({ onDelete, id, translateX }) => {
    return (
      <TouchableOpacity
        style={[styles.rightSwipe, { transform: [{ translateX: translateX }], }]}
        onPress={() => onDelete(id)}
      >
        <Text
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: '5%',
            paddingVertical: '10%',
          }}
        >
          <FontAwesome5
            name="trash"
            size={20}
            color="white"
          />
        </Text>
      </TouchableOpacity>
    );
  };

const SelectableTask = ({task, onPress, onDelete, scale, opacity, selectedTasks,showMovePopUp, showEditPopUp}) => {
    const [isSwiped, setIsSwiped] = useState(true);
    const translateX = useRef(new Animated.Value(0)).current;
    const leftActions = selectedTasks.total > 0 ? () => null : () => LeftSwipeActions(showMovePopUp);
    const rightActions = selectedTasks.total > 0 ? () => null : () => RightSwipeActions({ onDelete, id: task.task_id, translateX });
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    // const backgroundTask = translateX.interpolate({
    //   inputRange: [0, 1],
    //   outputRange: ['#f2f2f2', 'rgba(0, 0, 0, 0)'],
    //   extrapolate: 'clamp',
    // });

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
      onSwipeableClose={selectedTasks.total > 0 ? () => null :() => {
        Animated.timing(translateX, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }}
      overshootLeft={false}
      overshootRight={false}
      onSwipeableLeftWillOpen={selectedTasks.total > 0 ? () => null :() => {
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
      onSwipeableLeftWillClose={selectedTasks.total > 0 ? () => null :() => {
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
        <Animated.View style={[getTaskItemStyle(), { backgroundColor: selectedTasks[task.task_id] ? '#ebd7b5' : '#f2f2f2', transform: [{ scale }], opacity }]}>
          {isSwiped && (
            <View style={styles.innerContainer}>
              <View style={[
                { flex: 1 },
                { flexDirection: 'row' },
                { alignItems: 'center' },
              ]}>
                <TouchableOpacity onPress={() => {onPress(task.task_id)}} style={{ marginRight: '5%' }}>
                  {!selectedTasks[task.task_id] && (
                    <FontAwesome name="circle-o" size={24} color="#a0a0a0" />
                  )}
                  {selectedTasks[task.task_id] && (
                    <FontAwesome name="check-circle" size={24} color="#f39f18" />
                  )}
                </TouchableOpacity>
                <Text>{task.title}</Text>
              </View>
              {!selectedTasks[task.task_id] && isMenuVisible && (
                <Menu
                  trigger={(triggerProps) => (
                    <TouchableOpacity {...triggerProps}>
                      <Entypo name="dots-three-vertical" size={20} color="#a0a0a0" />
                    </TouchableOpacity>
                  )}
                  style={styles.menuContainer}
                  placement="left"
                >
                  <Menu.Item style={styles.menuItem} onPress={showMovePopUp}>Mover a</Menu.Item>
                  {/* <Separator /> */}
                  <Menu.Item style={styles.menuItem}
                    onPress={() => { showEditPopUp(task.task_id) }}>
                    Editar
                  </Menu.Item>
                </Menu>
              )}
            </View>
          )}
        </Animated.View >
      </TouchableWithoutFeedback>
    </Swipeable>)
  };

  export default SelectableTask;