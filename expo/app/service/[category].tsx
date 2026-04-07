import { useLocalSearchParams, router } from 'expo-router';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Star,
  ChevronRight,
  Filter,
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
} from 'lucide-react-native';
import { SERVICE_CATEGORIES, SXM_AREAS, ARRIVAL_TIMES } from '@/constants/services';
import { MOCK_PROVIDERS, ServiceProvider } from '@/constants/mock-providers';
import { useState, useMemo, useCallback } from 'react';

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
};

export default function ServiceCategoryScreen() {
  const { category, area: initialArea, time: initialTime } = useLocalSearchParams<{ 
    category: string;
    area?: string;
    time?: string;
  }>();
  
  const [selectedArea, setSelectedArea] = useState<string>(initialArea || '');
  const [selectedTime, setSelectedTime] = useState<string>(initialTime || '');
  const [scrollY] = useState(new Animated.Value(0));

  const categoryData = SERVICE_CATEGORIES.find(c => c.id === category);
  const IconComponent = categoryData ? ICONS[categoryData.icon] : null;

  const filteredProviders = useMemo(() => {
    let providers = MOCK_PROVIDERS.filter(p => p.category === category);
    
    if (selectedArea) {
      providers = providers.filter(p => p.areas.includes(selectedArea));
    }
    
    return providers.sort((a, b) => {
      if (a.isAvailable !== b.isAvailable) return a.isAvailable ? -1 : 1;
      return b.rating - a.rating;
    });
  }, [category, selectedArea]);

  const handleProviderPress = useCallback((provider: ServiceProvider) => {
    router.push({
      pathname: '/provider/[id]',
      params: { id: provider.id },
    });
  }, []);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  if (!categoryData) {
    return (
      <View style={styles.container}>
        <Text>Category not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Floating Header */}
      <Animated.View style={[styles.floatingHeader, { opacity: headerOpacity }]}>
        <View style={styles.floatingHeaderContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.floatingHeaderTitle}>{categoryData.name}</Text>
          <View style={{ width: 40 }} />
        </View>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: categoryData.color }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerBackButton}>
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <View style={styles.iconContainer}>
              {IconComponent && <IconComponent size={40} color="#fff" strokeWidth={2} />}
            </View>
            <Text style={styles.headerTitle}>{categoryData.name}</Text>
            <Text style={styles.headerSubtitle}>{categoryData.description}</Text>
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filtersSection}>
          <View style={styles.filterContainer}>
            <View style={styles.filterHeader}>
              <MapPin size={18} color={categoryData.color} />
              <Text style={styles.filterTitle}>Filter by Area</Text>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipScroll}
            >
              <TouchableOpacity
                style={[styles.chip, !selectedArea && styles.chipActive]}
                onPress={() => setSelectedArea('')}
              >
                <Text style={[styles.chipText, !selectedArea && styles.chipTextActive]}>
                  All Areas
                </Text>
              </TouchableOpacity>
              {SXM_AREAS.map((area) => (
                <TouchableOpacity
                  key={area.id}
                  style={[styles.chip, selectedArea === area.id && styles.chipActive]}
                  onPress={() => setSelectedArea(area.id)}
                >
                  <Text style={[styles.chipText, selectedArea === area.id && styles.chipTextActive]}>
                    {area.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.filterContainer}>
            <View style={styles.filterHeader}>
              <Clock size={18} color={categoryData.color} />
              <Text style={styles.filterTitle}>Response Time</Text>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipScroll}
            >
              <TouchableOpacity
                style={[styles.chip, !selectedTime && styles.chipActive]}
                onPress={() => setSelectedTime('')}
              >
                <Text style={[styles.chipText, !selectedTime && styles.chipTextActive]}>
                  Any Time
                </Text>
              </TouchableOpacity>
              {ARRIVAL_TIMES.map((time) => (
                <TouchableOpacity
                  key={time.id}
                  style={[styles.chip, selectedTime === time.id && styles.chipActive]}
                  onPress={() => setSelectedTime(time.id)}
                >
                  <Text style={[styles.chipText, selectedTime === time.id && styles.chipTextActive]}>
                    {time.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Results Header */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {filteredProviders.length} {filteredProviders.length === 1 ? 'provider' : 'providers'} available
          </Text>
          <TouchableOpacity style={styles.sortButton}>
            <Filter size={16} color="#64748B" />
            <Text style={styles.sortText}>Sort</Text>
          </TouchableOpacity>
        </View>

        {/* Providers List */}
        <View style={styles.providersList}>
          {filteredProviders.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No providers found</Text>
              <Text style={styles.emptyText}>
                Try adjusting your filters or check back later
              </Text>
            </View>
          ) : (
            filteredProviders.map((provider, index) => (
              <TouchableOpacity
                key={provider.id}
                style={[
                  styles.providerCard,
                  index === filteredProviders.length - 1 && styles.providerCardLast,
                ]}
                onPress={() => handleProviderPress(provider)}
              >
                <View style={styles.providerHeader}>
                  <View style={styles.providerImagePlaceholder}>
                    <Text style={styles.providerImageText}>{provider.name[0]}</Text>
                  </View>
                  <View style={styles.providerInfo}>
                    <View style={styles.providerNameRow}>
                      <Text style={styles.providerName}>{provider.name}</Text>
                      {provider.isAvailable && (
                        <View style={styles.availableBadge}>
                          <Text style={styles.availableText}>Available</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.ratingRow}>
                      <Star size={14} color="#F59E0B" fill="#F59E0B" />
                      <Text style={styles.ratingText}>{provider.rating}</Text>
                      <Text style={styles.reviewText}>({provider.reviews} reviews)</Text>
                    </View>
                    <Text style={styles.responseTime}>
                      Typically responds in {provider.responseTime}
                    </Text>
                  </View>
                  <ChevronRight size={20} color="#94A3B8" />
                </View>

                <View style={styles.providerDetails}>
                  <View style={styles.detailItem}>
                    <MapPin size={14} color="#64748B" />
                    <Text style={styles.detailText}>
                      {provider.areas.slice(0, 2).join(', ')}
                      {provider.areas.length > 2 && ` +${provider.areas.length - 2}`}
                    </Text>
                  </View>
                  {provider.eta && (
                    <View style={styles.detailItem}>
                      <Clock size={14} color="#0891B2" />
                      <Text style={[styles.detailText, styles.etaText]}>{provider.eta}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.providerFooter}>
                  <Text style={styles.priceRange}>{provider.priceRange}</Text>
                  <TouchableOpacity 
                    style={[styles.bookButton, { backgroundColor: categoryData.color }]}
                    onPress={() => handleProviderPress(provider)}
                  >
                    <Text style={styles.bookButtonText}>Book Now</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

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
    zIndex: 100,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  floatingHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  header: {
    paddingTop: 48,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  headerBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
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
  chipScroll: {
    paddingHorizontal: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipActive: {
    backgroundColor: '#0891B2',
    borderColor: '#0891B2',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
  },
  chipTextActive: {
    color: '#fff',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
  },
  sortText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  providersList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  providerCard: {
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
  providerCardLast: {
    marginBottom: 16,
  },
  providerHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  providerImagePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerImageText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0891B2',
  },
  providerInfo: {
    flex: 1,
    gap: 4,
  },
  providerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  availableBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availableText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#16A34A',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  reviewText: {
    fontSize: 13,
    color: '#64748B',
  },
  responseTime: {
    fontSize: 12,
    color: '#64748B',
  },
  providerDetails: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: '#64748B',
  },
  etaText: {
    color: '#0891B2',
    fontWeight: '500',
  },
  providerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  priceRange: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0891B2',
  },
  bookButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  bookButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  bottomSpacing: {
    height: 24,
  },
});
