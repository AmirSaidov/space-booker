import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { fetchAdminActiveBookings } from "../lib/admin";
import { BottomNav } from "../components/booking/BottomNav";

type Props = {
  onNavigate: (key: string) => void;
};

export default function AdminActiveBookingsScreen({ onNavigate }: Props) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminActiveBookings()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => onNavigate("map")}>
          <Text style={styles.backText}>← Назад</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Активные брони</Text>

        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <ScrollView contentContainerStyle={styles.list}>
            {items.length === 0 && <Text style={styles.empty}>Активных броней нет</Text>}

            {items.map((b) => (
              <View key={b.id} style={styles.card}>
                <Text style={styles.name}>{b.user_name || "User"}</Text>
                <Text style={styles.text}>{b.user_email || "Без email"}</Text>
                <Text style={styles.text}>Кабинет: {b.room_name}</Text>
                <Text style={styles.text}>Место: {b.place_number}</Text>
                <Text style={styles.text}>
                  Начало: {b.start_time ? new Date(b.start_time).toLocaleString() : "-"}
                </Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      <BottomNav active="admin_active_bookings" isAdmin={true} onNavigate={onNavigate} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    padding: 20,
  },
  backButton: {
    marginBottom: 12,
  },
  backText: {
    color: "#fafafa",
    fontSize: 15,
    fontWeight: "600",
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
  },
  list: {
    paddingBottom: 20,
  },
  empty: {
    color: "#a3a3a3",
  },
  card: {
    backgroundColor: "#171717",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  name: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  text: {
    color: "#a3a3a3",
    marginTop: 4,
  },
});