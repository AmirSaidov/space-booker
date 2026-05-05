import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, StyleSheet, View, Dimensions } from 'react-native';
import { AlertCircle, CheckCircle, Info } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  onHide: () => void;
}

export const Toast = ({ visible, message, type = 'info', onHide }: ToastProps) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(40)).current;
  const scale = useRef(new Animated.Value(0.95)).current;
  const progress = useRef(new Animated.Value(1)).current;
  const [isRendered, setIsRendered] = useState(visible);

  const getTheme = () => {
    switch (type) {
      case 'success': return { color: '#10b981', icon: <CheckCircle color="#10b981" size={18} /> };
      case 'error': return { color: '#ef4444', icon: <AlertCircle color="#ef4444" size={18} /> };
      default: return { color: '#3b82f6', icon: <Info color="#3b82f6" size={18} /> };
    }
  };

  const theme = getTheme();

  useEffect(() => {
    if (visible) {
      setIsRendered(true);
      progress.setValue(1);
      
      Animated.parallel([
        Animated.spring(opacity, { toValue: 1, useNativeDriver: true, tension: 40, friction: 7 }),
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, tension: 40, friction: 7 }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 40, friction: 7 }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: 20, duration: 250, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 0.95, duration: 250, useNativeDriver: true }),
        ]).start(() => {
          setIsRendered(false);
          onHide();
        });
      }, 3500);

      Animated.timing(progress, {
        toValue: 0,
        duration: 3500,
        useNativeDriver: false,
      }).start();

      return () => clearTimeout(timer);
    }
  }, [visible, message]);

  if (!isRendered) return null;

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          opacity, 
          transform: [{ translateY }, { scale }] 
        }
      ]} 
      pointerEvents="none"
    >
      <View style={[styles.content, { borderLeftColor: theme.color }]}>
        <View style={styles.iconWrapper}>
          {theme.icon}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{message}</Text>
        </View>
        <Animated.View 
          style={[
            styles.progressBar, 
            { 
              backgroundColor: theme.color,
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%']
              })
            }
          ]} 
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 9999,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#111111',
    borderRadius: 12,
    borderLeftWidth: 4,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
    overflow: 'hidden',
  },
  iconWrapper: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 2,
    opacity: 0.6,
  },
});
