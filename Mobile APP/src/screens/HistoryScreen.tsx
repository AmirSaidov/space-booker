import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Calendar, Trash2 } from "lucide-react-native";
import { BottomNav, NavKey } from "../components/booking/BottomNav";
import { Booking } from "../types/booking";

interface Props {
  bookings: Booking[];
  isAdmin?: boolean;
  onNavigate: (key: NavKey) => void;
  onClearHistory: () => void;
}

export default function HistoryScreen({ bookings, isAdmin = false, onNavigate, onClearHistory }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <Text style={styles.headerTitle}>История</Text>
          <TouchableOpacity style={styles.trashButton} onPress={onClearHistory}>
            <Trash2 color="#a1a1aa" size={20} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
          {bookings.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Calendar color="#a1a1aa" size={28} />
              </View>
              <Text style={styles.emptyText}>История пуста</Text>
            </View>
          ) : (
            bookings.map((b) => {
              const statusLabel =
                b.status === "active" ? "Активна" : b.status === "completed" ? "Завершена" : "Отменена";
              const badgeStyle =
                b.status === "active"
                  ? styles.badgeActive
                  : b.status === "completed"
                  ? styles.badgeCompleted
                  : styles.badgeCancelled;
              const badgeTextStyle =
                b.status === "active"
                  ? styles.badgeTextActive
                  : b.status === "completed"
                  ? styles.badgeTextCompleted
                  : styles.badgeTextCancelled;

              return (
                <View key={b.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View>
                      <Text style={styles.deskTitle}>Стол {b.deskId}</Text>
                      <Text style={styles.dateText}>{b.date}</Text>
                    </View>
                    <View style={[styles.badge, badgeStyle]}>
                      <Text style={[styles.badgeText, badgeTextStyle]}>{statusLabel}</Text>
                    </View>
                  </View>

                  <View style={styles.infoRow}>
                    <MapPin color="#a1a1aa" size={16} />
                    <Text style={styles.infoText}>{b.roomName}</Text>
                    {b.endTime && (
                      <Text style={styles.timeRange}>
                        {b.startTime}–{b.endTime}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

        <BottomNav active="history" isAdmin={isAdmin} onNavigate={onNavigate} />
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerSpacer: {
    width: 32,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fafafa",
  },
  trashButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
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
    fontSize: 16,
    fontWeight: "600",
    color: "#fafafa",
  },
  dateText: {
    fontSize: 12,
    color: "#a1a1aa",
    marginTop: 2,
  },
  // Badge
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeActive: {
    backgroundColor: "rgba(34,197,94,0.15)",
  },
  badgeCompleted: {
    backgroundColor: "#1a1a1a",
  },
  badgeCancelled: {
    backgroundColor: "rgba(239,68,68,0.15)",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  badgeTextActive: {
    color: "#22c55e",
  },
  badgeTextCompleted: {
    color: "#a1a1aa",
  },
  badgeTextCancelled: {
    color: "#ef4444",
  },
  // Info row
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#a1a1aa",
  },
  timeRange: {
    fontSize: 14,
    color: "#a1a1aa",
    fontVariant: ["tabular-nums"],
  },
});
