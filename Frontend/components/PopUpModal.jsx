import { FlatList, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Animated, Modal, Dimensions, TouchableWithoutFeedback, View, Text } from 'react-native';
import styles from '../screens/inbox/inbox.styles'
import Modalize from 'react-native-modalize'
import { FontAwesome5, Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';



const dvHeight = Dimensions.get('window').height;

export class PopUpModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      translateY: new Animated.Value(dvHeight),
      show: false,
      editedTitle: '',
      editedDescription: '',
    };
  }

  componentDidUpdate(prevProps) {
    const { data, mode } = this.props;
    const { editedTitle, editedDescription } = this.state;
    if (!this.isEditingTitle && mode === 'edit') {
      if (data.length > 0 && editedTitle !== data[0].title) {
        this.setState({ editedTitle: data[0].title });
      }
    }
    if (!this.isEditingDescription && mode === 'edit') {
      if (data.length > 0 && editedDescription !== data[0].description) {
        this.setState({ editedDescription: data[0].description });
      }
    }

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

  show = () => {
    this.setState({ show: true });
  };

  hide = () => {
    this.setState({ show: false });
    this.setState({ editedTitle: '' });
    this.setState({ editedDescription: '' });
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
            multiline={false}
          />
        ) : (
          <Text style={{ color: '#182E44', fontSize: 23, fontWeight: '500', marginTop: 15, marginBottom: 10 }}>
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
              />
            </View>
            <View style={{ height: '50%', width: '100%', flexDirection: 'column', marginTop: 10, justifyContent: 'flex-start' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity>
                  <Text style={{ color: '#a0a0a0' }}>
                    <Ionicons name="calendar-outline" size={22} color="#a0a0a0" />
                    &nbsp; Fecha
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
                  <TouchableOpacity>
                    <Text>
                      <Feather name="flag" size={22} color="#a0a0a0" />
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
                <Text style={{ fontSize: 18 }}>
                  <FontAwesome5 name="inbox" size={20} color="#f39f18" />
                  &nbsp; Inbox
                </Text>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => {
                    const updatedTask = {
                      ...item,
                      title: this.state.editedTitle,
                      description: this.state.editedDescription,
                    };
                
                    this.props.onAccept(updatedTask);
                    this.hide();
                  }}>
                  <Text style={styles.acceptButtonText}>Aceptar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.moveStyle}>
            <View style={{ height: 50, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: 'normal', color: '#182E44' }}>{item.title}</Text>
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
        <View style={{ flex: 1, backgroundColor: '#000000AA', justifyContent: 'flex-end' }}>
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
        </View>
      </Modal>
    );
  }
}


