import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';

const CustomBottomSheet = () => {
    // ref
  const bottomSheetModalRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  // callbacks
//   const handlePresentModalPress = useCallback(() => {
//     bottomSheetModalRef.current?.present();
//   }, []);
    const openBottomSheetModal = () =>{
        bottomSheetModalRef.current?.present()
    }

  // renders
  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <Button
          onPress={openBottomSheetModal}
          title="Present Modal"
          color="black"
        />
        <BottomSheetModal ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
        >
          {/* <BottomSheetView style={styles.contentContainer}> */}
            <Text>Awesome 🎉</Text>
          {/* </BottomSheetView> */}
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

export default CustomBottomSheet; 