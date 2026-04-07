import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  ChevronLeft,
  Check,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  FileText,
  User,
  Phone,
  Mail,
  Camera,
  Upload,
  CreditCard,
  Building2,
  AlertCircle,
  Eye,
  Shield,
  CircleDollarSign,
  CheckCircle2,
} from 'lucide-react-native';
import { SERVICE_CATEGORIES, SXM_AREAS } from '@/constants/services';
import { useProviderContext, SIGNUP_FEE_AMOUNT, type PaymentMethodType, type IdentificationType } from '@/context/ProviderContext';
import * as ImagePicker from 'expo-image-picker';

const PRICE_RANGES = [
  { id: '$', label: '$', description: 'Budget friendly' },
  { id: '$$', label: '$$', description: 'Moderate' },
  { id: '$$$', label: '$$$', description: 'Premium' },
  { id: '$$$$', label: '$$$$', description: 'Luxury' },
] as const;

const RESPONSE_TIMES = [
  { id: '15 min', label: '15 min' },
  { id: '30 min', label: '30 min' },
  { id: '1 hour', label: '1 hour' },
  { id: '2 hours', label: '2 hours' },
  { id: 'Same day', label: 'Same day' },
  { id: 'Next day', label: 'Next day' },
] as const;

const PAYMENT_METHODS: { id: PaymentMethodType; label: string; icon: React.ReactNode; description: string }[] = [
  { 
    id: 'windward_bank', 
    label: 'Windward Islands Bank', 
    icon: <Building2 size={20} color="#0891B2" />,
    description: 'Direct bank transfer to your WIB account'
  },
  { 
    id: 'visa_debit', 
    label: 'Visa Debit Card', 
    icon: <CreditCard size={20} color="#0891B2" />,
    description: 'Payments to your Visa debit card'
  },
];

export default function ProviderRegisterScreen() {
  const { registerProvider, isRegistered, hasPendingApplication, myProviderProfile } = useProviderContext();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    description: '',
    areas: [] as string[],
    priceRange: '' as '$' | '$$' | '$$$' | '$$$$' | '',
    responseTime: '',
    experience: '',
    photoUri: '',
    censusFormUri: '',
    identificationType: '' as IdentificationType | '',
    identificationUri: '',
    businessLicenseUri: '',
    paymentMethodType: '' as PaymentMethodType | '',
    paymentAccountNumber: '',
    paymentAccountName: '',
    paymentBankName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [feeAgreed, setFeeAgreed] = useState(false);

  if (isRegistered && myProviderProfile?.status === 'approved') {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <Stack.Screen options={{ headerShown: false }} />
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Provider Registration</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.alreadyRegisteredContainer}>
          <View style={styles.successIcon}>
            <Check size={40} color="#22C55E" />
          </View>
          <Text style={styles.alreadyRegisteredTitle}>You're Already a Provider!</Text>
          <Text style={styles.alreadyRegisteredText}>
            Your provider profile is active. You can manage your services and availability from your profile page.
          </Text>
          <TouchableOpacity 
            style={styles.goToProfileButton}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <Text style={styles.goToProfileText}>Go to Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (hasPendingApplication) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <Stack.Screen options={{ headerShown: false }} />
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Provider Registration</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.alreadyRegisteredContainer}>
          <View style={[styles.successIcon, { backgroundColor: '#FEF3C7' }]}>
            <Clock size={40} color="#F59E0B" />
          </View>
          <Text style={styles.alreadyRegisteredTitle}>Application Under Review</Text>
          <Text style={styles.alreadyRegisteredText}>
            Your application is being reviewed by our team. We'll notify you once it's approved. This usually takes 1-2 business days.
          </Text>
          <TouchableOpacity 
            style={styles.goToProfileButton}
            onPress={() => router.back()}
          >
            <Text style={styles.goToProfileText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const pickImage = async (type: 'photo' | 'census' | 'identification' | 'license') => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photo library to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === 'photo' ? [1, 1] : [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      if (type === 'photo') {
        setFormData(prev => ({ ...prev, photoUri: result.assets[0].uri }));
      } else if (type === 'census') {
        setFormData(prev => ({ ...prev, censusFormUri: result.assets[0].uri }));
      } else if (type === 'license') {
        setFormData(prev => ({ ...prev, businessLicenseUri: result.assets[0].uri }));
      } else {
        setFormData(prev => ({ ...prev, identificationUri: result.assets[0].uri }));
      }
    }
  };

  const takePhoto = async (type: 'photo' | 'census' | 'identification' | 'license') => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your camera to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: type === 'photo' ? [1, 1] : [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      if (type === 'photo') {
        setFormData(prev => ({ ...prev, photoUri: result.assets[0].uri }));
      } else if (type === 'census') {
        setFormData(prev => ({ ...prev, censusFormUri: result.assets[0].uri }));
      } else if (type === 'license') {
        setFormData(prev => ({ ...prev, businessLicenseUri: result.assets[0].uri }));
      } else {
        setFormData(prev => ({ ...prev, identificationUri: result.assets[0].uri }));
      }
    }
  };

  const toggleArea = (areaId: string) => {
    setFormData(prev => ({
      ...prev,
      areas: prev.areas.includes(areaId)
        ? prev.areas.filter(a => a !== areaId)
        : [...prev.areas, areaId],
    }));
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) return 'Please enter your business name';
    if (!formData.email.trim()) return 'Please enter your email';
    if (!formData.phone.trim()) return 'Please enter your phone number';
    if (!formData.category) return 'Please select a service category';
    if (!formData.description.trim()) return 'Please describe your services';
    if (formData.areas.length === 0) return 'Please select at least one area you serve';
    if (!formData.priceRange) return 'Please select your price range';
    if (!formData.responseTime) return 'Please select your typical response time';
    return null;
  };

  const validateStep2 = () => {
    if (!formData.photoUri) return 'Please upload a photo of yourself';
    if (!formData.censusFormUri) return 'Please upload your census registration form';
    if (!formData.identificationType) return 'Please select your identification type';
    if (!formData.identificationUri) return 'Please upload your identification document';
    if (!formData.businessLicenseUri) return 'Please upload your business license or work permit';
    return null;
  };

  const validateStep3 = () => {
    if (!formData.paymentMethodType) return 'Please select a payment method';
    if (!formData.paymentAccountNumber.trim()) return 'Please enter your account number';
    if (!formData.paymentAccountName.trim()) return 'Please enter the account holder name';
    if (formData.paymentMethodType === 'windward_bank' && !formData.paymentBankName.trim()) {
      return 'Please enter your bank branch name';
    }
    return null;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      const error = validateStep1();
      if (error) {
        Alert.alert('Missing Information', error);
        return;
      }
    } else if (currentStep === 2) {
      const error = validateStep2();
      if (error) {
        Alert.alert('Missing Documents', error);
        return;
      }
    } else if (currentStep === 3) {
      const error = validateStep3();
      if (error) {
        Alert.alert('Missing Payment Information', error);
        return;
      }
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!feeAgreed) {
      Alert.alert('Signup Fee Required', 'Please agree to the annual registration fee to continue.');
      return;
    }

    setIsSubmitting(true);
    try {
      await registerProvider({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        category: formData.category,
        description: formData.description,
        areas: formData.areas,
        priceRange: formData.priceRange as '$' | '$$' | '$$$' | '$$$$',
        responseTime: formData.responseTime as unknown as number,
        verificationDocuments: {
          photoUrl: formData.photoUri,
          censusFormUrl: formData.censusFormUri,
          identificationType: formData.identificationType as IdentificationType,
          identificationUrl: formData.identificationUri,
          businessLicenseUrl: formData.businessLicenseUri,
          photoUploadedAt: new Date().toISOString(),
          censusFormUploadedAt: new Date().toISOString(),
          identificationUploadedAt: new Date().toISOString(),
          businessLicenseUploadedAt: new Date().toISOString(),
        },
        paymentMethod: {
          type: formData.paymentMethodType as PaymentMethodType,
          accountNumber: formData.paymentAccountNumber,
          accountName: formData.paymentAccountName,
          bankName: formData.paymentMethodType === 'windward_bank' ? formData.paymentBankName : undefined,
        },
        signupFeePaid: true,
      });
      
      Alert.alert(
        'Application Submitted!',
        'Your provider application has been submitted for review. You\'ll be notified once approved.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <>
      <View style={styles.introSection}>
        <Text style={styles.introTitle}>Join Jack of all Trades</Text>
        <Text style={styles.introText}>
          Offer your services to customers across St. Maarten. Fill out the form below to get started.
        </Text>
        <View style={styles.feeNotice}>
          <CircleDollarSign size={18} color="#FDE68A" />
          <Text style={styles.feeNoticeText}>
            Annual registration fee of ${SIGNUP_FEE_AMOUNT} USD/year applies
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.inputHeader}>
          <User size={18} color="#0891B2" />
          <Text style={styles.inputLabel}>Business Name</Text>
        </View>
        <TextInput
          style={styles.textInput}
          placeholder="Your business or personal name"
          value={formData.name}
          onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
          autoCapitalize="words"
        />
      </View>

      <View style={styles.section}>
        <View style={styles.inputHeader}>
          <Mail size={18} color="#0891B2" />
          <Text style={styles.inputLabel}>Email</Text>
        </View>
        <TextInput
          style={styles.textInput}
          placeholder="your@email.com"
          value={formData.email}
          onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.section}>
        <View style={styles.inputHeader}>
          <Phone size={18} color="#0891B2" />
          <Text style={styles.inputLabel}>Phone Number</Text>
        </View>
        <TextInput
          style={styles.textInput}
          placeholder="+1-721-XXX-XXXX"
          value={formData.phone}
          onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.section}>
        <View style={styles.inputHeader}>
          <Briefcase size={18} color="#0891B2" />
          <Text style={styles.inputLabel}>Service Category</Text>
        </View>
        <View style={styles.chipContainer}>
          {SERVICE_CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                formData.category === category.id && styles.categoryChipActive,
              ]}
              onPress={() => setFormData(prev => ({ ...prev, category: category.id }))}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  formData.category === category.id && styles.categoryChipTextActive,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.inputHeader}>
          <FileText size={18} color="#0891B2" />
          <Text style={styles.inputLabel}>Service Description</Text>
        </View>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          placeholder="Describe the services you offer..."
          value={formData.description}
          onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.section}>
        <View style={styles.inputHeader}>
          <Briefcase size={18} color="#0891B2" />
          <Text style={styles.inputLabel}>Experience (Optional)</Text>
        </View>
        <TextInput
          style={styles.textInput}
          placeholder="e.g., 5 years experience"
          value={formData.experience}
          onChangeText={(text) => setFormData(prev => ({ ...prev, experience: text }))}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.inputHeader}>
          <MapPin size={18} color="#0891B2" />
          <Text style={styles.inputLabel}>Areas You Serve</Text>
        </View>
        <View style={styles.areaSection}>
          <Text style={styles.areaSectionTitle}>Dutch Side</Text>
          <View style={styles.chipContainer}>
            {SXM_AREAS.filter(a => a.zone === 'Dutch Side').map((area) => (
              <TouchableOpacity
                key={area.id}
                style={[
                  styles.areaChip,
                  formData.areas.includes(area.id) && styles.areaChipActive,
                ]}
                onPress={() => toggleArea(area.id)}
              >
                {formData.areas.includes(area.id) && (
                  <Check size={14} color="#fff" style={styles.checkIcon} />
                )}
                <Text
                  style={[
                    styles.areaChipText,
                    formData.areas.includes(area.id) && styles.areaChipTextActive,
                  ]}
                >
                  {area.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.areaSection}>
          <Text style={styles.areaSectionTitle}>French Side</Text>
          <View style={styles.chipContainer}>
            {SXM_AREAS.filter(a => a.zone === 'French Side').map((area) => (
              <TouchableOpacity
                key={area.id}
                style={[
                  styles.areaChip,
                  formData.areas.includes(area.id) && styles.areaChipActive,
                ]}
                onPress={() => toggleArea(area.id)}
              >
                {formData.areas.includes(area.id) && (
                  <Check size={14} color="#fff" style={styles.checkIcon} />
                )}
                <Text
                  style={[
                    styles.areaChipText,
                    formData.areas.includes(area.id) && styles.areaChipTextActive,
                  ]}
                >
                  {area.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.inputHeader}>
          <DollarSign size={18} color="#0891B2" />
          <Text style={styles.inputLabel}>Price Range</Text>
        </View>
        <View style={styles.priceContainer}>
          {PRICE_RANGES.map((price) => (
            <TouchableOpacity
              key={price.id}
              style={[
                styles.priceChip,
                formData.priceRange === price.id && styles.priceChipActive,
              ]}
              onPress={() => setFormData(prev => ({ ...prev, priceRange: price.id }))}
            >
              <Text
                style={[
                  styles.priceChipLabel,
                  formData.priceRange === price.id && styles.priceChipLabelActive,
                ]}
              >
                {price.label}
              </Text>
              <Text
                style={[
                  styles.priceChipDesc,
                  formData.priceRange === price.id && styles.priceChipDescActive,
                ]}
              >
                {price.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.inputHeader}>
          <Clock size={18} color="#0891B2" />
          <Text style={styles.inputLabel}>Typical Response Time</Text>
        </View>
        <View style={styles.chipContainer}>
          {RESPONSE_TIMES.map((time) => (
            <TouchableOpacity
              key={time.id}
              style={[
                styles.timeChip,
                formData.responseTime === time.id && styles.timeChipActive,
              ]}
              onPress={() => setFormData(prev => ({ ...prev, responseTime: time.id }))}
            >
              <Text
                style={[
                  styles.timeChipText,
                  formData.responseTime === time.id && styles.timeChipTextActive,
                ]}
              >
                {time.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </>
  );

  const renderStep2 = () => (
    <>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Verification Documents</Text>
        <Text style={styles.stepSubtitle}>
          Please upload the required documents to verify your identity and eligibility to work in St. Maarten.
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.inputHeader}>
          <Camera size={18} color="#0891B2" />
          <Text style={styles.inputLabel}>Your Photo <Text style={styles.required}>*</Text></Text>
        </View>
        <Text style={styles.inputDescription}>
          Upload a clear photo of yourself. This will be shown to customers.
        </Text>
        
        {formData.photoUri ? (
          <View style={styles.uploadedImageContainer}>
            <Image source={{ uri: formData.photoUri }} style={styles.uploadedPhoto} />
            <TouchableOpacity 
              style={styles.changeImageButton}
              onPress={() => setFormData(prev => ({ ...prev, photoUri: '' }))}
            >
              <Text style={styles.changeImageText}>Change Photo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.uploadButtonsContainer}>
            <TouchableOpacity style={styles.uploadButton} onPress={() => takePhoto('photo')}>
              <Camera size={24} color="#0891B2" />
              <Text style={styles.uploadButtonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage('photo')}>
              <Upload size={24} color="#0891B2" />
              <Text style={styles.uploadButtonText}>Upload from Gallery</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.inputHeader}>
          <FileText size={18} color="#0891B2" />
          <Text style={styles.inputLabel}>Census Registration Form <Text style={styles.required}>*</Text></Text>
        </View>
        <Text style={styles.inputDescription}>
          Upload your detailed registration form from the St. Maarten Census Office. This is required for verification.
        </Text>
        
        {formData.censusFormUri ? (
          <View style={styles.uploadedImageContainer}>
            <Image source={{ uri: formData.censusFormUri }} style={styles.uploadedDocument} />
            <View style={styles.documentInfo}>
              <Check size={16} color="#22C55E" />
              <Text style={styles.documentUploadedText}>Document uploaded</Text>
            </View>
            <TouchableOpacity 
              style={styles.changeImageButton}
              onPress={() => setFormData(prev => ({ ...prev, censusFormUri: '' }))}
            >
              <Text style={styles.changeImageText}>Change Document</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.uploadButtonsContainer}>
            <TouchableOpacity style={styles.uploadButton} onPress={() => takePhoto('census')}>
              <Camera size={24} color="#0891B2" />
              <Text style={styles.uploadButtonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage('census')}>
              <Upload size={24} color="#0891B2" />
              <Text style={styles.uploadButtonText}>Upload from Gallery</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.inputHeader}>
          <Shield size={18} color="#0891B2" />
          <Text style={styles.inputLabel}>Identification Type <Text style={styles.required}>*</Text></Text>
        </View>
        <Text style={styles.inputDescription}>
          Select and upload a valid government-issued ID card or passport.
        </Text>

        <View style={styles.idTypeContainer}>
          <TouchableOpacity
            style={[
              styles.idTypeCard,
              formData.identificationType === 'id_card' && styles.idTypeCardActive,
            ]}
            onPress={() => setFormData(prev => ({ ...prev, identificationType: 'id_card' as IdentificationType }))}
          >
            <View style={[
              styles.idTypeIconBox,
              formData.identificationType === 'id_card' && styles.idTypeIconBoxActive,
            ]}>
              <CreditCard size={22} color={formData.identificationType === 'id_card' ? '#fff' : '#0891B2'} />
            </View>
            <Text style={[
              styles.idTypeLabel,
              formData.identificationType === 'id_card' && styles.idTypeLabelActive,
            ]}>ID Card</Text>
            {formData.identificationType === 'id_card' && (
              <View style={styles.idTypeCheck}>
                <Check size={14} color="#fff" />
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.idTypeCard,
              formData.identificationType === 'passport' && styles.idTypeCardActive,
            ]}
            onPress={() => setFormData(prev => ({ ...prev, identificationType: 'passport' as IdentificationType }))}
          >
            <View style={[
              styles.idTypeIconBox,
              formData.identificationType === 'passport' && styles.idTypeIconBoxActive,
            ]}>
              <FileText size={22} color={formData.identificationType === 'passport' ? '#fff' : '#0891B2'} />
            </View>
            <Text style={[
              styles.idTypeLabel,
              formData.identificationType === 'passport' && styles.idTypeLabelActive,
            ]}>Passport</Text>
            {formData.identificationType === 'passport' && (
              <View style={styles.idTypeCheck}>
                <Check size={14} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {formData.identificationType !== '' && (
          <View style={styles.idUploadSection}>
            <Text style={styles.idUploadLabel}>
              Upload your {formData.identificationType === 'id_card' ? 'ID Card' : 'Passport'} <Text style={styles.required}>*</Text>
            </Text>
            {formData.identificationUri ? (
              <View style={styles.uploadedImageContainer}>
                <Image source={{ uri: formData.identificationUri }} style={styles.uploadedDocument} />
                <View style={styles.documentInfo}>
                  <Check size={16} color="#22C55E" />
                  <Text style={styles.documentUploadedText}>
                    {formData.identificationType === 'id_card' ? 'ID Card' : 'Passport'} uploaded
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.changeImageButton}
                  onPress={() => setFormData(prev => ({ ...prev, identificationUri: '' }))}
                >
                  <Text style={styles.changeImageText}>Change Document</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.uploadButtonsContainer}>
                <TouchableOpacity style={styles.uploadButton} onPress={() => takePhoto('identification')}>
                  <Camera size={24} color="#0891B2" />
                  <Text style={styles.uploadButtonText}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage('identification')}>
                  <Upload size={24} color="#0891B2" />
                  <Text style={styles.uploadButtonText}>Upload from Gallery</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.inputHeader}>
          <Briefcase size={18} color="#0891B2" />
          <Text style={styles.inputLabel}>Business License / Work Permit <Text style={styles.required}>*</Text></Text>
        </View>
        <Text style={styles.inputDescription}>
          Upload a valid business license or work permit authorizing you to operate in St. Maarten.
        </Text>

        {formData.businessLicenseUri ? (
          <View style={styles.uploadedImageContainer}>
            <Image source={{ uri: formData.businessLicenseUri }} style={styles.uploadedDocument} />
            <View style={styles.documentInfo}>
              <Check size={16} color="#22C55E" />
              <Text style={styles.documentUploadedText}>Document uploaded</Text>
            </View>
            <TouchableOpacity
              style={styles.changeImageButton}
              onPress={() => setFormData(prev => ({ ...prev, businessLicenseUri: '' }))}
            >
              <Text style={styles.changeImageText}>Change Document</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.uploadButtonsContainer}>
            <TouchableOpacity style={styles.uploadButton} onPress={() => takePhoto('license')}>
              <Camera size={24} color="#0891B2" />
              <Text style={styles.uploadButtonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage('license')}>
              <Upload size={24} color="#0891B2" />
              <Text style={styles.uploadButtonText}>Upload from Gallery</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.verificationNote}>
        <AlertCircle size={20} color="#F59E0B" />
        <Text style={styles.verificationNoteText}>
          Your documents will be reviewed by our team. This process typically takes 1-2 business days.
        </Text>
      </View>
    </>
  );

  const renderStep3 = () => (
    <>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Payment Information</Text>
        <Text style={styles.stepSubtitle}>
          Set up how you would like to receive payments for your services.
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.inputHeader}>
          <CreditCard size={18} color="#0891B2" />
          <Text style={styles.inputLabel}>Payment Method <Text style={styles.required}>*</Text></Text>
        </View>
        <View style={styles.paymentMethodsContainer}>
          {PAYMENT_METHODS.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethodCard,
                formData.paymentMethodType === method.id && styles.paymentMethodCardActive,
              ]}
              onPress={() => setFormData(prev => ({ ...prev, paymentMethodType: method.id }))}
            >
              <View style={styles.paymentMethodIcon}>
                {method.icon}
              </View>
              <View style={styles.paymentMethodInfo}>
                <Text style={styles.paymentMethodLabel}>{method.label}</Text>
                <Text style={styles.paymentMethodDescription}>{method.description}</Text>
              </View>
              {formData.paymentMethodType === method.id && (
                <View style={styles.paymentMethodCheck}>
                  <Check size={16} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {formData.paymentMethodType && (
        <View style={styles.section}>
          <View style={styles.inputHeader}>
            <Building2 size={18} color="#0891B2" />
            <Text style={styles.inputLabel}>Account Details</Text>
          </View>
          
          <View style={styles.accountInputContainer}>
            <Text style={styles.accountInputLabel}>Account Number <Text style={styles.required}>*</Text></Text>
            <View style={styles.accountInputWrapper}>
              <TextInput
                style={styles.accountInput}
                placeholder={formData.paymentMethodType === 'windward_bank' ? 'Enter your WIB account number' : 'Enter your Visa debit card number'}
                value={formData.paymentAccountNumber}
                onChangeText={(text) => setFormData(prev => ({ ...prev, paymentAccountNumber: text }))}
                keyboardType="number-pad"
                secureTextEntry={!showAccountNumber}
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => setShowAccountNumber(!showAccountNumber)}
              >
                <Eye size={20} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.accountInputContainer}>
            <Text style={styles.accountInputLabel}>Account Holder Name <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.textInput}
              placeholder="Full name as it appears on the account"
              value={formData.paymentAccountName}
              onChangeText={(text) => setFormData(prev => ({ ...prev, paymentAccountName: text }))}
              autoCapitalize="words"
            />
          </View>

          {formData.paymentMethodType === 'windward_bank' && (
            <View style={styles.accountInputContainer}>
              <Text style={styles.accountInputLabel}>Bank Branch <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Philipsburg Branch"
                value={formData.paymentBankName}
                onChangeText={(text) => setFormData(prev => ({ ...prev, paymentBankName: text }))}
              />
            </View>
          )}
        </View>
      )}

      <View style={styles.securityNote}>
        <AlertCircle size={20} color="#0891B2" />
        <Text style={styles.securityNoteText}>
          Your payment information is securely encrypted and only used for processing your earnings.
        </Text>
      </View>
    </>
  );

  const renderStep4 = () => (
    <>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Registration Fee</Text>
        <Text style={styles.stepSubtitle}>
          An annual registration fee is required to register as a service provider on Jack of all Trades.
        </Text>
      </View>

      <View style={styles.feeCard}>
        <View style={styles.feeAmountContainer}>
          <Text style={styles.feeCurrency}>USD</Text>
          <Text style={styles.feeAmount}>${SIGNUP_FEE_AMOUNT}</Text>
        </View>
        <Text style={styles.feeLabel}>Annual registration fee (per year)</Text>

        <View style={styles.feeDivider} />

        <View style={styles.feeBenefits}>
          <View style={styles.feeBenefitRow}>
            <CheckCircle2 size={18} color="#22C55E" />
            <Text style={styles.feeBenefitText}>Profile listed on the platform</Text>
          </View>
          <View style={styles.feeBenefitRow}>
            <CheckCircle2 size={18} color="#22C55E" />
            <Text style={styles.feeBenefitText}>Access to customer requests island-wide</Text>
          </View>
          <View style={styles.feeBenefitRow}>
            <CheckCircle2 size={18} color="#22C55E" />
            <Text style={styles.feeBenefitText}>Verified provider badge</Text>
          </View>
          <View style={styles.feeBenefitRow}>
            <CheckCircle2 size={18} color="#22C55E" />
            <Text style={styles.feeBenefitText}>Direct customer communication</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.feeAgreementRow}
        onPress={() => setFeeAgreed(!feeAgreed)}
        activeOpacity={0.7}
      >
        <View style={[
          styles.feeCheckbox,
          feeAgreed && styles.feeCheckboxChecked,
        ]}>
          {feeAgreed && <Check size={14} color="#fff" />}
        </View>
        <Text style={styles.feeAgreementText}>
          I agree to pay the ${SIGNUP_FEE_AMOUNT} USD annual registration fee
        </Text>
      </TouchableOpacity>

      <View style={styles.securityNote}>
        <Shield size={20} color="#0891B2" />
        <Text style={styles.securityNoteText}>
          Your payment is processed securely. The annual fee covers account verification and platform access, renewed yearly.
        </Text>
      </View>
    </>
  );

  const STEP_LABELS = ['Business', 'Verify', 'Payment', 'Fee'];

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="dark" />
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Become a Provider</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.stepIndicator}>
        {[1, 2, 3, 4].map((step) => (
          <View key={step} style={styles.stepIndicatorItem}>
            <View style={[
              styles.stepDot,
              currentStep === step && styles.stepDotActive,
              currentStep > step && styles.stepDotCompleted,
            ]}>
              {currentStep > step ? (
                <Check size={14} color="#fff" />
              ) : (
                <Text style={[
                  styles.stepNumber,
                  currentStep === step && styles.stepNumberActive,
                ]}>{step}</Text>
              )}
            </View>
            <Text style={[
              styles.stepLabel,
              currentStep === step && styles.stepLabelActive,
            ]}>
              {STEP_LABELS[step - 1]}
            </Text>
          </View>
        ))}
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <View style={styles.navigationContainer}>
        {currentStep > 1 && (
          <TouchableOpacity
            style={styles.backNavButton}
            onPress={handleBack}
            disabled={isSubmitting}
          >
            <Text style={styles.backNavButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        
        {currentStep < 4 ? (
          <TouchableOpacity
            style={[styles.nextButton, currentStep === 1 && styles.nextButtonFull]}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>Continue</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.submitButton, (!feeAgreed || isSubmitting) && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting || !feeAgreed}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Processing...' : `Pay $${SIGNUP_FEE_AMOUNT} & Submit`}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
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
    fontWeight: '700' as const,
    color: '#0F172A',
  },
  placeholder: {
    width: 40,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 20,
  },
  stepIndicatorItem: {
    alignItems: 'center',
    gap: 8,
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    backgroundColor: '#0891B2',
  },
  stepDotCompleted: {
    backgroundColor: '#22C55E',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#64748B',
  },
  stepNumberActive: {
    color: '#fff',
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: '#64748B',
  },
  stepLabelActive: {
    color: '#0891B2',
    fontWeight: '600' as const,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  introSection: {
    backgroundColor: '#0891B2',
    marginHorizontal: -16,
    marginTop: -16,
    marginBottom: 24,
    padding: 24,
  },
  introTitle: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: '#fff',
    marginBottom: 8,
  },
  introText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
  },
  feeNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  feeNoticeText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FDE68A',
  },
  stepHeader: {
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: '#0F172A',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#334155',
  },
  inputDescription: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 12,
    lineHeight: 18,
  },
  required: {
    color: '#EF4444',
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
    paddingBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryChipActive: {
    backgroundColor: '#0891B2',
    borderColor: '#0891B2',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#64748B',
  },
  categoryChipTextActive: {
    color: '#fff',
    fontWeight: '600' as const,
  },
  areaSection: {
    marginBottom: 16,
  },
  areaSectionTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#94A3B8',
    textTransform: 'uppercase',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  areaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  areaChipActive: {
    backgroundColor: '#0D9488',
    borderColor: '#0D9488',
  },
  areaChipText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: '#64748B',
  },
  areaChipTextActive: {
    color: '#fff',
  },
  checkIcon: {
    marginRight: 2,
  },
  priceContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  priceChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  priceChipActive: {
    backgroundColor: '#0891B2',
    borderColor: '#0891B2',
  },
  priceChipLabel: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#0F172A',
    marginBottom: 4,
  },
  priceChipLabelActive: {
    color: '#fff',
  },
  priceChipDesc: {
    fontSize: 11,
    color: '#64748B',
  },
  priceChipDescActive: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  timeChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  timeChipActive: {
    backgroundColor: '#0891B2',
    borderColor: '#0891B2',
  },
  timeChipText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#64748B',
  },
  timeChipTextActive: {
    color: '#fff',
    fontWeight: '600' as const,
  },
  uploadButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  uploadButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#0891B2',
  },
  uploadedImageContainer: {
    alignItems: 'center',
  },
  uploadedPhoto: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: '#0891B2',
  },
  uploadedDocument: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#0891B2',
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  documentUploadedText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#22C55E',
  },
  changeImageButton: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  changeImageText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#64748B',
  },
  verificationNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  verificationNoteText: {
    flex: 1,
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
  paymentMethodsContainer: {
    gap: 12,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  paymentMethodCardActive: {
    borderColor: '#0891B2',
    backgroundColor: '#F0FDFF',
  },
  paymentMethodIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentMethodInfo: {
    flex: 1,
    marginLeft: 12,
  },
  paymentMethodLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#0F172A',
    marginBottom: 4,
  },
  paymentMethodDescription: {
    fontSize: 13,
    color: '#64748B',
  },
  paymentMethodCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0891B2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountInputContainer: {
    marginBottom: 16,
  },
  accountInputLabel: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#334155',
    marginBottom: 8,
  },
  accountInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    padding: 4,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#E0F2FE',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  securityNoteText: {
    flex: 1,
    fontSize: 14,
    color: '#0C4A6E',
    lineHeight: 20,
  },
  feeCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    marginBottom: 24,
  },
  feeAmountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 4,
  },
  feeCurrency: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#64748B',
  },
  feeAmount: {
    fontSize: 48,
    fontWeight: '800' as const,
    color: '#0F172A',
  },
  feeLabel: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '500' as const,
    marginBottom: 20,
  },
  feeDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E2E8F0',
    marginBottom: 20,
  },
  feeBenefits: {
    width: '100%',
    gap: 14,
  },
  feeBenefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  feeBenefitText: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '500' as const,
  },
  feeAgreementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  feeCheckbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  feeCheckboxChecked: {
    backgroundColor: '#0891B2',
    borderColor: '#0891B2',
  },
  feeAgreementText: {
    flex: 1,
    fontSize: 14,
    color: '#334155',
    fontWeight: '500' as const,
    lineHeight: 20,
  },
  navigationContainer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  backNavButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  backNavButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#64748B',
  },
  nextButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#0891B2',
    alignItems: 'center',
  },
  nextButtonFull: {
    flex: 1,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#fff',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#0891B2',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#fff',
  },
  bottomSpacing: {
    height: 32,
  },
  alreadyRegisteredContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  alreadyRegisteredTitle: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: '#0F172A',
    marginBottom: 12,
    textAlign: 'center',
  },
  alreadyRegisteredText: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  goToProfileButton: {
    backgroundColor: '#0891B2',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  goToProfileText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#fff',
  },
  idTypeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  idTypeCard: {
    flex: 1,
    alignItems: 'center',
    padding: 18,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  idTypeCardActive: {
    borderColor: '#0891B2',
    backgroundColor: '#F0FDFF',
  },
  idTypeIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  idTypeIconBoxActive: {
    backgroundColor: '#0891B2',
  },
  idTypeLabel: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#334155',
  },
  idTypeLabelActive: {
    color: '#0891B2',
  },
  idTypeCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0891B2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  idUploadSection: {
    marginTop: 4,
  },
  idUploadLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#334155',
    marginBottom: 12,
  },
});
