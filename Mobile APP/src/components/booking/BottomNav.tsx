import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { Map, Calendar, Clock, User, Users } from 'lucide-react-native';

export type NavKey = "map" | "bookings" | "history" | "profile" | "admin_users" | "admin_history";

interface BottomNavProps {
  active?: NavKey;
  isAdmin?: boolean;
  onNavigate?: (key: NavKey) => void;
}

export const BottomNav = ({ active = "map", isAdmin = false, onNavigate }: BottomNavProps) => {
  const items = isAdmin
    ? [
        { key: "map" as NavKey, label: "Карта", icon: Map },
        { key: "admin_users" as NavKey, label: "Пользователи", icon: Users },
        { key: "admin_history" as NavKey, label: "История", icon: Clock },
        { key: "profile" as NavKey, label: "Профиль", icon: User },
      ]
    : [
        { key: "map" as NavKey, label: "Карта", icon: Map },
        { key: "bookings" as NavKey, label: "Мои брони", icon: Calendar },
        { key: "history" as NavKey, label: "История", icon: Clock },
        { key: "profile" as NavKey, label: "Профиль", icon: User },
      ];

  return (
    <View style={styles.nav}>
      {items.map(({ key, label, icon: Icon }) => {
        const isActive = key === active;
        return (
          <TouchableOpacity
            key={key}
            style={styles.navItem}
            onPress={() => onNavigate?.(key)}
            activeOpacity={0.7}
          >
            <Icon
              color={isActive ? "#fafafa" : "#a1a1aa"}
              size={22}
              strokeWidth={isActive ? 2.4 : 1.8}
            />
            <Text style={[styles.navText, isActive && styles.navTextActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
    borderTopWidth: 1,
    borderTopColor: '#27272a',
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    paddingHorizontal: 8,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  navText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#a1a1aa',
  },
  navTextActive: {
    color: '#fafafa',
  },
});
