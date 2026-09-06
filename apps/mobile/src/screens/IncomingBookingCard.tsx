import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export interface MobileBookingItem {
  id: string;
  status: string;
  scheduledAt: string;
  service?: {
    name: string;
    price: number;
  };
  customer?: {
    firstName?: string;
    lastName?: string;
    user?: {
      email: string;
    };
  };
}

interface IncomingBookingCardProps {
  booking: MobileBookingItem;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onReschedule?: (id: string) => void;
}

export const IncomingBookingCard: React.FC<IncomingBookingCardProps> = ({
  booking,
  onAccept,
  onReject,
  onReschedule,
}) => {
  const formattedDate = new Date(booking.scheduledAt).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.serviceTitle}>{booking.service?.name || 'Service Booking'}</Text>
        <View style={[styles.badge, booking.status === 'PENDING' ? styles.pendingBadge : styles.confirmedBadge]}>
          <Text style={styles.badgeText}>{booking.status}</Text>
        </View>
      </View>

      <Text style={styles.customerInfo}>
        Client: {booking.customer?.firstName ? `${booking.customer.firstName} ${booking.customer.lastName || ''}` : booking.customer?.user?.email || 'Customer'}
      </Text>
      
      <View style={styles.detailsRow}>
        <Text style={styles.dateText}>📅 {formattedDate}</Text>
        <Text style={styles.priceText}>${booking.service?.price?.toFixed(2) || '0.00'}</Text>
      </View>

      {booking.status === 'PENDING' && (
        <View style={styles.actionsRow}>
          {onAccept && (
            <TouchableOpacity style={styles.acceptButton} onPress={() => onAccept(booking.id)}>
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
          )}
          {onReject && (
            <TouchableOpacity style={styles.rejectButton} onPress={() => onReject(booking.id)}>
              <Text style={styles.rejectButtonText}>Reject</Text>
            </TouchableOpacity>
          )}
          {onReschedule && (
            <TouchableOpacity style={styles.rescheduleButton} onPress={() => onReschedule(booking.id)}>
              <Text style={styles.rescheduleButtonText}>Reschedule</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
  customerInfo: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#334155',
  },
  priceText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
  },
  confirmedBadge: {
    backgroundColor: '#D1FAE5',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#10B981',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  rejectButtonText: {
    color: '#EF4444',
    fontWeight: '600',
    fontSize: 13,
  },
  rescheduleButton: {
    flex: 1,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  rescheduleButtonText: {
    color: '#D97706',
    fontWeight: '600',
    fontSize: 13,
  },
});
