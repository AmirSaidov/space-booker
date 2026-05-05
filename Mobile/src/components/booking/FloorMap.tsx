import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { Desk } from '../../types/booking';

interface FloorMapProps {
  desks: Desk[];
  highlightId?: number | null;
  onDeskClick?: (desk: Desk) => void;
}

export const FloorMap = ({ desks, highlightId, onDeskClick }: FloorMapProps) => {
  const maxCol = desks.reduce((m, d) => Math.max(m, d.col + (d.w ?? 1) - 1), 6);
  const maxRow = desks.reduce((m, d) => Math.max(m, d.row + (d.h ?? 1) - 1), 1);

  // We'll calculate grid sizes dynamically
  const [containerWidth, setContainerWidth] = useState(Dimensions.get('window').width - 48);
  
  // Calculate heights to maintain aspect ratio roughly equivalent to the web
  const cellWidth = containerWidth / maxCol;
  // Increase row height slightly compared to col width
  const cellHeight = cellWidth * 1.1;
  const containerHeight = cellHeight * maxRow;

  return (
    <View style={styles.wrapper}>
      <View 
        style={[styles.container, { width: containerWidth, height: containerHeight }]}
        onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
      >
        {desks.map((d) => {
          const isMine = d.status === "mine" || d.id === highlightId;
          const PADDING = 6; // gap between desks
          
          const left = (d.col - 1) * cellWidth + PADDING;
          const top = (d.row - 1) * cellHeight + PADDING;
          const width = (d.w ?? 1) * cellWidth - (PADDING * 2);
          const height = (d.h ?? 1) * cellHeight - (PADDING * 2);
          
          let bgStyle = styles.deskDefault;
          if (isMine) bgStyle = styles.deskMine;
          else if (d.status === "occupied") bgStyle = styles.deskOccupied;

          let textStyle = styles.deskTextDefault;
          if (isMine) textStyle = styles.deskTextMine;
          else if (d.status === "occupied") textStyle = styles.deskTextOccupied;

          return (
            <TouchableOpacity
              key={d.id}
              activeOpacity={0.7}
              onPress={() => onDeskClick?.(d)}
              style={[
                styles.deskBase,
                bgStyle,
                { left, top, width, height }
              ]}
            >
              <Text style={textStyle}>{d.id}</Text>
              {!isMine && (
                <View style={[
                  styles.dot, 
                  d.status === "occupied" ? styles.dotOccupied : styles.dotAvailable
                ]} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 16,
  },
  container: {
    backgroundColor: '#080808',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    // In a real app we'd add background grid lines using SVG or a tiled image
    position: 'relative',
    overflow: 'hidden',
  },
  deskBase: {
    position: 'absolute',
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deskDefault: {
    backgroundColor: '#111111',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  deskMine: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
    shadowColor: '#22c55e',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  deskOccupied: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderColor: 'rgba(239,68,68,0.2)',
  },
  deskTextDefault: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  deskTextMine: {
    color: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  deskTextOccupied: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 14,
    fontWeight: 'bold',
  },
  dot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotAvailable: {
    backgroundColor: '#22c55e',
    shadowColor: '#22c55e',
    shadowOpacity: 0.5,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
  },
  dotOccupied: {
    backgroundColor: '#ef4444',
    shadowColor: '#ef4444',
    shadowOpacity: 0.5,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
  },
});
