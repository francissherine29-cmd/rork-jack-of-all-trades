import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';

export type BookingStatus = 'upcoming' | 'confirmed' | 'completed' | 'cancelled';

export type Booking = {
  id: string;
  service: string;
  provider: string;
  date: string;
  time: string;
  status: BookingStatus;
  from?: string;
  to?: string;
  address?: string;
  price: string;
  createdAt: string;
  pendingSync: boolean;
};

const BOOKINGS_KEY = '@jack_of_all_trades:bookings';
const PENDING_ACTIONS_KEY = '@jack_of_all_trades:pending_actions';

export type PendingAction = {
  id: string;
  type: 'create_booking' | 'update_booking' | 'cancel_booking';
  payload: Record<string, unknown>;
  createdAt: string;
};

const DEFAULT_BOOKINGS: Booking[] = [
  {
    id: '1',
    service: 'Taxi Service',
    provider: 'SXM Rides',
    date: 'Today',
    time: '2:30 PM',
    status: 'upcoming',
    from: 'Princess Juliana Airport',
    to: 'Simpson Bay Resort',
    price: '$35',
    createdAt: new Date().toISOString(),
    pendingSync: false,
  },
  {
    id: '2',
    service: 'Home Cleaning',
    provider: 'Sparkle Squad',
    date: 'Tomorrow',
    time: '10:00 AM',
    status: 'confirmed',
    address: 'Cupecoy Villa 12',
    price: '$120',
    createdAt: new Date().toISOString(),
    pendingSync: false,
  },
  {
    id: '3',
    service: 'Landscaping',
    provider: 'Island Gardens',
    date: 'Apr 5, 2026',
    time: '9:00 AM',
    status: 'completed',
    address: 'Maho Beach Villa',
    price: '$85',
    createdAt: new Date().toISOString(),
    pendingSync: false,
  },
];

type BookingsContextType = {
  bookings: Booking[];
  pendingActions: PendingAction[];
  isLoading: boolean;
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'pendingSync'>) => void;
  updateBooking: (id: string, data: Partial<Booking>) => void;
  cancelBooking: (id: string) => void;
  hasPendingSync: boolean;
};

const EMPTY_BOOKINGS: Booking[] = [];
const EMPTY_ACTIONS: PendingAction[] = [];

export const [BookingsProvider, useBookings] = createContextHook<BookingsContextType>(() => {
  const queryClient = useQueryClient();
  const [isInitialized, setIsInitialized] = useState(false);

  const bookingsQuery = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(BOOKINGS_KEY);
      if (stored) {
        return JSON.parse(stored) as Booking[];
      }
      await AsyncStorage.setItem(BOOKINGS_KEY, JSON.stringify(DEFAULT_BOOKINGS));
      return DEFAULT_BOOKINGS;
    },
  });

  const pendingActionsQuery = useQuery({
    queryKey: ['pendingActions'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(PENDING_ACTIONS_KEY);
      return stored ? JSON.parse(stored) as PendingAction[] : [];
    },
  });

  const saveBookingsMutation = useMutation({
    mutationFn: async (bookings: Booking[]) => {
      await AsyncStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
      return bookings;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['bookings'], data);
    },
  });

  const _savePendingActionsMutation = useMutation({
    mutationFn: async (actions: PendingAction[]) => {
      await AsyncStorage.setItem(PENDING_ACTIONS_KEY, JSON.stringify(actions));
      return actions;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['pendingActions'], data);
    },
  });

  const addBooking = useCallback((bookingInput: Omit<Booking, 'id' | 'createdAt' | 'pendingSync'>) => {
    const newBooking: Booking = {
      ...bookingInput,
      id: `booking_${Date.now()}`,
      createdAt: new Date().toISOString(),
      pendingSync: false,
    };

    const current = bookingsQuery.data || [];
    const updated = [newBooking, ...current];
    saveBookingsMutation.mutate(updated);

    console.log('[Bookings] Added booking:', newBooking.id);
  }, [bookingsQuery.data, saveBookingsMutation]);

  const updateBooking = useCallback((id: string, data: Partial<Booking>) => {
    const current = bookingsQuery.data || [];
    const updated = current.map(b => b.id === id ? { ...b, ...data } : b);
    saveBookingsMutation.mutate(updated);
    console.log('[Bookings] Updated booking:', id);
  }, [bookingsQuery.data, saveBookingsMutation]);

  const cancelBooking = useCallback((id: string) => {
    const current = bookingsQuery.data || [];
    const updated = current.map(b => b.id === id ? { ...b, status: 'cancelled' as BookingStatus } : b);
    saveBookingsMutation.mutate(updated);
    console.log('[Bookings] Cancelled booking:', id);
  }, [bookingsQuery.data, saveBookingsMutation]);

  useEffect(() => {
    if (bookingsQuery.isSuccess && pendingActionsQuery.isSuccess) {
      setIsInitialized(true);
    }
  }, [bookingsQuery.isSuccess, pendingActionsQuery.isSuccess]);

  const bookings = bookingsQuery.data ?? EMPTY_BOOKINGS;
  const pendingActions = pendingActionsQuery.data ?? EMPTY_ACTIONS;
  const isLoading = !isInitialized || bookingsQuery.isLoading;
  const hasPendingSync = bookings.some(b => b.pendingSync) || pendingActions.length > 0;

  return useMemo(() => ({
    bookings,
    pendingActions,
    isLoading,
    addBooking,
    updateBooking,
    cancelBooking,
    hasPendingSync,
  }), [bookings, pendingActions, isLoading, addBooking, updateBooking, cancelBooking, hasPendingSync]);
});
