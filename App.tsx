import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Confetti from "./components/Confetti";

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <Confetti />
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
