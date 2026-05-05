import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check } from "lucide-react-native";
import { Desk, Room } from "../types/booking";

interface SuccessScreenProps {
  desk: Desk;
  room: Room;
  startTime: string;
  onRelease: () => void;
  onHome: () => void;
}

export default function SuccessScreen({
  desk,
  room,
  startTime,
  onRelease,
  onHome,
}: SuccessScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <View style={styles.iconBackground} />
            <View style={styles.iconCircle}>
              <Check color="#ffffff" size={40} strokeWidth={3} />
            </View>
          </View>

          <Text style={styles.title}>Место забронировано!</Text>
          <Text style={styles.subtitle}>
            Стол {desk.id}, кабинет {room.name.replace("Кабинет ", "")}
          </Text>

          <View style={styles.timeContainer}>
            <Text style={styles.timeLabel}>Время начала</Text>
            <Text style={styles.timeValue}>{startTime}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.releaseButton} onPress={onRelease}>
            <Text style={styles.releaseText}>Освободить место</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.homeButton} onPress={onHome}>
            <Text style={styles.homeText}>На главную</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
  },
  content: {
    flex: 1,
    alignItems: "center",
  },
  iconContainer: {
    position: "relative",
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBackground: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(34,197,94,0.2)",
    // Blur is tricky in RN without expo-blur, but the style shows it
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#22c55e",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    marginTop: 24,
    fontSize: 24,
    fontWeight: "bold",
    color: "#fafafa",
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: "#a1a1aa",
  },
  timeContainer: {
    marginTop: 32,
    width: "100%",
    alignItems: "center",
  },
  timeLabel: {
    fontSize: 12,
    color: "#a1a1aa",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  timeValue: {
    marginTop: 4,
    fontSize: 32,
    fontWeight: "600",
    color: "#fafafa",
    fontVariant: ["tabular-nums"],
  },
  actions: {
    gap: 12,
    alignItems: "center",
  },
  releaseButton: {
    width: "100%",
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#27272a",
    alignItems: "center",
    justifyContent: "center",
  },
  releaseText: {
    color: "#fafafa",
    fontSize: 16,
    fontWeight: "600",
  },
  homeButton: {
    paddingVertical: 8,
  },
  homeText: {
    color: "#fafafa",
    fontSize: 14,
    fontWeight: "600",
  },
});
