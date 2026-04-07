import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  ChevronLeft,
  Check,
  X,
  Clock,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  DollarSign,
  Trash2,
  Filter,
  Camera,
  FileText,
  CreditCard,
  Building2,
  Eye,
  User,
  AlertCircle,
} from 'lucide-react-native';
import { useProviderContext, type ServiceProviderRegistration, type ProviderStatus } from '@/context/ProviderContext';
import { SERVICE_CATEGORIES } from '@/constants/services';

const STATUS_FILTERS: { id: ProviderStatus | 'all'; label: string; color: string }[] = [
  { id: 'all', label: 'All', color: '#64748B' },
  { id: 'pending', label: 'Pending', color: '#F59E0B' },
  { id: 'approved', label: 'Approved', color: '#22C55E' },
  { id: 'rejected', label: 'Rejected', color: '#EF4444' },
];

export default function AdminProvidersScreen() {
  const { providers, updateProvider, deleteProvider, isLoading } = useProviderContext();
  const [selectedFilter, setSelectedFilter] = useState<ProviderStatus | 'all'>('all');
  const [selectedProvider, setSelectedProvider] = useState<ServiceProviderRegistration | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageUri, setModalImageUri] = useState('');
  const [modalImageTitle, setModalImageTitle] = useState('');

  const filteredProviders = providers.filter(
    p => selectedFilter === 'all' || p.status === selectedFilter
  );

  const handleApprove = (provider: ServiceProviderRegistration) => {
    Alert.alert(
      'Approve Provider',
      `Are you sure you want to approve ${provider.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          style: 'default',
          onPress: async () => {
            await updateProvider(provider.id, { 
              status: 'approved',
              isAvailable: true,
            });
            if (selectedProvider?.id === provider.id) {
              setSelectedProvider({ ...selectedProvider, status: 'approved', isAvailable: true });
            }
          },
        },
      ]
    );
  };

  const handleReject = (provider: ServiceProviderRegistration) => {
    Alert.alert(
      'Reject Provider',
      `Are you sure you want to reject ${provider.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            await updateProvider(provider.id, { status: 'rejected' });
            if (selectedProvider?.id === provider.id) {
              setSelectedProvider({ ...selectedProvider, status: 'rejected' });
            }
          },
        },
      ]
    );
  };

  const handleDelete = (provider: ServiceProviderRegistration) => {
    Alert.alert(
      'Delete Provider',
      `Are you sure you want to permanently delete ${provider.name}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteProvider(provider.id);
            if (selectedProvider?.id === provider.id) {
              setShowDetailModal(false);
              setSelectedProvider(null);
            }
          },
        },
      ]
    );
  };

  const openImageModal = (uri: string, title: string) => {
    setModalImageUri(uri);
    setModalImageTitle(title);
    setShowImageModal(true);
  };

  const getCategoryName = (categoryId: string) => {
    return SERVICE_CATEGORIES.find(c => c.id === categoryId)?.name || categoryId;
  };

  const getStatusIcon = (status: ProviderStatus) => {
    switch (status) {
      case 'approved':
        return <Check size={16} color="#22C55E" />;
      case 'rejected':
        return <X size={16} color="#EF4444" />;
      case 'pending':
        return <Clock size={16} color="#F59E0B" />;
    }
  };

  const getStatusStyle = (status: ProviderStatus) => {
    switch (status) {
      case 'approved':
        return styles.statusApproved;
      case 'rejected':
        return styles.statusRejected;
      case 'pending':
        return styles.statusPending;
    }
  };

  const getStatusTextStyle = (status: ProviderStatus) => {
    switch (status) {
      case 'approved':
        return styles.statusTextApproved;
      case 'rejected':
        return styles.statusTextRejected;
      case 'pending':
        return styles.statusTextPending;
    }
  };

  const renderProviderDetailModal = () => {
    if (!selectedProvider) return null;

    const hasDocuments = selectedProvider.verificationDocuments?.photoUrl && 
                         selectedProvider.verificationDocuments?.censusFormUrl;

    return (
      <Modal
        visible={showDetailModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowDetailModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={() => setShowDetailModal(false)} 
              style={styles.modalBackButton}
            >
              <ChevronLeft size={24} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Provider Details</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
            {/* Provider Header */}
            <View style={styles.modalProviderHeader}>
              <View style={styles.modalAvatar}>
                <Text style={styles.modalAvatarText}>{selectedProvider.name[0]}</Text>
              </View>
              <View style={styles.modalProviderInfo}>
                <Text style={styles.modalProviderName}>{selectedProvider.name}</Text>
                <View style={[styles.statusBadge, getStatusStyle(selectedProvider.status)]}>
                  {getStatusIcon(selectedProvider.status)}
                  <Text style={[styles.statusText, getStatusTextStyle(selectedProvider.status)]}>
                    {selectedProvider.status.charAt(0).toUpperCase() + selectedProvider.status.slice(1)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Verification Status Alert */}
            {selectedProvider.status === 'pending' && (
              <View style={styles.verificationAlert}>
                <AlertCircle size={20} color="#F59E0B" />
                <Text style={styles.verificationAlertText}>
                  This application is pending review. Please verify the documents below before approving.
                </Text>
              </View>
            )}

            {/* Basic Info Section */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Basic Information</Text>
              <View style={styles.modalInfoCard}>
                <View style={styles.modalInfoRow}>
                  <Briefcase size={18} color="#0891B2" />
                  <View style={styles.modalInfoContent}>
                    <Text style={styles.modalInfoLabel}>Service Category</Text>
                    <Text style={styles.modalInfoValue}>{getCategoryName(selectedProvider.category)}</Text>
                  </View>
                </View>
                <View style={styles.modalDivider} />
                <View style={styles.modalInfoRow}>
                  <Mail size={18} color="#0891B2" />
                  <View style={styles.modalInfoContent}>
                    <Text style={styles.modalInfoLabel}>Email</Text>
                    <Text style={styles.modalInfoValue}>{selectedProvider.email}</Text>
                  </View>
                </View>
                <View style={styles.modalDivider} />
                <View style={styles.modalInfoRow}>
                  <Phone size={18} color="#0891B2" />
                  <View style={styles.modalInfoContent}>
                    <Text style={styles.modalInfoLabel}>Phone</Text>
                    <Text style={styles.modalInfoValue}>{selectedProvider.phone}</Text>
                  </View>
                </View>
                <View style={styles.modalDivider} />
                <View style={styles.modalInfoRow}>
                  <DollarSign size={18} color="#0891B2" />
                  <View style={styles.modalInfoContent}>
                    <Text style={styles.modalInfoLabel}>Price Range</Text>
                    <Text style={styles.modalInfoValue}>{selectedProvider.priceRange}</Text>
                  </View>
                </View>
                <View style={styles.modalDivider} />
                <View style={styles.modalInfoRow}>
                  <MapPin size={18} color="#0891B2" />
                  <View style={styles.modalInfoContent}>
                    <Text style={styles.modalInfoLabel}>Service Areas</Text>
                    <Text style={styles.modalInfoValue}>{selectedProvider.areas.length} areas</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Description */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>About</Text>
              <View style={styles.modalDescriptionCard}>
                <Text style={styles.modalDescriptionText}>{selectedProvider.description}</Text>
              </View>
            </View>

            {/* Verification Documents */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Verification Documents</Text>
              
              {/* Photo */}
              <View style={styles.documentCard}>
                <View style={styles.documentHeader}>
                  <Camera size={18} color="#0891B2" />
                  <Text style={styles.documentTitle}>Provider Photo</Text>
                  {selectedProvider.verificationDocuments?.photoUrl ? (
                    <View style={styles.documentUploadedBadge}>
                      <Check size={12} color="#22C55E" />
                      <Text style={styles.documentUploadedText}>Uploaded</Text>
                    </View>
                  ) : (
                    <View style={styles.documentMissingBadge}>
                      <X size={12} color="#EF4444" />
                      <Text style={styles.documentMissingText}>Missing</Text>
                    </View>
                  )}
                </View>
                {selectedProvider.verificationDocuments?.photoUrl && (
                  <TouchableOpacity 
                    style={styles.documentImageContainer}
                    onPress={() => openImageModal(selectedProvider.verificationDocuments.photoUrl, 'Provider Photo')}
                  >
                    <Image 
                      source={{ uri: selectedProvider.verificationDocuments.photoUrl }} 
                      style={styles.documentPhotoImage} 
                    />
                    <View style={styles.viewOverlay}>
                      <Eye size={24} color="#fff" />
                      <Text style={styles.viewOverlayText}>Tap to view</Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>

              {/* Census Form */}
              <View style={styles.documentCard}>
                <View style={styles.documentHeader}>
                  <FileText size={18} color="#0891B2" />
                  <Text style={styles.documentTitle}>Census Registration Form</Text>
                  {selectedProvider.verificationDocuments?.censusFormUrl ? (
                    <View style={styles.documentUploadedBadge}>
                      <Check size={12} color="#22C55E" />
                      <Text style={styles.documentUploadedText}>Uploaded</Text>
                    </View>
                  ) : (
                    <View style={styles.documentMissingBadge}>
                      <X size={12} color="#EF4444" />
                      <Text style={styles.documentMissingText}>Missing</Text>
                    </View>
                  )}
                </View>
                {selectedProvider.verificationDocuments?.censusFormUrl && (
                  <TouchableOpacity 
                    style={styles.documentImageContainer}
                    onPress={() => openImageModal(selectedProvider.verificationDocuments.censusFormUrl, 'Census Form')}
                  >
                    <Image 
                      source={{ uri: selectedProvider.verificationDocuments.censusFormUrl }} 
                      style={styles.documentCensusImage} 
                    />
                    <View style={styles.viewOverlay}>
                      <Eye size={24} color="#fff" />
                      <Text style={styles.viewOverlayText}>Tap to view</Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Payment Information */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Payment Information</Text>
              <View style={styles.modalInfoCard}>
                <View style={styles.modalInfoRow}>
                  {selectedProvider.paymentMethod?.type === 'windward_bank' ? (
                    <Building2 size={18} color="#0891B2" />
                  ) : (
                    <CreditCard size={18} color="#0891B2" />
                  )}
                  <View style={styles.modalInfoContent}>
                    <Text style={styles.modalInfoLabel}>Payment Method</Text>
                    <Text style={styles.modalInfoValue}>
                      {selectedProvider.paymentMethod?.type === 'windward_bank' 
                        ? 'Windward Islands Bank' 
                        : 'Visa Debit Card'}
                    </Text>
                  </View>
                </View>
                <View style={styles.modalDivider} />
                <View style={styles.modalInfoRow}>
                  <User size={18} color="#0891B2" />
                  <View style={styles.modalInfoContent}>
                    <Text style={styles.modalInfoLabel}>Account Holder</Text>
                    <Text style={styles.modalInfoValue}>{selectedProvider.paymentMethod?.accountName}</Text>
                  </View>
                </View>
                <View style={styles.modalDivider} />
                <View style={styles.modalInfoRow}>
                  <CreditCard size={18} color="#0891B2" />
                  <View style={styles.modalInfoContent}>
                    <Text style={styles.modalInfoLabel}>Account Number</Text>
                    <Text style={styles.modalInfoValue}>
                      ****{selectedProvider.paymentMethod?.accountNumber.slice(-4)}
                    </Text>
                  </View>
                </View>
                {selectedProvider.paymentMethod?.bankName && (
                  <>
                    <View style={styles.modalDivider} />
                    <View style={styles.modalInfoRow}>
                      <Building2 size={18} color="#0891B2" />
                      <View style={styles.modalInfoContent}>
                        <Text style={styles.modalInfoLabel}>Bank Branch</Text>
                        <Text style={styles.modalInfoValue}>{selectedProvider.paymentMethod.bankName}</Text>
                      </View>
                    </View>
                  </>
                )}
              </View>
            </View>

            <View style={styles.modalBottomSpacing} />
          </ScrollView>

          {/* Modal Actions */}
          <View style={styles.modalActions}>
            {selectedProvider.status === 'pending' ? (
              <View style={styles.modalActionRow}>
                <TouchableOpacity
                  style={[styles.modalActionButton, styles.modalRejectButton]}
                  onPress={() => handleReject(selectedProvider)}
                  disabled={isLoading}
                >
                  <X size={20} color="#EF4444" />
                  <Text style={styles.modalRejectButtonText}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalActionButton, styles.modalApproveButton]}
                  onPress={() => handleApprove(selectedProvider)}
                  disabled={isLoading || !hasDocuments}
                >
                  <Check size={20} color="#fff" />
                  <Text style={styles.modalApproveButtonText}>Approve</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.modalActionButton, styles.modalDeleteButton]}
                onPress={() => handleDelete(selectedProvider)}
                disabled={isLoading}
              >
                <Trash2 size={20} color="#EF4444" />
                <Text style={styles.modalDeleteButtonText}>Delete Provider</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    );
  };

  const renderImageModal = () => (
    <Modal
      visible={showImageModal}
      animationType="fade"
      transparent={true}
      onRequestClose={() => setShowImageModal(false)}
    >
      <View style={styles.imageModalOverlay}>
        <TouchableOpacity 
          style={styles.imageModalClose}
          onPress={() => setShowImageModal(false)}
        >
          <X size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.imageModalTitle}>{modalImageTitle}</Text>
        {modalImageUri && (
          <Image source={{ uri: modalImageUri }} style={styles.imageModalImage} resizeMode="contain" />
        )}
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Providers</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{providers.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {providers.filter(p => p.status === 'pending').length}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {providers.filter(p => p.status === 'approved').length}
          </Text>
          <Text style={styles.statLabel}>Approved</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <View style={styles.filterIcon}>
          <Filter size={16} color="#64748B" />
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {STATUS_FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterChip,
                selectedFilter === filter.id && { 
                  backgroundColor: filter.color,
                  borderColor: filter.color,
                },
              ]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedFilter === filter.id && styles.filterChipTextActive,
                ]}
              >
                {filter.label}
              </Text>
              <View style={[styles.filterBadge, { backgroundColor: filter.color + '20' }]}>
                <Text style={[styles.filterBadgeText, { color: filter.color }]}>
                  {filter.id === 'all' 
                    ? providers.length 
                    : providers.filter(p => p.status === filter.id).length}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Providers List */}
      <ScrollView 
        style={styles.providersList}
        contentContainerStyle={styles.providersListContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Loading...</Text>
          </View>
        ) : filteredProviders.length === 0 ? (
          <View style={styles.emptyState}>
            <Briefcase size={48} color="#CBD5E1" />
            <Text style={styles.emptyStateTitle}>No providers found</Text>
            <Text style={styles.emptyStateText}>
              {selectedFilter === 'all' 
                ? 'No providers have registered yet.' 
                : `No ${selectedFilter} providers found.`}
            </Text>
          </View>
        ) : (
          filteredProviders.map((provider) => (
            <TouchableOpacity 
              key={provider.id} 
              style={styles.providerCard}
              onPress={() => {
                setSelectedProvider(provider);
                setShowDetailModal(true);
              }}
            >
              {/* Header */}
              <View style={styles.cardHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{provider.name[0]}</Text>
                </View>
                <View style={styles.headerInfo}>
                  <Text style={styles.providerName}>{provider.name}</Text>
                  <View style={[styles.statusBadge, getStatusStyle(provider.status)]}>
                    {getStatusIcon(provider.status)}
                    <Text style={[styles.statusText, getStatusTextStyle(provider.status)]}>
                      {provider.status.charAt(0).toUpperCase() + provider.status.slice(1)}
                    </Text>
                  </View>
                </View>
                {provider.isAvailable && provider.status === 'approved' && (
                  <View style={styles.availableBadge}>
                    <Text style={styles.availableText}>Available</Text>
                  </View>
                )}
              </View>

              {/* Details */}
              <View style={styles.detailsSection}>
                <View style={styles.detailRow}>
                  <Briefcase size={16} color="#64748B" />
                  <Text style={styles.detailText}>{getCategoryName(provider.category)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Mail size={16} color="#64748B" />
                  <Text style={styles.detailText}>{provider.email}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Phone size={16} color="#64748B" />
                  <Text style={styles.detailText}>{provider.phone}</Text>
                </View>
                <View style={styles.detailRow}>
                  <DollarSign size={16} color="#64748B" />
                  <Text style={styles.detailText}>{provider.priceRange}</Text>
                </View>
                <View style={styles.detailRow}>
                  <MapPin size={16} color="#64748B" />
                  <Text style={styles.detailText}>
                    {provider.areas.length} area{provider.areas.length !== 1 ? 's' : ''}
                  </Text>
                </View>
              </View>

              {/* Verification Status */}
              <View style={styles.verificationStatusRow}>
                <View style={styles.verificationStatusItem}>
                  <Camera size={14} color={provider.verificationDocuments?.photoUrl ? '#22C55E' : '#EF4444'} />
                  <Text style={[
                    styles.verificationStatusText,
                    { color: provider.verificationDocuments?.photoUrl ? '#22C55E' : '#EF4444' }
                  ]}>
                    Photo
                  </Text>
                </View>
                <View style={styles.verificationStatusItem}>
                  <FileText size={14} color={provider.verificationDocuments?.censusFormUrl ? '#22C55E' : '#EF4444'} />
                  <Text style={[
                    styles.verificationStatusText,
                    { color: provider.verificationDocuments?.censusFormUrl ? '#22C55E' : '#EF4444' }
                  ]}>
                    Census
                  </Text>
                </View>
                <View style={styles.verificationStatusItem}>
                  <CreditCard size={14} color={provider.paymentMethod?.accountNumber ? '#22C55E' : '#EF4444'} />
                  <Text style={[
                    styles.verificationStatusText,
                    { color: provider.paymentMethod?.accountNumber ? '#22C55E' : '#EF4444' }
                  ]}>
                    Payment
                  </Text>
                </View>
              </View>

              {/* Quick Actions */}
              {provider.status === 'pending' && (
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleReject(provider);
                    }}
                    disabled={isLoading}
                  >
                    <X size={18} color="#EF4444" />
                    <Text style={styles.rejectButtonText}>Reject</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.approveButton]}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleApprove(provider);
                    }}
                    disabled={isLoading}
                  >
                    <Check size={18} color="#fff" />
                    <Text style={styles.approveButtonText}>Approve</Text>
                  </TouchableOpacity>
                </View>
              )}

              {provider.status !== 'pending' && (
                <View style={styles.singleActionRow}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleDelete(provider);
                    }}
                    disabled={isLoading}
                  >
                    <Trash2 size={18} color="#EF4444" />
                    <Text style={styles.deleteButtonText}>Delete Provider</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          ))
        )}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {renderProviderDetailModal()}
      {renderImageModal()}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  placeholder: {
    width: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 16,
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
    fontSize: 20,
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
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 16,
  },
  filterIcon: {
    marginRight: 8,
  },
  filterScroll: {
    gap: 8,
    paddingRight: 16,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  filterChipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  filterBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  filterBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  providersList: {
    flex: 1,
    marginTop: 16,
  },
  providersListContent: {
    paddingHorizontal: 16,
    gap: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
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
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0891B2',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusApproved: {
    backgroundColor: '#DCFCE7',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusRejected: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextApproved: {
    color: '#22C55E',
  },
  statusTextPending: {
    color: '#F59E0B',
  },
  statusTextRejected: {
    color: '#EF4444',
  },
  availableBadge: {
    backgroundColor: '#0891B2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availableText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  detailsSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#475569',
    flex: 1,
  },
  verificationStatusRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  verificationStatusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verificationStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  singleActionRow: {
    flexDirection: 'row',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
  },
  rejectButton: {
    backgroundColor: '#FEE2E2',
  },
  rejectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
  },
  approveButton: {
    backgroundColor: '#0891B2',
  },
  approveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
  },
  bottomSpacing: {
    height: 24,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalScroll: {
    flex: 1,
  },
  modalProviderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  modalAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalAvatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0891B2',
  },
  modalProviderInfo: {
    marginLeft: 16,
    flex: 1,
  },
  modalProviderName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  verificationAlert: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#FEF3C7',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
  },
  verificationAlertText: {
    flex: 1,
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
  modalSection: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  modalInfoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  modalInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalInfoContent: {
    flex: 1,
  },
  modalInfoLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 2,
  },
  modalInfoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  modalDescriptionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  modalDescriptionText: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
  },
  documentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  documentTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  documentUploadedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  documentUploadedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#22C55E',
  },
  documentMissingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  documentMissingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
  },
  documentImageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  documentPhotoImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
  },
  documentCensusImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  viewOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  viewOverlayText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalActions: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modalActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  modalRejectButton: {
    backgroundColor: '#FEE2E2',
    flex: 1,
  },
  modalRejectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  modalApproveButton: {
    backgroundColor: '#0891B2',
    flex: 1.5,
  },
  modalApproveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  modalDeleteButton: {
    backgroundColor: '#FEE2E2',
  },
  modalDeleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  modalBottomSpacing: {
    height: 24,
  },
  // Image Modal Styles
  imageModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageModalClose: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageModalTitle: {
    position: 'absolute',
    top: 60,
    left: 20,
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  imageModalImage: {
    width: '90%',
    height: '70%',
    borderRadius: 12,
  },
});
