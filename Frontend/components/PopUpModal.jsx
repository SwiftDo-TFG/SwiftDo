import { FlatList, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { StyleSheet, Animated, Modal, Dimensions, TouchableWithoutFeedback, View, Text } from 'react-native';
import styles from '../screens/inbox/inbox.styles'
import Modalize from 'react-native-modalize'
import { FontAwesome5, Ionicons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import DatePicker from 'react-native-modern-datepicker';



const dvHeight = Dimensions.get('window').height;
const today = new Date();

export class PopUpModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      translateY: new Animated.Value(dvHeight),
      show: false,
      editedTitle: '',
      editedDescription: '',
      isImportant: false,
      date_name: 'Fecha',
      showDatePicker: false,
      state: "1",
      showStatusSelector: false,
    };
  }

  toggleImportant = () => {
    this.setState((prevState) => ({
      isImportant: !prevState.isImportant,
    }));
  };

  componentDidUpdate(prevProps) {
    if (this.state.show !== prevProps.show) {
      this.animateModal();
    }
  }
  animateModal() {
    const { show, translateY } = this.state;
    Animated.timing(translateY, {
      toValue: show ? 0 : dvHeight,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }
  onTitleChange = (text) => {
    this.setState({ editedTitle: text });
    this.isEditingTitle = true;
  };
  onDescriptionChange = (text) => {
    this.setState({ editedDescription: text });
    this.isEditingDescription = true;
  };

  todayDate = (date) =>{
    return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} 00:00`;
  }

  onAcceptFunction = (item, state) => {
    const updatedTask = {};
    Object.keys(item).forEach(key => {
      if (item[key] !== null) {
        updatedTask[key] = item[key];
      }
    });
    console.log("FECHA: ", this.state.date_name)
    if (this.state.date_name !== 'Fecha') updatedTask.date_limit = new Date(this.state.date_name.replace(/(\d{4})\/(\d{2})\/(\d{2}) (\d{2}:\d{2})/, '$1-$2-$3T$4:00'));
    else if(state === "3") updatedTask.date_limit = today
    if (this.state.editedDescription !== '') updatedTask.description = this.state.editedDescription;
    updatedTask.title = this.state.editedTitle;
    updatedTask.important_fixed = this.state.isImportant;
    updatedTask.state = state;
    console.log(updatedTask)
    this.props.onAccept(updatedTask);
    this.hide();
  }

  handleSelectState = (state) => {
    if (state === "3") this.setState({ date_name: `${today.getFullYear()}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')} 00:00` })
    else this.setState({ date_name: 'Fecha' })
    console.log("STATE: ", state)
    this.setState({ state: state, showStatusSelector: false });
  };

  show = (task) => {
    console.log(task)
    this.setState({ show: true }); this.setState({ show: true });
    if (task) {
      this.setState({ editedTitle: task.title });
      if (task.description) {
        this.setState({ editedDescription: task.description });
      }
      this.setState({ isImportant: task.important_fixed })
      if (task.date_limit) {
        const dateLimit = new Date(task.date_limit)
        const formattedDate = `${dateLimit.getFullYear()}/${(dateLimit.getMonth() + 1).toString().padStart(2, '0')}/${dateLimit.getDate().toString().padStart(2, '0')} 00:00`;
        this.setState({ date_name: formattedDate });
      }
      this.setState({ state: task.state })
    }
  };

  hide = () => {
    this.setState({ show: false, editedTitle: '', editedDescription: '', isImportant: false, date_name: 'Fecha', state: "1" });
    this.isEditingTitle = false;
    this.isEditingDescription = false;
  };
  renderOutside(touch) {
    const view = <View style={{ flex: 1, width: '100%' }} />;
    if (!touch) return view;
    return (
      <TouchableWithoutFeedback onPress={touch} style={{ flex: 1, width: '100%' }}>
        {view}
      </TouchableWithoutFeedback>
    );
  }
  renderTitle = (mode) => {
    const { title } = this.props;
    return (
      <View style={(mode === 'edit' || mode === 'add') ? { alignItems: 'flex-start', marginLeft: 20, marginRight: 8 } : { alignItems: 'center' }}>
        {(mode === 'edit' || mode === 'add') ? (
          <TextInput
            style={{ color: '#182E44', fontSize: 23, fontWeight: '500', marginTop: 15, marginBottom: 10, width: '100%' }}
            value={this.state.editedTitle}
            placeholder="Nueva Tarea"
            onChangeText={this.onTitleChange}
            maxLength={50}
            multiline={true}
          />
        ) : (
          <Text style={{ color: '#182E44', fontSize: 23, fontWeight: '500', marginTop: 15 }}>
            {title}
          </Text>
        )}
      </View>
    );
  };
  renderContent = (mode) => {
    const { data } = this.props;
    return (
      <View style={{ height: '100%', justifyContent: 'flex-end' }}>
        {mode === 'move' ? (
          <FlatList
            style={{ marginBottom: 20 }}
            showsVerticalScrollIndicator={false}
            data={data}
            renderItem={({ item }) => this.renderItem(item, mode)}
            extraData={data}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={this.renderSeparator()}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        ) : (
          <View style={{ height: '100%', marginLeft: 20, marginRight: 8 }}>
            {this.renderItem(data[0], mode)}
          </View>
        )}
      </View>
    );
  };
  renderItem = (item, mode) => {
    return (
      <>
        {(mode === 'edit' || mode === 'add') ? (
          <View style={styles.editStyle}>
            <View style={{ height: '50%' }}>
              <TextInput
                style={{ fontSize: 16, fontWeight: 'normal', color: '#182E44', }}
                value={this.state.editedDescription}
                placeholder="Descripcion..."
                onChangeText={this.onDescriptionChange}
                multiline={true}
                maxLength={200}
              />
            </View>
            <View style={{ height: '50%', width: '100%', flexDirection: 'column', marginTop: 10, justifyContent: 'flex-start' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => this.setState({ showDatePicker: true })}>
                  <Text style={{ color: '#a0a0a0' }}>
                    <Ionicons name="calendar-outline" size={22} color="#a0a0a0" />
                    &nbsp; {this.state.date_name}
                  </Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '30%' }}>
                  <TouchableOpacity>
                    <Text>
                      <FontAwesome5 name="user" size={22} color="#a0a0a0" />
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Text>
                      <MaterialCommunityIcons name="file-document-outline" size={23} color="#a0a0a0" />
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.toggleImportant}>
                    <Text>
                      {this.state.isImportant ? (
                        <Ionicons name="flag" size={22} color="#be201c" />
                      ) : (
                        <Ionicons name="flag-outline" size={22} color="#a0a0a0" />
                      )}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Text>
                      <MaterialCommunityIcons name="tag-outline" size={23} color="#a0a0a0" />
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'ceneter', marginTop: 13 }}>
                <TouchableOpacity onPress={() => this.setState({ showStatusSelector: true })}>
                  <Text style={{ fontSize: 18 }}>
                    {
                      (this.state.state === "2") ? (
                        <>
                          <FontAwesome5 name="bolt" size={20} color={'#ffd700'} />
                          &nbsp; Cuanto Antes
                        </>
                      ) : (this.state.state === "3") ? (
                        <>
                          <Ionicons name="calendar-outline" size={20} color={'#008080'} />
                          &nbsp; Programada
                        </>
                      ) : (this.state.state === "4") ? (
                        <>
                          <Entypo name="archive" size={20} color="#d2b48c" />
                          &nbsp; Archivadas
                        </>
                      ) : (
                        <>
                          <FontAwesome5 name="inbox" size={20} color="#f39f18" />
                          &nbsp; Inbox
                        </>
                      )
                    }
                  </Text>
                </TouchableOpacity>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={this.state.showStatusSelector}
                  onRequestClose={() => this.setState({ showStatusSelector: false })}
                >
                  <View style={styles.modalContainer}>
                    <View style={styles.modalStyle}>
                      <TouchableOpacity onPress={() => this.handleSelectState("2")}>
                        <View style={styles.textContainer}>
                          <FontAwesome5 name="bolt" size={20} color={'#ffd700'} style={{ width: '15%' }} />
                          <Text style={{ fontSize: 17 }}>Cuanto Antes</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this.handleSelectState("3")}>
                        <View style={styles.textContainer}>
                          <Ionicons name="calendar-outline" size={20} color={'#008080'} style={{ width: '15%' }} />
                          <Text style={{ fontSize: 17 }}>Programada</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this.handleSelectState("4")}>
                        <View style={styles.textContainer}>
                          <Entypo name="archive" size={20} color="#d2b48c" style={{ width: '15%' }} />
                          <Text style={{ fontSize: 17 }}>Archivadas</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this.handleSelectState("1")}>
                        <View style={styles.textContainer}>
                          <FontAwesome5 name="inbox" size={20} color="#f39f18" style={{ width: '15%' }} />
                          <Text style={{ fontSize: 17 }}>Inbox</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => this.onAcceptFunction(item, this.state.state)}>
                  <Text style={styles.acceptButtonText}>Aceptar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <View>
            <View style={styles.moveContainer}>
              <View style={styles.moveStyle}>
                <TouchableOpacity onPress={() => {
                  this.onAcceptFunction(item, "2");
                }}>
                  <View style={styles.textContainer}>
                    <FontAwesome5 name="bolt" size={20} color={'#ffd700'} style={{ width: '15%' }} />
                    <Text style={{ fontSize: 17 }}>Cuanto Antes</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  this.onAcceptFunction(item, "3");
                }}>
                  <View style={styles.textContainer}>
                    <Ionicons name="calendar-outline" size={20} color={'#008080'} style={{ width: '15%' }} />
                    <Text style={{ fontSize: 17 }}>Programada</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  this.onAcceptFunction(item, "4");
                }}>
                  <View style={styles.textContainer}>
                    <Entypo name="archive" size={20} color="#d2b48c" style={{ width: '15%' }} />
                    <Text style={{ fontSize: 17 }}>Archivadas</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  this.onAcceptFunction(item, "1");
                }}>
                  <View style={styles.textContainer}>
                    <FontAwesome5 name="inbox" size={20} color="#f39f18" style={{ width: '15%' }} />
                    <Text style={{ fontSize: 17 }}>Inbox</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </>
    );
  }
  renderSeparator = () => {
    return <View style={{ opacity: 0.1, backgroundColor: '#182E44', height: 1 }} />;
  };
  render() {
    const { touch, mode } = this.props;
    const { translateY } = this.state;
    return (
      <Modal animationType={'fade'} transparent={true} visible={this.state.show} onRequestClose={this.close}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' }}>
          {this.renderOutside(touch)}
          <Animated.View
            style={{
              transform: [{ translateY }],
              backgroundColor: '#FFFFFF',
              width: '100%',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingHorizontal: 10,
              justifyContent: 'space-between',
              maxHeight: dvHeight * 0.4,
              minHeight: dvHeight * 0.4,
            }}
          >
            {this.renderTitle(mode)}
            {this.renderContent(mode)}
          </Animated.View>
          <Modal
            transparent={true}
            animationType={'fade'}
            visible={this.state.showDatePicker}
            onRequestClose={() => this.setState({ showDatePicker: false })}
          >
            <View style={styles.modalDatePickerContainer}>

              <TouchableWithoutFeedback onPress={() => this.setState({ showDatePicker: false })}>

                <View style={styles.modalDatePickerBackground} />
              </TouchableWithoutFeedback>

              <View style={[styles.modalDatePickerContent, { zIndex: 2 }]}>
                <DatePicker
                  onSelectedChange={(date) => {
                    if (date !== this.state.date_name) {
                      if (this.state.date_name !== 'Fecha') this.setState({ showDatePicker: false })
                      this.setState({ date_name: date, state: "3" });
                    }
                  }}
                  selected={this.state.date_name === 'Fecha' ? today.toISOString().split('T')[0] : this.state.date_name}
                  current={this.state.date_name === 'Fecha' ? today.toISOString().split('T')[0] : this.state.date_name}
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
              </View>
            </View>
          </Modal>
        </View>
      </Modal>
    );
  }
}