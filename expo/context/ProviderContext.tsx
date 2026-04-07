import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';

export type ProviderStatus = 'pending' | 'approved' | 'rejected';
export type PaymentMethodType = 'windward_bank' | 'visa_debit';

export type PaymentMethod = {
  type: PaymentMethodType;
  accountNumber: string;
  accountName: string;
  bankName?: string;
};

export type IdentificationType = 'id_card' | 'passport';

export type VerificationDocuments = {
  photoUrl: string;
  censusFormUrl: string;
  identificationType: IdentificationType;
  identificationUrl: string;
  businessLicenseUrl: string;
  photoUploadedAt: string;
  censusFormUploadedAt: string;
  identificationUploadedAt: string;
  businessLicenseUploadedAt: string;
};

export type ServiceProviderRegistration = {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  description: string;
  areas: string[];
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  responseTime: number;
  verificationDocuments: VerificationDocuments;
  paymentMethod: PaymentMethod;
  signupFeePaid: boolean;
  signupFeePaidAt?: string;
  status: ProviderStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewNotes?: string;
  isAvailable: boolean;
  rating: number;
  reviews: number;
  createdAt: string;
};

export type ProviderRegistrationInput = {
  name: string;
  email: string;
  phone: string;
  category: string;
  description: string;
  areas: string[];
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  responseTime: number;
  verificationDocuments: VerificationDocuments;
  paymentMethod: PaymentMethod;
  signupFeePaid: boolean;
};

export const SIGNUP_FEE_AMOUNT = 25;

type ProviderContextType = {
  providers: ServiceProviderRegistration[];
  myProviderProfile: ServiceProviderRegistration | null;
  isLoading: boolean;
  registerProvider: (data: ProviderRegistrationInput) => Promise<void>;
  updateProvider: (id: string, data: Partial<ServiceProviderRegistration>) => Promise<void>;
  toggleAvailability: () => Promise<void>;
  deleteProvider: (id: string) => Promise<void>;
  isRegistered: boolean;
  hasPendingApplication: boolean;
};

const STORAGE_KEY = '@jack_of_all_trades:providers';
const MY_PROFILE_KEY = '@jack_of_all_trades:my_provider_profile';
const EMPTY_ARRAY: ServiceProviderRegistration[] = [];

export const [ProviderContext, useProviderContext] = createContextHook<ProviderContextType>(() => {
  const queryClient = useQueryClient();
  const [isInitialized, setIsInitialized] = useState(false);

  const providersQuery = useQuery({
    queryKey: ['providers'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) as ServiceProviderRegistration[] : [];
    },
  });

  const myProfileQuery = useQuery({
    queryKey: ['myProviderProfile'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(MY_PROFILE_KEY);
      return stored ? JSON.parse(stored) as ServiceProviderRegistration : null;
    },
  });

  const saveProvidersMutation = useMutation({
    mutationFn: async (providers: ServiceProviderRegistration[]) => {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(providers));
      return providers;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['providers'], data);
    },
  });

  const saveProfileMutation = useMutation({
    mutationFn: async (profile: ServiceProviderRegistration | null) => {
      if (profile) {
        await AsyncStorage.setItem(MY_PROFILE_KEY, JSON.stringify(profile));
      } else {
        await AsyncStorage.removeItem(MY_PROFILE_KEY);
      }
      return profile;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['myProviderProfile'], data);
    },
  });

  const registerProvider = useCallback(async (data: ProviderRegistrationInput) => {
    const newProvider: ServiceProviderRegistration = {
      ...data,
      id: `provider_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
      isAvailable: false,
      rating: 0,
      reviews: 0,
      submittedAt: new Date().toISOString(),
      signupFeePaid: data.signupFeePaid,
      signupFeePaidAt: data.signupFeePaid ? new Date().toISOString() : undefined,
    };

    const currentProviders = providersQuery.data || [];
    const updatedProviders = [...currentProviders, newProvider];
    
    await saveProvidersMutation.mutateAsync(updatedProviders);
    await saveProfileMutation.mutateAsync(newProvider);
  }, [providersQuery.data, saveProvidersMutation, saveProfileMutation]);

  const updateProvider = useCallback(async (id: string, data: Partial<ServiceProviderRegistration>) => {
    const currentProviders = providersQuery.data || [];
    const updatedProviders = currentProviders.map(p => 
      p.id === id ? { ...p, ...data } : p
    );
    
    await saveProvidersMutation.mutateAsync(updatedProviders);
    
    const myProfile = myProfileQuery.data;
    if (myProfile && myProfile.id === id) {
      await saveProfileMutation.mutateAsync({ ...myProfile, ...data });
    }
  }, [providersQuery.data, myProfileQuery.data, saveProvidersMutation, saveProfileMutation]);

  const toggleAvailability = useCallback(async () => {
    const myProfile = myProfileQuery.data;
    if (!myProfile) return;
    
    await updateProvider(myProfile.id, { isAvailable: !myProfile.isAvailable });
  }, [myProfileQuery.data, updateProvider]);

  const deleteProvider = useCallback(async (id: string) => {
    const currentProviders = providersQuery.data || [];
    const updatedProviders = currentProviders.filter(p => p.id !== id);
    
    await saveProvidersMutation.mutateAsync(updatedProviders);
    
    const myProfile = myProfileQuery.data;
    if (myProfile && myProfile.id === id) {
      await saveProfileMutation.mutateAsync(null);
    }
  }, [providersQuery.data, myProfileQuery.data, saveProvidersMutation, saveProfileMutation]);

  useEffect(() => {
    if (providersQuery.isSuccess && myProfileQuery.isSuccess) {
      setIsInitialized(true);
    }
  }, [providersQuery.isSuccess, myProfileQuery.isSuccess]);

  const providers = providersQuery.data ?? EMPTY_ARRAY;
  const myProfile = myProfileQuery.data ?? null;
  const isLoading = !isInitialized || providersQuery.isLoading || myProfileQuery.isLoading;
  const isRegistered = !!myProfile;
  const hasPendingApplication = myProfile?.status === 'pending' || false;

  return useMemo(() => ({
    providers,
    myProviderProfile: myProfile,
    isLoading,
    registerProvider,
    updateProvider,
    toggleAvailability,
    deleteProvider,
    isRegistered,
    hasPendingApplication,
  }), [providers, isLoading, myProfile, registerProvider, updateProvider, toggleAvailability, deleteProvider, isRegistered, hasPendingApplication]);
});
