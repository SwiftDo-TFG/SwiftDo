import { FlatList, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Animated, Modal, Dimensions, TouchableWithoutFeedback, View, Text } from 'react-native';
import styles from '../screens/inbox/inbox.styles'
import Modalize from 'react-native-modalize'



const dvHeight = Dimensions.get('window').height;

export class PopUpModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      translateY: new Animated.Value(dvHeight),
      show: false,
      editedTitle: '',
    };
  }

  componentDidUpdate(prevProps) {
    const { data } = this.props;
    const { editedTitle } = this.state;

    if (!this.isEditingLocally) {
      if (data.length > 0 && editedTitle !== data[0].title) {
        this.setState({ editedTitle: data[0].title });
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

  onTextChange = (text) => {
    this.setState({ editedTitle: text });
    this.isEditingLocally = true;
  };

  show = () => {
    this.setState({ show: true });
  };

  hide = () => {
    this.setState({ show: false });
    this.isEditingLocally = false;
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

  renderTitle = () => {
    const { title } = this.props;
    return (
      <View style={{ alignItems: 'center' }}>
        <Text style={{ color: '#182E44', fontSize: 23, fontWeight: '500', marginTop: 15, marginBottom: 30 }}>
          {title}
        </Text>
      </View>
    );
  };

  renderContent = () => {
    const { data, mode } = this.props;

    return (
      <View>
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
      </View>
    );
  };

  renderItem = (item, mode) => {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {mode === 'edit' ? (
          <>
            <TextInput
              style={{ fontSize: 16, fontWeight: 'normal', color: '#182E44', borderBottomWidth: 1, borderColor: '#182E44' }}
              value={this.state.editedTitle}
              onChangeText={this.onTextChange}
            />
            <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'center' }}>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => {
                  this.props.onAccept(this.state.editedTitle);
                  this.hide();
                }}>
                <Text style={styles.acceptButtonText}>Aceptar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                  // Agrega la lógica para eliminar aquí
                }}>
                <Text style={styles.deleteButtonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={{height: 50, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: 'normal', color: '#182E44' }}>{item.title}</Text>
          </View>
        )}
      </View>
    );
  };

  renderSeparator = () => {
    return <View style={{ opacity: 0.1, backgroundColor: '#182E44', height: 1 }} />;
  };

  render() {
    const { touch } = this.props;
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
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              paddingHorizontal: 10,
              maxHeight: dvHeight * 0.6,
              minHeight: dvHeight * 0.4,
            }}
          >
            {this.renderTitle()}
            {this.renderContent()}
          </Animated.View>
        </View>
      </Modal>
    );
  }
}


