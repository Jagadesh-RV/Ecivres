import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface MobileCoordinates {
  latitude: number;
  longitude: number;
}

interface MobileLiveTrackingMapProps {
  customerLocation: MobileCoordinates;
  providerLocation?: MobileCoordinates;
  providerName?: string;
  formattedEta?: string;
  distanceKm?: number;
}

export const MobileLiveTrackingMap: React.FC<MobileLiveTrackingMapProps> = ({
  customerLocation,
  providerLocation,
  providerName = 'Provider',
  formattedEta = '10 mins',
  distanceKm = 2.8,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.mapCanvas}>
        {/* Top Floating ETA Card */}
        <View style={styles.etaCard}>
          <Text style={styles.etaTitle}>🚀 {providerName} is on the way</Text>
          <Text style={styles.etaSubtitle}>
            ETA: <Text style={styles.etaHighlight}>{formattedEta}</Text> ({distanceKm} km)
          </Text>
        </View>

        {/* Visual Map Representation */}
        <View style={styles.pinContainer}>
          <View style={styles.providerPin}>
            <Text style={styles.pinIcon}>🛵</Text>
            <Text style={styles.pinLabel}>{providerName}</Text>
          </View>
          <View style={styles.routeLine} />
          <View style={styles.customerPin}>
            <Text style={styles.pinIcon}>📍</Text>
            <Text style={styles.pinLabel}>You</Text>
          </View>
        </View>

        <Text style={styles.securityTag}>🔒 Live GPS Tracking Active</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  mapCanvas: {
    backgroundColor: '#090D16',
    borderRadius: 20,
    height: 220,
    padding: 16,
    justify: 'space-between',
    borderWidth: 1,
    borderColor: '#1E293B',
    alignItems: 'center',
  },
  etaCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: '#334155',
  },
  etaTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  etaSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  etaHighlight: {
    color: '#34D399',
    fontWeight: 'bold',
  },
  pinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justify: 'space-between',
    width: '80%',
    marginVertical: 20,
  },
  providerPin: {
    alignItems: 'center',
  },
  customerPin: {
    alignItems: 'center',
  },
  pinIcon: {
    fontSize: 28,
  },
  pinLabel: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  routeLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#6366F1',
    marginHorizontal: 10,
  },
  securityTag: {
    color: '#64748B',
    fontSize: 10,
  },
});
