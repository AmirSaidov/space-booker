import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, FlatList, Platform } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Menu, Bell, ChevronDown, ScanLine, Check } from "lucide-react-native";
import { BottomNav, NavKey } from "../components/booking/BottomNav";
import { FloorMap } from "../components/booking/FloorMap";
import { Desk, Room } from "../types/booking";

interface WorkspaceScreenProps {
  room: Room;
  rooms: Room[];
  myDeskId: number | null;
  onScan: () => void;
  onDeskClick: (desk: Desk) => void;
  onRoomChange: (roomId: string) => void;
  onNavigate: (key: NavKey) => void;
  isAdmin?: boolean;
}

export default function WorkspaceScreen({
  room,
  rooms,
  myDeskId,
  onScan,
  onDeskClick,
  onRoomChange,
  onNavigate,
  isAdmin = false,
}: WorkspaceScreenProps) {
  const [roomPickerVisible, setRoomPickerVisible] = useState(false);
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>


        <ScrollView style={styles.content}>
          <View style={styles.roomSelectContainer}>
            <TouchableOpacity onPress={() => setRoomPickerVisible(true)} style={styles.roomSelectButton}>
              <Text style={styles.roomSelectText}>{room.name}</Text>
              <ChevronDown color="#a1a1aa" size={16} />
            </TouchableOpacity>
          </View>

          <View style={styles.mapContainer}>
            <FloorMap desks={room.desks} highlightId={myDeskId} onDeskClick={onDeskClick} />

            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#22c55e' }]} />
                <Text style={styles.legendText}>Свободно</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} />
                <Text style={styles.legendText}>Занято</Text>
              </View>
              {myDeskId !== null && (
                <View style={styles.legendItem}>
                  <View style={[styles.legendSquare, { backgroundColor: '#22c55e' }]} />
                  <Text style={styles.legendText}>Моё место</Text>
                </View>
              )}
            </View>
          </View>

          {!isAdmin && (
            <View style={styles.scanButtonContainer}>
              <TouchableOpacity onPress={onScan} style={styles.scanButton}>
                <ScanLine color="#0a0a0a" size={20} />
                <Text style={styles.scanButtonText}>Сканировать QR</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        <BottomNav active="map" isAdmin={isAdmin} onNavigate={onNavigate} />

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
              <FlatList
                data={rooms}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  const isSelected = room.id === item.id;
                  return (
                    <TouchableOpacity
                      style={styles.roomOption}
                      onPress={() => {
                        onRoomChange(item.id);
                        setRoomPickerVisible(false);
                      }}
                    >
                      <Text style={[styles.roomOptionText, isSelected && styles.roomOptionTextActive]}>
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
    backgroundColor: '#0a0a0a',
  },
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  iconButton: {
    padding: 6,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fafafa',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  roomSelectContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  roomSelectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#111111',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  roomSelectText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fafafa',
  },
  mapContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendSquare: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 12,
    color: '#a1a1aa',
  },
  scanButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  scanButton: {
    flexDirection: 'row',
    height: 48,
    backgroundColor: '#fafafa',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.55,
    shadowRadius: 14,
    elevation: 5,
  },
  scanButtonText: {
    color: '#0a0a0a',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalSheet: {
    backgroundColor: '#111111',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    maxHeight: '50%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#444',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fafafa',
    textAlign: 'center',
    marginBottom: 12,
  },
  roomOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#27272a',
  },
  roomOptionText: {
    flex: 1,
    fontSize: 14,
    color: '#a1a1aa',
  },
  roomOptionTextActive: {
    color: '#fafafa',
    fontWeight: '600',
  },
});
