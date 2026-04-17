import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import {
  MapPin,
  CreditCard,
  Bell,
  Shield,
  HelpCircle,
  ChevronRight,
  Star,
  Heart,
  LogOut,
  Phone,
  Briefcase,
  Clock,
  Check,
  AlertCircle,
  Trash2,
} from 'lucide-react-native';
import { useProviderContext } from '@/context/ProviderContext';

const MENU_ITEMS = [
  { id: 'saved', icon: Heart, label: 'Saved Services', badge: '3' },
  { id: 'payments', icon: CreditCard, label: 'Payment Methods' },
  { id: 'notifications', icon: Bell, label: 'Notifications', badge: '2' },
  { id: 'addresses', icon: MapPin, label: 'Saved Addresses' },
  { id: 'security', icon: Shield, label: 'Security & Privacy' },
  { id: 'help', icon: HelpCircle, label: 'Help & Support' },
];

export default function ProfileScreen() {
  const { isRegistered, hasPendingApplication, myProviderProfile, toggleAvailability, isLoading } = useProviderContext();
  
  const [user] = useState({
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1-721-555-0199',
    memberSince: 'March 2026',
    bookings: 12,
    rating: 4.9,
  });

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Background */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Profile</Text>
          </View>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.name[0]}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <View style={styles.memberBadge}>
              <Star size={12} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.memberText}>Member since {user.memberSince}</Text>
            </View>
          </View>
        </View>

        {/* Provider Status Card */}
        {isRegistered && myProviderProfile && (
          <View style={styles.providerCard}>
            <View style={styles.providerHeader}>
              <View style={styles.providerIconContainer}>
                <Briefcase size={24} color="#0891B2" />
              </View>
              <View style={styles.providerInfo}>
                <Text style={styles.providerTitle}>Provider Account</Text>
                <View style={styles.statusRow}>
                  {myProviderProfile.status === 'approved' ? (
                    <>
                      <View style={styles.statusBadge}>
                        <Check size={12} color="#22C55E" />
                        <Text style={styles.statusTextApproved}>Approved</Text>
                      </View>
                      {myProviderProfile.isAvailable && (
                        <View style={styles.availableBadge}>
                          <Text style={styles.availableText}>Available Now</Text>
                        </View>
                      )}
                    </>
                  ) : myProviderProfile.status === 'pending' ? (
                    <View style={[styles.statusBadge, styles.statusBadgePending]}>
                      <Clock size={12} color="#F59E0B" />
                      <Text style={styles.statusTextPending}>Pending Review</Text>
                    </View>
                  ) : (
                    <View style={[styles.statusBadge, styles.statusBadgeRejected]}>
                      <AlertCircle size={12} color="#EF4444" />
                      <Text style={styles.statusTextRejected}>Not Approved</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
            
            {myProviderProfile.status === 'approved' && (
              <View style={styles.availabilityRow}>
                <Text style={styles.availabilityLabel}>Available for bookings</Text>
                <Switch
                  value={myProviderProfile.isAvailable}
                  onValueChange={() => void toggleAvailability()}
                  trackColor={{ false: '#E2E8F0', true: '#0891B2' }}
                  thumbColor="#fff"
                  disabled={isLoading}
                />
              </View>
            )}
            
            {myProviderProfile.status === 'pending' && (
              <View style={styles.pendingInfo}>
                <Text style={styles.pendingText}>
                  Your application is under review. We'll notify you once approved.
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Become a Provider Button */}
        {!isRegistered && !hasPendingApplication && (
          <TouchableOpacity 
            style={styles.becomeProviderButton}
            onPress={() => router.push('/provider-register')}
          >
            <View style={styles.becomeProviderIcon}>
              <Briefcase size={24} color="#fff" />
            </View>
            <View style={styles.becomeProviderContent}>
              <Text style={styles.becomeProviderTitle}>Become a Provider</Text>
              <Text style={styles.becomeProviderSubtitle}>
                Offer your services and earn money
              </Text>
            </View>
            <ChevronRight size={20} color="#0891B2" />
          </TouchableOpacity>
        )}

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.bookings}</Text>
            <Text style={styles.statLabel}>Bookings</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.rating}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                index === MENU_ITEMS.length - 1 && styles.menuItemLast,
              ]}
            >
              <View style={styles.menuIconContainer}>
                <item.icon size={20} color="#0891B2" />
              </View>
              <View style={[
                styles.menuContent,
                index !== MENU_ITEMS.length - 1 && styles.menuBorder,
              ]}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <View style={styles.menuRight}>
                  {item.badge && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{item.badge}</Text>
                    </View>
                  )}
                  <ChevronRight size={20} color="#94A3B8" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Contact Info */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.contactItem}>
            <Phone size={18} color="#64748B" />
            <Text style={styles.contactText}>{user.phone}</Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        {/* Delete Account */}
        <TouchableOpacity
          testID="delete-account-link"
          style={styles.deleteAccountButton}
          onPress={() => {
            const subject = encodeURIComponent('Account & Data Deletion Request');
            const body = encodeURIComponent(
              `Hello,\n\nI would like to request the permanent deletion of my account and all associated data.\n\nAccount email: ${user.email}\nName: ${user.name}\n\nThank you.`
            );
            const mailto = `mailto:privacy@jumpstartsxm.com?subject=${subject}&body=${body}`;
            const handleOpen = async () => {
              try {
                if (Platform.OS === 'web') {
                  window.open(mailto, '_blank');
                  return;
                }
                const supported = await Linking.canOpenURL(mailto);
                if (supported) {
                  await Linking.openURL(mailto);
                } else {
                  Alert.alert(
                    'Email not available',
                    'Please email privacy@jumpstartsxm.com to request account deletion.'
                  );
                }
              } catch (e) {
                console.log('delete account link error', e);
                Alert.alert(
                  'Could not open email',
                  'Please email privacy@jumpstartsxm.com to request account deletion.'
                );
              }
            };
            if (Platform.OS === 'web') {
              const ok = window.confirm(
                'Request account deletion? This will open your email app to send a request to privacy@jumpstartsxm.com.'
              );
              if (ok) void handleOpen();
              return;
            }
            Alert.alert(
              'Request Account Deletion',
              'This will open your email app to send a deletion request to privacy@jumpstartsxm.com. Your account and associated data will be permanently removed within 30 days.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Continue', style: 'destructive', onPress: () => void handleOpen() },
              ]
            );
          }}
        >
          <Trash2 size={18} color="#64748B" />
          <Text style={styles.deleteAccountText}>Request Account & Data Deletion</Text>
        </TouchableOpacity>

        {/* Version */}
        <Text style={styles.version}>Version 1.0.0</Text>
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
    paddingBottom: 60,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: -30,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#0891B2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  memberText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
  },
  menuSection: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingRight: 16,
    marginLeft: 12,
  },
  menuBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
  },
  contactSection: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactText: {
    fontSize: 15,
    color: '#475569',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#FEE2E2',
    paddingVertical: 16,
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
  },
  deleteAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#fff',
  },
  deleteAccountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  version: {
    textAlign: 'center',
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 24,
    marginBottom: 32,
  },
  providerCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  providerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  providerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerInfo: {
    marginLeft: 12,
    flex: 1,
  },
  providerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgePending: {
    backgroundColor: '#FEF3C7',
  },
  statusBadgeRejected: {
    backgroundColor: '#FEE2E2',
  },
  statusTextApproved: {
    fontSize: 12,
    fontWeight: '600',
    color: '#22C55E',
  },
  statusTextPending: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F59E0B',
  },
  statusTextRejected: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
  },
  availableBadge: {
    backgroundColor: '#0891B2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availableText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  availabilityLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
  },
  pendingInfo: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  pendingText: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  becomeProviderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 2,
    borderColor: '#0891B2',
  },
  becomeProviderIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#0891B2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  becomeProviderContent: {
    flex: 1,
    marginLeft: 12,
  },
  becomeProviderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  becomeProviderSubtitle: {
    fontSize: 13,
    color: '#64748B',
  },
});
