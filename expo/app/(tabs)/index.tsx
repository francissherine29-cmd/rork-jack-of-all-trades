import { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import {
  Search,
  MapPin,
  Clock,
  Leaf,
  Car,
  Baby,
  UtensilsCrossed,
  Wrench,
  Home,
  Dog,
  Sparkles,
  Truck,
  Hammer,
  Star,
  CarFront,
  Settings,
  GraduationCap,
  Scissors,
  Waves,
  WifiOff as WifiOffIcon,
} from 'lucide-react-native';
import { SERVICE_CATEGORIES, SXM_AREAS, ARRIVAL_TIMES } from '@/constants/services';
import { MOCK_PROVIDERS } from '@/constants/mock-providers';
import { useNetwork } from '@/context/NetworkContext';

const { width } = Dimensions.get('window');

const ICONS: Record<string, React.ElementType> = {
  Leaf,
  Car,
  Baby,
  UtensilsCrossed,
  Wrench,
  Home,
  Dog,
  Sparkles,
  Truck,
  Hammer,
  CarFront,
  Settings,
  GraduationCap,
  Scissors,
  Waves,
};

export default function HomeScreen() {
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [scrollY] = useState(new Animated.Value(0));
  const { isOnline } = useNetwork();

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const handleCategoryPress = useCallback((categoryId: string) => {
    router.push({
      pathname: '/service/[category]',
      params: { 
        category: categoryId,
        area: selectedArea,
        time: selectedTime,
      },
    });
  }, [selectedArea, selectedTime]);

  const featuredProviders = MOCK_PROVIDERS.filter(p => p.rating >= 4.8).slice(0, 3);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Floating Header */}
      <Animated.View style={[styles.floatingHeader, { opacity: headerOpacity }]}>
        <Text style={styles.headerTitle}>Jack of all Trades</Text>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.heroContent}>
            <View style={styles.heroTitleRow}>
              <Text style={styles.heroTitle}>Jack of all Trades</Text>
              {!isOnline && (
                <View style={styles.offlinePill}>
                  <WifiOffIcon size={12} color="#fff" />
                  <Text style={styles.offlinePillText}>Offline</Text>
                </View>
              )}
            </View>
            <Text style={styles.heroSubtitle}>
              {isOnline 
                ? 'Your one-stop app for every service in St. Maarten'
                : 'Browsing cached data • Some features limited'}
            </Text>
          </View>
          
          {/* Search Bar */}
          <TouchableOpacity 
            style={styles.searchBar}
            onPress={() => router.push('/' as never)}
          >
            <Search size={20} color="#64748B" />
            <Text style={styles.searchText}>What service do you need?</Text>
          </TouchableOpacity>
        </View>

        {/* Filters Section */}
        <View style={styles.filtersSection}>
          {/* Area Selector */}
          <View style={styles.filterContainer}>
            <View style={styles.filterHeader}>
              <MapPin size={18} color="#0891B2" />
              <Text style={styles.filterTitle}>Select Area</Text>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.areasScroll}
            >
              <TouchableOpacity
                style={[styles.areaChip, !selectedArea && styles.areaChipActive]}
                onPress={() => setSelectedArea('')}
              >
                <Text style={[styles.areaChipText, !selectedArea && styles.areaChipTextActive]}>
                  All Areas
                </Text>
              </TouchableOpacity>
              {SXM_AREAS.map((area) => (
                <TouchableOpacity
                  key={area.id}
                  style={[styles.areaChip, selectedArea === area.id && styles.areaChipActive]}
                  onPress={() => setSelectedArea(area.id)}
                >
                  <Text style={[styles.areaChipText, selectedArea === area.id && styles.areaChipTextActive]}>
                    {area.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Time Selector */}
          <View style={styles.filterContainer}>
            <View style={styles.filterHeader}>
              <Clock size={18} color="#0891B2" />
              <Text style={styles.filterTitle}>When do you need it?</Text>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.timeScroll}
            >
              <TouchableOpacity
                style={[styles.timeChip, !selectedTime && styles.timeChipActive]}
                onPress={() => setSelectedTime('')}
              >
                <Text style={[styles.timeChipText, !selectedTime && styles.timeChipTextActive]}>
                  Anytime
                </Text>
              </TouchableOpacity>
              {ARRIVAL_TIMES.map((time) => (
                <TouchableOpacity
                  key={time.id}
                  style={[styles.timeChip, selectedTime === time.id && styles.timeChipActive]}
                  onPress={() => setSelectedTime(time.id)}
                >
                  <Text style={[styles.timeChipText, selectedTime === time.id && styles.timeChipTextActive]}>
                    {time.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Categories Grid */}
        <View style={styles.categoriesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Browse Services</Text>
            <TouchableOpacity onPress={() => router.push('/' as never)}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.categoriesGrid}>
            {SERVICE_CATEGORIES.map((category) => {
              const IconComponent = ICONS[category.icon];
              return (
                <TouchableOpacity
                  key={category.id}
                  style={styles.categoryCard}
                  onPress={() => handleCategoryPress(category.id)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.categoryIconContainer, { backgroundColor: category.bgGradient[0] }]}>
                    {IconComponent && <IconComponent size={24} color={category.color} strokeWidth={2} />}
                  </View>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryDesc} numberOfLines={1}>{category.description}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Featured Providers */}
        <View style={styles.featuredSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Rated</Text>
            <TouchableOpacity onPress={() => router.push('/' as never)}>
              <Text style={styles.seeAll}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredScroll}
          >
            {featuredProviders.map((provider) => (
              <TouchableOpacity
                key={provider.id}
                style={styles.featuredCard}
                onPress={() => router.push({ pathname: '/provider/[id]', params: { id: provider.id } })}
              >
                <View style={styles.featuredImageContainer}>
                  <View style={styles.featuredImagePlaceholder}>
                    <Text style={styles.featuredImageText}>{provider.name[0]}</Text>
                  </View>
                  {provider.isAvailable && (
                    <View style={styles.availableBadge}>
                      <Text style={styles.availableText}>Available</Text>
                    </View>
                  )}
                </View>
                <View style={styles.featuredInfo}>
                  <Text style={styles.featuredName} numberOfLines={1}>{provider.name}</Text>
                  <View style={styles.ratingContainer}>
                    <Star size={14} color="#F59E0B" fill="#F59E0B" />
                    <Text style={styles.ratingText}>{provider.rating}</Text>
                    <Text style={styles.reviewText}>({provider.reviews})</Text>
                  </View>
                  <Text style={styles.featuredPrice}>{provider.priceRange}</Text>
                  {provider.eta && (
                    <View style={styles.etaContainer}>
                      <Clock size={12} color="#0891B2" />
                      <Text style={styles.etaText}>{provider.eta}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingTop: 48,
    paddingBottom: 12,
    paddingHorizontal: 16,
    zIndex: 100,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },
  hero: {
    backgroundColor: '#0891B2',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  heroContent: {
    marginBottom: 20,
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  offlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(220, 38, 38, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  offlinePillText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: '#fff',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchText: {
    fontSize: 15,
    color: '#94A3B8',
    fontWeight: '500',
  },
  filtersSection: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  areasScroll: {
    paddingHorizontal: 12,
    gap: 8,
  },
  timeScroll: {
    paddingHorizontal: 12,
    gap: 8,
  },
  areaChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  areaChipActive: {
    backgroundColor: '#0891B2',
    borderColor: '#0891B2',
  },
  areaChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
  },
  areaChipTextActive: {
    color: '#fff',
  },
  timeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  timeChipActive: {
    backgroundColor: '#0D9488',
    borderColor: '#0D9488',
  },
  timeChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
  },
  timeChipTextActive: {
    color: '#fff',
  },
  categoriesSection: {
    padding: 16,
    paddingTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0891B2',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: (width - 56) / 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  categoryDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  featuredSection: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  featuredScroll: {
    paddingHorizontal: 12,
    gap: 12,
  },
  featuredCard: {
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  featuredImageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  featuredImagePlaceholder: {
    width: '100%',
    height: 80,
    backgroundColor: '#E0F2FE',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredImageText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0891B2',
  },
  availableBadge: {
    position: 'absolute',
    bottom: -6,
    left: 8,
    backgroundColor: '#22C55E',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availableText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  featuredInfo: {
    gap: 4,
  },
  featuredName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  reviewText: {
    fontSize: 12,
    color: '#64748B',
  },
  featuredPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0891B2',
  },
  etaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  etaText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0891B2',
  },
  bottomSpacing: {
    height: 24,
  },
});
