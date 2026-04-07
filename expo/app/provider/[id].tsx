import { useLocalSearchParams, router } from 'expo-router';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Heart,
  Share2,
  Shield,
  Award,
  Calendar,
} from 'lucide-react-native';
import { MOCK_PROVIDERS } from '@/constants/mock-providers';
import { SERVICE_CATEGORIES } from '@/constants/services';
import { useState } from 'react';

export default function ProviderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isFavorite, setIsFavorite] = useState(false);

  const provider = MOCK_PROVIDERS.find(p => p.id === id);
  const category = provider 
    ? SERVICE_CATEGORIES.find(c => c.id === provider.category)
    : null;

  if (!provider || !category) {
    return (
      <View style={styles.container}>
        <Text>Provider not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: category.color }]}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.headerBackButton}
        >
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerAction}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Heart 
              size={22} 
              color={isFavorite ? '#EF4444' : '#fff'} 
              fill={isFavorite ? '#EF4444' : 'transparent'} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerAction}>
            <Share2 size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{provider.name[0]}</Text>
            </View>
            {provider.isAvailable && (
              <View style={styles.onlineIndicator} />
            )}
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.providerName}>{provider.name}</Text>
            <Text style={styles.categoryName}>{category.name}</Text>
            
            <View style={styles.ratingContainer}>
              <View style={styles.ratingBadge}>
                <Star size={16} color="#fff" fill="#fff" />
                <Text style={styles.ratingText}>{provider.rating}</Text>
              </View>
              <Text style={styles.reviewsText}>({provider.reviews} reviews)</Text>
            </View>
          </View>
        </View>

        {/* Quick Info */}
        <View style={styles.quickInfoContainer}>
          <View style={styles.quickInfoItem}>
            <Clock size={20} color={category.color} />
            <Text style={styles.quickInfoValue}>{provider.responseTime}</Text>
            <Text style={styles.quickInfoLabel}>Response</Text>
          </View>
          <View style={styles.quickInfoDivider} />
          <View style={styles.quickInfoItem}>
            <MapPin size={20} color={category.color} />
            <Text style={styles.quickInfoValue}>{provider.areas.length}</Text>
            <Text style={styles.quickInfoLabel}>Areas</Text>
          </View>
          <View style={styles.quickInfoDivider} />
          <View style={styles.quickInfoItem}>
            <Award size={20} color={category.color} />
            <Text style={styles.quickInfoValue}>{provider.priceRange}</Text>
            <Text style={styles.quickInfoLabel}>Price Range</Text>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{provider.description}</Text>
        </View>

        {/* Service Areas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Areas</Text>
          <View style={styles.areasContainer}>
            {provider.areas.map((area) => (
              <View key={area} style={styles.areaTag}>
                <Text style={styles.areaTagText}>{area.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Availability */}
        {provider.eta && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Availability</Text>
            <View style={styles.availabilityCard}>
              <View style={styles.availabilityIcon}>
                <Clock size={24} color={category.color} />
              </View>
              <View style={styles.availabilityInfo}>
                <Text style={styles.availabilityTitle}>Available Now</Text>
                <Text style={styles.availabilityText}>Can arrive in {provider.eta}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Trust Badges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trust & Safety</Text>
          <View style={styles.trustBadges}>
            <View style={styles.trustBadge}>
              <Shield size={20} color="#22C55E" />
              <Text style={styles.trustBadgeText}>Verified</Text>
            </View>
            <View style={styles.trustBadge}>
              <Award size={20} color="#3B82F6" />
              <Text style={styles.trustBadgeText}>Top Rated</Text>
            </View>
            <View style={styles.trustBadge}>
              <Calendar size={20} color="#8B5CF6" />
              <Text style={styles.trustBadgeText}>Reliable</Text>
            </View>
          </View>
        </View>

        {/* Contact Buttons */}
        <View style={styles.contactSection}>
          <TouchableOpacity style={[styles.contactButton, styles.messageButton]}>
            <MessageCircle size={20} color="#0891B2" />
            <Text style={styles.messageButtonText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.contactButton, styles.callButton, { backgroundColor: category.color }]}>
            <Phone size={20} color="#fff" />
            <Text style={styles.callButtonText}>Call</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Book Now Button */}
      <View style={styles.footer}>
        <View style={styles.footerPrice}>
          <Text style={styles.footerPriceLabel}>Starting from</Text>
          <Text style={styles.footerPriceValue}>{provider.priceRange}</Text>
        </View>
        <TouchableOpacity style={[styles.bookButton, { backgroundColor: category.color }]}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 52,
    paddingHorizontal: 16,
    paddingBottom: 60,
  },
  headerBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    marginHorizontal: 16,
    marginTop: -40,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0891B2',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  reviewsText: {
    fontSize: 13,
    color: '#64748B',
  },
  quickInfoContainer: {
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
  quickInfoItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  quickInfoDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
  },
  quickInfoValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  quickInfoLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 24,
  },
  areasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  areaTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  areaTagText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#475569',
    textTransform: 'capitalize',
  },
  availabilityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F0FDFA',
    padding: 16,
    borderRadius: 12,
  },
  availabilityIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  availabilityInfo: {
    flex: 1,
  },
  availabilityTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  availabilityText: {
    fontSize: 14,
    color: '#0891B2',
    fontWeight: '500',
  },
  trustBadges: {
    flexDirection: 'row',
    gap: 12,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  trustBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  contactSection: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 24,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  messageButton: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#0891B2',
  },
  messageButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0891B2',
  },
  callButton: {
    backgroundColor: '#0891B2',
  },
  callButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  bottomSpacing: {
    height: 100,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  footerPrice: {
    flex: 1,
  },
  footerPriceLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  footerPriceValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  bookButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
