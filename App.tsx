import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Painting from "./components/Painting/Painting";

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <Painting />
        <StatusBar style="auto" />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
