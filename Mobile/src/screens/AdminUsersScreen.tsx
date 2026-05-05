import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { fetchAdminUsers } from "../lib/admin";
import { BottomNav } from "../components/booking/BottomNav";

type Props = {
  onNavigate: (key: string) => void;
};

export default function AdminUsersScreen({ onNavigate }: Props) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminUsers()
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => onNavigate("map")}>
          <Text style={styles.backText}>← Назад</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Все пользователи</Text>

        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <ScrollView contentContainerStyle={styles.list}>
            {users.length === 0 && <Text style={styles.empty}>Пользователей нет</Text>}

            {users.map((u) => (
              <View key={u.id} style={styles.card}>
                <Text style={styles.name}>{u.username || u.name || "User"}</Text>
                <Text style={styles.text}>{u.email || "Без email"}</Text>
                <Text style={styles.text}>Админ: {u.is_staff ? "Да" : "Нет"}</Text>
                <Text style={styles.text}>Кабинет: {u.preferred_room || "Не выбран"}</Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      <BottomNav active="admin_users" isAdmin={true} onNavigate={onNavigate} />
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