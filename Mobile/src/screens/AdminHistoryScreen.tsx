import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { fetchAdminHistory } from "../lib/admin";
import { BottomNav } from "../components/booking/BottomNav";

type Props = {
  onNavigate: (key: string) => void;
};

export default function AdminHistoryScreen({ onNavigate }: Props) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminHistory()
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

        <Text style={styles.title}>Полная история</Text>

        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <ScrollView contentContainerStyle={styles.list}>
            {items.length === 0 && <Text style={styles.empty}>История пустая</Text>}

            {items.map((h) => (
              <View key={h.id} style={styles.card}>
                <Text style={styles.name}>{h.user_name || "User"}</Text>
                <Text style={styles.text}>{h.user_email || "Без email"}</Text>
                <Text style={styles.text}>Кабинет: {h.room_name}</Text>
                <Text style={styles.text}>Место: {h.place_number}</Text>
                <Text style={styles.text}>
                  Статус: {h.status === "active" ? "Активно" : "Завершено"}
                </Text>
                <Text style={styles.text}>
                  Начало: {h.start_time ? new Date(h.start_time).toLocaleString() : "-"}
                </Text>
                {h.end_time && (
                  <Text style={styles.text}>
                    Конец: {new Date(h.end_time).toLocaleString()}
                  </Text>
                )}
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      <BottomNav active="admin_history" isAdmin={true} onNavigate={onNavigate} />
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