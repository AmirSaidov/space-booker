import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  FlatList,
  Platform,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut, ChevronRight, MapPin, Check } from "lucide-react-native";
import { BottomNav, NavKey } from "../components/booking/BottomNav";
import { UserProfile, Room } from "../types/booking";

interface Props {
  user: UserProfile;
  rooms: Room[];
  onLogout: () => void;
  onNavigate: (key: NavKey) => void;
  onUpdateProfile: (data: Partial<UserProfile>) => void;
  isAdmin?: boolean;
}

export default function ProfileScreen({
  user,
  rooms,
  isAdmin = false,
  onLogout,
  onNavigate,
  onUpdateProfile,
}: Props) {
  const [roomPickerVisible, setRoomPickerVisible] = useState(false);

  const selectedRoom = rooms.find((r) => r.id === String(user.preferred_room));

  const handleRoomSelect = (roomId: string) => {
    onUpdateProfile({ preferred_room: roomId });
    setRoomPickerVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Профиль</Text>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
          {/* User Card */}
          <View style={styles.userCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName} numberOfLines={1}>
                {user.name}
              </Text>
              <Text style={styles.userEmail} numberOfLines={1}>
                {user.email}
              </Text>
              <Text style={styles.userRole} numberOfLines={1}>
                {user.position} · {user.department}
              </Text>
            </View>
          </View>

          {/* Menu Section */}
          <View style={styles.menuSection}>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setRoomPickerVisible(true)}
            >
              <MapPin color="#a1a1aa" size={16} />
              <Text style={styles.menuLabel}>Мой кабинет</Text>
              <Text style={styles.menuValue}>
                {selectedRoom?.name || "Не выбран"}
              </Text>
              <ChevronRight color="#a1a1aa" size={16} />
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            <LogOut color="#ef4444" size={16} />
            <Text style={styles.logoutText}>Выйти</Text>
          </TouchableOpacity>

          {/* Version */}
          <Text style={styles.version}>Версия 1.0.0</Text>
        </ScrollView>

        <BottomNav active="profile" isAdmin={isAdmin} onNavigate={onNavigate} />

        {/* Room Picker Modal */}
        <Modal
          visible={roomPickerVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setRoomPickerVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setRoomPickerVisible(false)}
          >
            <View style={styles.modalSheet}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>Выберите кабинет</Text>

              <TouchableOpacity
                style={styles.roomOption}
                onPress={() => {
                  onUpdateProfile({ preferred_room: "" });
                  setRoomPickerVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.roomOptionText,
                    !user.preferred_room && styles.roomOptionTextActive,
                  ]}
                >
                  Не выбран
                </Text>
                {!user.preferred_room && <Check color="#22c55e" size={18} />}
              </TouchableOpacity>

              <FlatList
                data={rooms}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  const isSelected = String(user.preferred_room) === item.id;
                  return (
                    <TouchableOpacity
                      style={styles.roomOption}
                      onPress={() => handleRoomSelect(item.id)}
                    >
                      <Text
                        style={[
                          styles.roomOptionText,
                          isSelected && styles.roomOptionTextActive,
                        ]}
                      >
                        {item.name}
                      </Text>
                      {isSelected && <Check color="#22c55e" size={18} />}
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </TouchableOpacity>
        </Modal>
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
    gap: 16,
  },
  // User Card
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#27272a",
    borderRadius: 16,
    padding: 20,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fafafa",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0a0a0a",
  },
  userInfo: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fafafa",
  },
  userEmail: {
    fontSize: 12,
    color: "#a1a1aa",
    marginTop: 2,
  },
  userRole: {
    fontSize: 12,
    color: "#a1a1aa",
    marginTop: 2,
  },
  // Menu Section
  menuSection: {
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#27272a",
    borderRadius: 16,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#fafafa",
  },
  menuValue: {
    fontSize: 12,
    color: "#a1a1aa",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#27272a",
  },
  // Logout
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.3)",
    backgroundColor: "transparent",
  },
  logoutText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ef4444",
  },
  // Version
  version: {
    textAlign: "center",
    fontSize: 12,
    color: "#a1a1aa",
  },
  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalSheet: {
    backgroundColor: "#111111",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === "ios" ? 34 : 24,
    maxHeight: "50%",
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#444",
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fafafa",
    textAlign: "center",
    marginBottom: 12,
  },
  roomOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#27272a",
  },
  roomOptionText: {
    flex: 1,
    fontSize: 14,
    color: "#a1a1aa",
  },
  roomOptionTextActive: {
    color: "#fafafa",
    fontWeight: "600",
  },
});
