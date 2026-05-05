import React, { useEffect, useState, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, PanResponder, Animated, LogBox } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Toast, ToastType } from '../components/Toast';

LogBox.ignoreAllLogs();
import { getAuthToken, setAuthToken } from '../lib/api';
import { DeviceEventEmitter } from 'react-native';

import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import WorkspaceScreen from './WorkspaceScreen';
import ProfileScreen from './ProfileScreen';
import DeskDetailScreen from './DeskDetailScreen';
import BookingsScreen from './BookingsScreen';
import HistoryScreen from './HistoryScreen';
import ScannerScreen from './ScannerScreen';
import SuccessScreen from './SuccessScreen';
import { login, register, logout, getUserProfile, updateUserProfile, fetchUserHistory, clearUserHistory } from '../lib/auth';
import { fetchRooms, fetchRoomPlaces, occupyPlace, releasePlace } from '../lib/places';
import { Room, Desk, UserProfile, Booking } from '../types/booking';

// Fallback desk layouts for known rooms (same as desktop)
const knownLayouts: Record<string, Desk[]> = {
  "401": [
    { id: 1, status: "available", col: 2, row: 1, w: 2 },
    { id: 2, status: "available", col: 4, row: 1, w: 2 },
    { id: 3, status: "available", col: 6, row: 1, w: 2 },
    { id: 4, status: "available", col: 8, row: 1, w: 2 },
    { id: 5, status: "available", col: 1, row: 3, h: 2 },
    { id: 6, status: "available", col: 1, row: 5, h: 2 },
    { id: 7, status: "available", col: 10, row: 3, h: 2 },
    { id: 8, status: "available", col: 10, row: 5, h: 2 },
    { id: 9, status: "available", col: 10, row: 7, h: 2 },
  ],
  "407": [
    { id: 1, status: "available", col: 2, row: 1, h: 2 },
    { id: 2, status: "available", col: 3, row: 1, w: 2 },
    { id: 3, status: "available", col: 5, row: 1, w: 2 },
    { id: 4, status: "available", col: 7, row: 1, w: 2 },
    { id: 5, status: "available", col: 1, row: 3, h: 2 },
    { id: 6, status: "available", col: 1, row: 5, h: 2 },
    { id: 7, status: "available", col: 1, row: 7, w: 2 },
    { id: 8, status: "available", col: 5, row: 3, h: 2 },
    { id: 9, status: "available", col: 4, row: 5, w: 2 },
    { id: 10, status: "available", col: 9, row: 3, h: 2 },
    { id: 11, status: "available", col: 9, row: 5, h: 2 },
    { id: 12, status: "available", col: 9, row: 7, h: 2 },
  ],
};

export default function IndexScreen() {
  const [screen, setScreen] = useState<string>('loading');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedDesk, setSelectedDesk] = useState<Desk | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [scannedQrValue, setScannedQrValue] = useState<string | null>(null);
  const [bookingTime, setBookingTime] = useState<string | null>(null);
  const [toast, setToast] = useState<{visible: boolean, message: string, type: ToastType}>({visible: false, message: '', type: 'info'});

  const showToast = (message: string, type: ToastType = 'info') => setToast({ visible: true, message, type });
  const hideToast = () => setToast(prev => ({ ...prev, visible: false }));

  const room = useMemo(
    () => rooms.find((r) => r.id === currentRoomId) ?? rooms[0],
    [rooms, currentRoomId]
  );
  const myDeskId = useMemo(() => {
    if (!room) return null;
    const mine = room.desks.find((d) => d.status === "mine");
    return mine ? mine.id : null;
  }, [room]);

  // ── Helpers ──────────────────────────────────────

  const loadProfile = async (): Promise<boolean> => {
    try {
      const profile = await getUserProfile();
      setUser(profile);
      if (profile.preferred_room) {
        setCurrentRoomId(String(profile.preferred_room));
      }
      return true;
    } catch (e) {
      console.log('Could not fetch profile');
      return false;
    }
  };

  const loadBookings = async () => {
    try {
      const history = await fetchUserHistory();
      if (Array.isArray(history)) {
        const mapped: Booking[] = history.map((h: any) => {
          let st: Booking['status'] = 'completed';
          if (!h.end_time) st = 'active';
          const sTime = new Date(h.start_time);
          const eTime = h.end_time ? new Date(h.end_time) : null;
          return {
            id: String(h.id),
            deskId: h.place_number,
            dbId: h.place_id,
            roomId: String(h.room_id),
            roomName: h.room_name,
            floor: 1,
            date: sTime.toISOString().slice(0, 10),
            startTime: `${String(sTime.getHours()).padStart(2, '0')}:${String(sTime.getMinutes()).padStart(2, '0')}`,
            endTime: eTime ? `${String(eTime.getHours()).padStart(2, '0')}:${String(eTime.getMinutes()).padStart(2, '0')}` : undefined,
            status: st,
          };
        });
        setBookings(mapped);
      }
    } catch (e) {
      console.log('Could not fetch bookings');
    }
  };

  const loadRooms = async (): Promise<boolean> => {
    try {
      const data = await fetchRooms();
      if (Array.isArray(data)) {
        const mapped: Room[] = data.map((apiRoom: any) => {
          const id = String(apiRoom.id);
          const name = apiRoom.name;
          const nameId = name.match(/\d+/)?.[0];
          const layout = knownLayouts[id] || (nameId ? knownLayouts[nameId] : undefined) || [];
          return { id, name, floor: apiRoom.floor || 1, desks: layout };
        });
        setRooms(mapped);
        if (!currentRoomId && mapped.length > 0) {
          setCurrentRoomId(mapped[0].id);
        }
      }
      return true;
    } catch (e) {
      console.log('Could not fetch rooms');
      return false;
    }
  };

  const loadRoomPlaces = async (roomId: string) => {
    try {
      const places = await fetchRoomPlaces(roomId);
      if (!Array.isArray(places)) return;
      setRooms((rs) =>
        rs.map((r) => {
          if (r.id !== roomId) return r;
          let desks = [...r.desks];
          // If no layout exists, generate a simple grid
          if (desks.length === 0 && places.length > 0) {
            desks = places.map((p: any, i: number) => ({
              id: p.number,
              status: "available" as const,
              col: (i % 6) + 1,
              row: Math.floor(i / 6) * 2 + 1,
            }));
          }
          // Update statuses from API
          const newDesks = desks.map((desk) => {
            const p = places.find((x: any) => x.number === desk.id);
            if (p) {
              let st: Desk["status"] = "available";
              if (p.status === "booked" || p.backend_status === "occupied") {
                st = p.user?.id === user?.id ? "mine" : "occupied";
              }
              return { 
                ...desk, 
                dbId: p.id, 
                status: st,
                occupiedAt: p.occupied_at,
                occupantName: p.user?.name || p.user_name || undefined,
                qrCode: p.qr_code,
              };
            }
            return desk;
          });
          return { ...r, desks: newDesks };
        })
      );
    } catch (e) {
      console.log('Could not fetch room places');
    }
  };

  // ── Effects ──────────────────────────────────────

  useEffect(() => {
    const checkToken = async () => {
      const token = await getAuthToken();
      if (!token) {
        setScreen('login');
        return;
      }
      // Validate token by fetching profile
      const profileOk = await loadProfile();
      if (!profileOk) {
        // Token is invalid/expired — clear it and go to login
        await setAuthToken(null);
        setScreen('login');
        return;
      }
      await loadRooms();
      setScreen('workspace');
    };
    checkToken();

    const sub = DeviceEventEmitter.addListener('auth:unauthorized', () => {
      setUser(null);
      setScreen('login');
    });
    return () => { sub.remove(); };
  }, []);

  // When screen changes to bookings/history, refresh data
  useEffect(() => {
    if (screen === 'workspace' || screen === 'bookings' || screen === 'history') {
      loadBookings();
    }
  }, [screen]);

  // When currentRoomId changes, fetch places for that room
  useEffect(() => {
    if ((screen === 'workspace' || screen === 'profile') && currentRoomId) {
      loadRoomPlaces(currentRoomId);
    }
  }, [screen, currentRoomId]);

  // ── Navigation ───────────────────────────────────

  const handleNavigate = (key: string) => {
    const targetTab = key === 'map' ? 'workspace' : key;
    
    if (targetTab === 'workspace' && user?.preferred_room) {
      setCurrentRoomId(String(user.preferred_room));
    }
    setScreen(targetTab);
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setScreen('login');
    showToast('Вы вышли из аккаунта', 'info');
  };

  const handleUpdateProfile = async (data: Partial<UserProfile>) => {
    try {
      const updated = await updateUserProfile(data);
      setUser((prev) => prev ? { ...prev, ...updated } : updated);
      if (data.preferred_room) {
        setCurrentRoomId(String(data.preferred_room));
      }
      showToast('Профиль обновлен', 'success');
    } catch (e) {
      showToast('Не удалось обновить профиль', 'error');
    }
  };

  const handleRoomChange = (roomId: string) => {
    setCurrentRoomId(roomId);
  };

  const handleOpenScanner = () => {
    const hasActiveBooking = bookings.some(b => b.status === 'active');
    if (hasActiveBooking) {
      showToast("У вас уже есть активная бронь", "error");
      return;
    }
    setScreen('scanner');
  };

  const handleDeskClick = (desk: Desk) => {
    setSelectedDesk(desk);
    setScannedQrValue(null);
    setScreen('deskDetail');
  };

  const handleScan = (data: string) => {
    // Try to find the desk by exact QR code match in ANY room
    let foundDesk: Desk | null = null;
    let foundRoomId: string | null = null;

    for (const r of rooms) {
      const d = r.desks.find(desk => desk.qrCode === data);
      if (d) {
        foundDesk = d;
        foundRoomId = r.id;
        break;
      }
    }

    if (foundDesk && foundRoomId) {
      setCurrentRoomId(foundRoomId);
      setSelectedDesk(foundDesk);
      setScannedQrValue(data); // Save the exact scanned string to send to backend
      setScreen('deskDetail');
    } else {
      showToast("Неверный QR-код или стол не найден", "error");
      setScreen('workspace');
    }
  };

  const handleBookDesk = async () => {
    if (!selectedDesk || !currentRoomId || !scannedQrValue) return;
    try {
      await occupyPlace(selectedDesk.dbId || selectedDesk.id, scannedQrValue);
      const now = new Date();
      setBookingTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
      
      await loadRoomPlaces(currentRoomId);
      await loadBookings();
      setScreen('success');
      showToast('Место забронировано', 'success');
    } catch (e: any) {
      showToast('Не удалось забронировать стол', 'error');
    }
  };

  const handleReleaseDesk = async () => {
    if (!selectedDesk || !currentRoomId) return;
    try {
      await releasePlace(selectedDesk.dbId || selectedDesk.id);
      await loadRoomPlaces(currentRoomId);
      setScreen('workspace');
      setSelectedDesk(null);
      showToast('Место освобождено', 'success');
    } catch (e: any) {
      showToast('Не удалось освободить стол', 'error');
    }
  };


  // ── Render ───────────────────────────────────────

  if (screen === 'loading') {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        {screen === 'login' && (
          <LoginScreen 
            onLogin={async ({ email, password }) => {
              try {
                const data = await login(email, password);
                if (data.user) {
                  setUser(data.user);
                  if (data.user.preferred_room) {
                    setCurrentRoomId(String(data.user.preferred_room));
                  }
                }
              } catch (e: any) {
                showToast(e.message || 'Не удалось войти', 'error');
                return;
              }
              // Even if we got user data, refresh profile and rooms to be sure
              await loadProfile();
              await loadRooms();
              setScreen('workspace');
            }}             onRegister={() => setScreen('register')}
            onForgot={() => {}}
          />
        )}
        {screen === 'register' && (
          <RegisterScreen 
            onRegister={async ({ name, email, password }) => {
              try {
                await register(name, email, password);
              } catch (e: any) {
                showToast(e.message || 'Не удалось зарегистрироваться', 'error');
                return;
              }
              // Register doesn't return a token — auto-login after register
              try {
                const data = await login(email, password);
                if (data.user) {
                  setUser(data.user);
                  if (data.user.preferred_room) {
                    setCurrentRoomId(String(data.user.preferred_room));
                  }
                }
              } catch (e: any) {
                showToast('Аккаунт создан. Войдите вручную.', 'info');
                setScreen('login');
                return;
              }
              await loadProfile();
              await loadRooms();
              setScreen('workspace');
            }}
            onLoginNav={() => setScreen('login')}
          />
        )}
        {screen === 'workspace' && room && (
          <WorkspaceScreen 
            room={room}
            rooms={rooms}
            myDeskId={myDeskId}
            onScan={handleOpenScanner}
            onDeskClick={handleDeskClick}
            onRoomChange={handleRoomChange}
            onNavigate={handleNavigate}
            isAdmin={user?.is_staff}
          />
        )}
        {screen === 'profile' && user && (
          <ProfileScreen
            user={user}
            rooms={rooms}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
            onUpdateProfile={handleUpdateProfile}
            isAdmin={user?.is_staff}
          />
        )}
        {screen === 'deskDetail' && selectedDesk && room && (
          <DeskDetailScreen
            desk={selectedDesk}
            room={room}
            onBack={() => { setScreen('workspace'); setSelectedDesk(null); setScannedQrValue(null); }}
            onBook={handleBookDesk}
            onRelease={handleReleaseDesk}
            isAdmin={user?.is_staff}
            hasScannedQr={!!scannedQrValue}
          />
        )}
        {screen === 'scanner' && (
          <ScannerScreen
            onScan={handleScan}
            onBack={() => setScreen('workspace')}
          />
        )}
        {screen === 'success' && selectedDesk && room && (
          <SuccessScreen
            desk={selectedDesk}
            room={room}
            startTime={bookingTime || '--:--'}
            onRelease={handleReleaseDesk}
            onHome={() => { 
              setScreen('workspace'); 
              setSelectedDesk(null); 
              setScannedQrValue(null);
              if (user?.preferred_room) {
                setCurrentRoomId(String(user?.preferred_room));
              }
            }}
          />
        )}
        {screen === 'bookings' && (
          <BookingsScreen
            bookings={bookings}
            onCancel={async (id) => {
              // Find the booking to get place info
              const booking = bookings.find(b => b.id === id);
              if (booking && booking.dbId) {
                try {
                  await releasePlace(booking.dbId);
                  await loadBookings();
                  if (currentRoomId) await loadRoomPlaces(currentRoomId);
                  showToast('Бронь отменена', 'success');
                } catch (e) {
                  showToast('Не удалось отменить бронь', 'error');
                }
              }
            }}
            onScan={handleOpenScanner}
            onNavigate={handleNavigate}
            isAdmin={user?.is_staff}
          />
        )}
        {screen === 'history' && (
          <HistoryScreen
            bookings={bookings}
            isAdmin={user?.is_staff}
            onNavigate={handleNavigate}
            onClearHistory={async () => {
              try {
                await clearUserHistory();
                setBookings([]);
                showToast('История очищена', 'success');
              } catch (e) {
                showToast('Не удалось очистить историю', 'error');
              }
            }}
          />
        )}
      </View>
      <Toast visible={toast.visible} message={toast.message} type={toast.type} onHide={hideToast} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  content: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
  },
});
