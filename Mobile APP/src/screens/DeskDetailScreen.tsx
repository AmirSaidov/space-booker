import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, CheckCircle2 } from "lucide-react-native";
import { Desk, Room } from "../types/booking";

interface DeskDetailScreenProps {
  desk: Desk;
  room: Room;
  onBack: () => void;
  onBook: () => void;
  onRelease: () => void;
  isAdmin?: boolean;
  hasScannedQr?: boolean;
}

export default function DeskDetailScreen({
  desk,
  room,
  onBack,
  onBook,
  onRelease,
  isAdmin = false,
  hasScannedQr = false,
}: DeskDetailScreenProps) {
  const isAvailable = desk.status === "available";
  const isMine = desk.status === "mine";
  const isOccupied = desk.status === "occupied";

  const statusLabel = isMine ? "Моё место" : isAvailable ? "Свободен" : "Занято";
  const statusStyle = isMine
    ? styles.badgeMine
    : isAvailable
    ? styles.badgeAvailable
    : styles.badgeOccupied;
  const statusTextStyle = isMine
    ? styles.badgeTextMine
    : isAvailable
    ? styles.badgeTextAvailable
    : styles.badgeTextOccupied;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <ChevronLeft color="#fafafa" size={20} />
            <Text style={styles.backText}>Назад</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Рабочее место</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Card */}
        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.deskTitle}>Стол {desk.id}</Text>
            <View style={[styles.badge, statusStyle]}>
              <Text style={[styles.badgeText, statusTextStyle]}>{statusLabel}</Text>
            </View>
            <Text style={styles.roomLabel}>Кабинет</Text>
            <Text style={styles.roomValue}>{room.name.replace("Кабинет ", "")}</Text>

            {/* Occupied by someone else */}
            {isOccupied && desk.occupantName && (
              <View style={styles.occupantCard}>
                <Text style={styles.occupantLabel}>Занят сотрудником</Text>
                <Text style={styles.occupantName}>{desk.occupantName}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomSection}>
          <View style={styles.actions}>
            {isMine ? (
              <TouchableOpacity style={styles.releaseButton} onPress={onRelease}>
                <Text style={styles.releaseText}>Освободить</Text>
              </TouchableOpacity>
            ) : !isAdmin && isAvailable ? (
              <TouchableOpacity 
                style={[styles.bookButton, !hasScannedQr && styles.disabledButton]} 
                onPress={onBook}
                disabled={!hasScannedQr}
              >
                <Text style={styles.bookText}>Забронировать</Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity style={styles.cancelButton} onPress={onBack}>
              <Text style={styles.cancelText}>Отмена</Text>
            </TouchableOpacity>
          </View>

          {/* QR Scanned Notification */}
          {hasScannedQr && (
            <View style={styles.qrNotification}>
              <CheckCircle2 color="#fafafa" size={16} />
              <Text style={styles.qrNotificationText}>QR считан</Text>
            </View>
          )}
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
  },
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  backText: {
    color: "#fafafa",
    fontSize: 14,
    marginLeft: 2,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fafafa",
    textAlign: "center",
  },
  headerSpacer: {
    flex: 1,
  },
  // Content
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  card: {
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#27272a",
    borderRadius: 16,
    padding: 20,
  },
  deskTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fafafa",
    letterSpacing: -0.5,
  },
  // Badge
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
  },
  badgeMine: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  badgeAvailable: {
    backgroundColor: "rgba(34,197,94,0.15)",
  },
  badgeOccupied: {
    backgroundColor: "rgba(239,68,68,0.15)",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  badgeTextMine: {
    color: "#fafafa",
  },
  badgeTextAvailable: {
    color: "#22c55e",
  },
  badgeTextOccupied: {
    color: "#ef4444",
  },
  // Room info
  roomLabel: {
    fontSize: 12,
    color: "#a1a1aa",
    marginTop: 24,
  },
  roomValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fafafa",
    marginTop: 2,
  },
  // Occupant
  occupantCard: {
    marginTop: 24,
    backgroundColor: "rgba(250,250,250,0.05)",
    borderWidth: 1,
    borderColor: "rgba(250,250,250,0.1)",
    borderRadius: 12,
    padding: 16,
  },
  occupantLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#fafafa",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  occupantName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fafafa",
  },
  // Bottom Section
  bottomSection: {
    backgroundColor: "#0a0a0a",
  },
  actions: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 16,
    gap: 12,
  },
  releaseButton: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  releaseText: {
    color: "#ef4444",
    fontSize: 16,
    fontWeight: "600",
  },
  bookButton: {
    height: 48,
    backgroundColor: "#fafafa",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  bookText: {
    color: "#0a0a0a",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(250,250,250,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    color: "#fafafa",
    fontSize: 16,
    fontWeight: "600",
  },
  qrNotification: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#27272a",
    backgroundColor: "#000",
  },
  qrNotificationText: {
    color: "#fafafa",
    fontSize: 14,
    fontWeight: "600",
  },
});
