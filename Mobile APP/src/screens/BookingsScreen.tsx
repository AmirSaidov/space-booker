import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, MapPin, Clock, QrCode } from "lucide-react-native";
import { BottomNav, NavKey } from "../components/booking/BottomNav";
import { Booking } from "../types/booking";

interface Props {
  bookings: Booking[];
  onCancel: (id: string) => void;
  onScan: () => void;
  onNavigate: (key: NavKey) => void;
  isAdmin?: boolean;
}

export default function BookingsScreen({ bookings, onCancel, onScan, onNavigate, isAdmin = false }: Props) {
  const active = bookings.filter((b) => b.status === "active");

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Мои брони</Text>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
          {active.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Calendar color="#a1a1aa" size={28} />
              </View>
              <Text style={styles.emptyText}>У вас пока нет активных броней</Text>
              <TouchableOpacity style={styles.scanButton} onPress={onScan}>
                <QrCode color="#0a0a0a" size={16} />
                <Text style={styles.scanButtonText}>Сканировать QR</Text>
              </TouchableOpacity>
            </View>
          ) : (
            active.map((b) => (
              <View key={b.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.deskTitle}>Стол {b.deskId}</Text>
                    <Text style={styles.deskSubtitle}>Активна</Text>
                  </View>
                  <View style={styles.activeBadge}>
                    <Text style={styles.activeBadgeText}>Активна</Text>
                  </View>
                </View>

                <View style={styles.infoRows}>
                  <View style={styles.infoRow}>
                    <MapPin color="#a1a1aa" size={16} />
                    <Text style={styles.infoText}>{b.roomName}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Calendar color="#a1a1aa" size={16} />
                    <Text style={styles.infoText}>{b.date}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Clock color="#a1a1aa" size={16} />
                    <Text style={styles.infoText}>с {b.startTime}</Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.releaseButton} onPress={() => onCancel(b.id)}>
                  <Text style={styles.releaseText}>Освободить</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>

        <BottomNav active="bookings" isAdmin={isAdmin} onNavigate={onNavigate} />
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
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fafafa",
  },
  content: {
    flex: 1,
  },
  contentInner: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 12,
  },
  // Empty state
  emptyState: {
    marginTop: 64,
    alignItems: "center",
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    marginTop: 16,
    fontSize: 14,
    color: "#a1a1aa",
  },
  scanButton: {
    marginTop: 24,
    flexDirection: "row",
    height: 44,
    paddingHorizontal: 20,
    backgroundColor: "#fafafa",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  scanButtonText: {
    color: "#0a0a0a",
    fontSize: 14,
    fontWeight: "600",
  },
  // Card
  card: {
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#27272a",
    borderRadius: 16,
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  deskTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fafafa",
  },
  deskSubtitle: {
    fontSize: 12,
    color: "#a1a1aa",
    marginTop: 2,
  },
  activeBadge: {
    backgroundColor: "rgba(34,197,94,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  activeBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#22c55e",
  },
  infoRows: {
    marginTop: 16,
    gap: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#fafafa",
  },
  releaseButton: {
    marginTop: 16,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  releaseText: {
    color: "#ef4444",
    fontSize: 14,
    fontWeight: "600",
  },
});
