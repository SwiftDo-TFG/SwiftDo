import { View, ActivityIndicator, StyleSheet } from "react-native";


export default function LoadingIndicator() {
    return (
      <View style={styles.loadingContainer}>
         <ActivityIndicator size="large" />
      </View>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        padding: 10,
        flex: 0.5,
        justifyContent: 'center'
    }
})