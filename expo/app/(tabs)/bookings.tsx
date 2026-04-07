import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Calendar, Clock, MapPin, ChevronRight, WifiOff } from 'lucide-react-native';
import { useBookings } from '@/context/BookingsContext';
import { useNetwork } from '@/context/NetworkContext';

export default function BookingsScreen() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
  const { bookings, isLoading } = useBookings();
  const { isOnline } = useNetwork();

  const filteredBookings = bookings.filter(
    (booking) => activeTab === 'upcoming' 
      ? booking.status !== 'completed' && booking.status !== 'cancelled'
      : booking.status === 'completed'
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
        {!isOnline && (
          <View style={styles.offlineChip}>
            <WifiOff size={12} color="#DC2626" />
            <Text style={styles.offlineChipText}>Offline</Text>
          </View>
        )}
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.tabActive]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.tabTextActive]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.tabActive]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.tabTextActive]}>
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Loading bookings...</Text>
          </View>
        ) : filteredBookings.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Calendar size={40} color="#94A3B8" />
            </View>
            <Text style={styles.emptyTitle}>No {activeTab} bookings</Text>
            <Text style={styles.emptyText}>
              {activeTab === 'upcoming' 
                ? 'Book a service to get started!' 
                : 'Your completed bookings will appear here'}
            </Text>
          </View>
        ) : (
          filteredBookings.map((booking) => (
            <TouchableOpacity key={booking.id} style={styles.bookingCard}>
              {booking.pendingSync && (
                <View style={styles.pendingSyncBadge}>
                  <WifiOff size={10} color="#F59E0B" />
                  <Text style={styles.pendingSyncText}>Pending sync</Text>
                </View>
              )}
              <View style={styles.bookingHeader}>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{booking.service}</Text>
                  <Text style={styles.providerName}>{booking.provider}</Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  booking.status === 'upcoming' && styles.statusUpcoming,
                  booking.status === 'confirmed' && styles.statusConfirmed,
                  booking.status === 'completed' && styles.statusCompleted,
                  booking.status === 'cancelled' && styles.statusCancelled,
                ]}>
                  <Text style={[
                    styles.statusText,
                    booking.status === 'upcoming' && styles.statusUpcomingText,
                    booking.status === 'confirmed' && styles.statusConfirmedText,
                    booking.status === 'completed' && styles.statusCompletedText,
                    booking.status === 'cancelled' && styles.statusCancelledText,
                  ]}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Text>
                </View>
              </View>

              <View style={styles.bookingDetails}>
                <View style={styles.detailRow}>
                  <Calendar size={16} color="#64748B" />
                  <Text style={styles.detailText}>{booking.date}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Clock size={16} color="#64748B" />
                  <Text style={styles.detailText}>{booking.time}</Text>
                </View>
                {booking.from && (
                  <View style={styles.detailRow}>
                    <MapPin size={16} color="#64748B" />
                    <Text style={styles.detailText}>{booking.from} → {booking.to}</Text>
                  </View>
                )}
                {booking.address && (
                  <View style={styles.detailRow}>
                    <MapPin size={16} color="#64748B" />
                    <Text style={styles.detailText}>{booking.address}</Text>
                  </View>
                )}
              </View>

              <View style={styles.bookingFooter}>
                <Text style={styles.price}>{booking.price}</Text>
                <ChevronRight size={20} color="#94A3B8" />
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#0891B2',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: '#fff',
  },
  offlineChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 2,
  },
  offlineChipText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: '#DC2626',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#0891B2',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#64748B',
  },
  tabTextActive: {
    color: '#0891B2',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#0F172A',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  pendingSyncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 8,
  },
  pendingSyncText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: '#D97706',
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#0F172A',
    marginBottom: 2,
  },
  providerName: {
    fontSize: 14,
    color: '#64748B',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusUpcoming: {
    backgroundColor: '#FEF3C7',
  },
  statusConfirmed: {
    backgroundColor: '#D1FAE5',
  },
  statusCompleted: {
    backgroundColor: '#F1F5F9',
  },
  statusCancelled: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  statusUpcomingText: {
    color: '#D97706',
  },
  statusConfirmedText: {
    color: '#059669',
  },
  statusCompletedText: {
    color: '#64748B',
  },
  statusCancelledText: {
    color: '#DC2626',
  },
  bookingDetails: {
    gap: 8,
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#475569',
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  price: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: '#0891B2',
  },
});
