// Service categories and locations for St. Maarten

export type ServiceCategory = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  bgGradient: [string, string];
};

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'landscaping',
    name: 'Landscaping',
    description: 'Lawn care, gardening, tree trimming',
    icon: 'Leaf',
    color: '#22C55E',
    bgGradient: ['#DCFCE7', '#22C55E'],
  },
  {
    id: 'taxi',
    name: 'Taxi & Transport',
    description: 'Airport transfers, island tours, rides',
    icon: 'Car',
    color: '#3B82F6',
    bgGradient: ['#DBEAFE', '#3B82F6'],
  },
  {
    id: 'babysitting',
    name: 'Babysitting',
    description: 'Child care and nanny services',
    icon: 'Baby',
    color: '#F472B6',
    bgGradient: ['#FCE7F3', '#F472B6'],
  },
  {
    id: 'food-delivery',
    name: 'Food Delivery',
    description: 'Restaurant meals delivered to you',
    icon: 'UtensilsCrossed',
    color: '#F97316',
    bgGradient: ['#FFEDD5', '#F97316'],
  },
  {
    id: 'home-repair',
    name: 'Home Repair',
    description: 'Plumbing, electrical, handyman',
    icon: 'Wrench',
    color: '#6366F1',
    bgGradient: ['#E0E7FF', '#6366F1'],
  },
  {
    id: 'cleaning',
    name: 'Cleaning',
    description: 'House cleaning and deep cleaning',
    icon: 'Sparkles',
    color: '#14B8A6',
    bgGradient: ['#CCFBF1', '#14B8A6'],
  },
  {
    id: 'pet-care',
    name: 'Pet Care',
    description: 'Dog walking, pet sitting, grooming',
    icon: 'Dog',
    color: '#A855F7',
    bgGradient: ['#F3E8FF', '#A855F7'],
  },
  {
    id: 'moving',
    name: 'Moving & Hauling',
    description: 'Furniture moving, deliveries',
    icon: 'Truck',
    color: '#EAB308',
    bgGradient: ['#FEF9C3', '#EAB308'],
  },
  {
    id: 'construction',
    name: 'Construction',
    description: 'Renovations, painting, repairs',
    icon: 'Hammer',
    color: '#78716C',
    bgGradient: ['#F5F5F4', '#78716C'],
  },
  {
    id: 'property',
    name: 'Property Care',
    description: 'Pool maintenance, property management',
    icon: 'Home',
    color: '#0EA5E9',
    bgGradient: ['#E0F2FE', '#0EA5E9'],
  },
  {
    id: 'car-rental',
    name: 'Car Rental',
    description: 'Rent vehicles for island exploration',
    icon: 'CarFront',
    color: '#0D9488',
    bgGradient: ['#CCFBF1', '#0D9488'],
  },
  {
    id: 'mechanic',
    name: 'Mechanic',
    description: 'Auto repairs, maintenance, towing',
    icon: 'Settings',
    color: '#B45309',
    bgGradient: ['#FEF3C7', '#B45309'],
  },
  {
    id: 'tutoring',
    name: 'Tutoring',
    description: 'Academic tutoring, test prep, lessons',
    icon: 'GraduationCap',
    color: '#7C3AED',
    bgGradient: ['#EDE9FE', '#7C3AED'],
  },
  {
    id: 'haircare',
    name: 'Hair Care',
    description: 'Haircuts, styling, braids, treatments',
    icon: 'Scissors',
    color: '#DB2777',
    bgGradient: ['#FCE7F3', '#DB2777'],
  },
  {
    id: 'pool-service',
    name: 'Pool Service',
    description: 'Pool cleaning, maintenance, repairs',
    icon: 'Waves',
    color: '#0284C7',
    bgGradient: ['#E0F2FE', '#0284C7'],
  },
];

export const SXM_AREAS = [
  { id: 'philipsburg', name: 'Philipsburg', zone: 'Dutch Side' },
  { id: 'simpson-bay', name: 'Simpson Bay', zone: 'Dutch Side' },
  { id: 'maho', name: 'Maho', zone: 'Dutch Side' },
  { id: 'cupecoy', name: 'Cupecoy', zone: 'Dutch Side' },
  { id: 'cole-bay', name: 'Cole Bay', zone: 'Dutch Side' },
  { id: 'marigot', name: 'Marigot', zone: 'French Side' },
  { id: 'grand-case', name: 'Grand Case', zone: 'French Side' },
  { id: 'orient-bay', name: 'Orient Bay', zone: 'French Side' },
  { id: 'cul-de-sac', name: 'Cul-de-Sac', zone: 'French Side' },
  { id: 'french-quarter', name: 'French Quarter', zone: 'French Side' },
  { id: 'south-reward', name: 'South Reward', zone: 'Dutch Side' },
  { id: 'cay-hill', name: 'Cay Hill', zone: 'Dutch Side' },
] as const;

export type Area = typeof SXM_AREAS[number];

export const ARRIVAL_TIMES = [
  { id: 'asap', name: 'ASAP', minutes: 0, label: 'As soon as possible' },
  { id: '15min', name: '15 min', minutes: 15, label: 'Within 15 minutes' },
  { id: '30min', name: '30 min', minutes: 30, label: 'Within 30 minutes' },
  { id: '1hour', name: '1 hour', minutes: 60, label: 'Within 1 hour' },
  { id: '2hours', name: '2 hours', minutes: 120, label: 'Within 2 hours' },
  { id: 'today', name: 'Today', minutes: 480, label: 'Sometime today' },
  { id: 'tomorrow', name: 'Tomorrow', minutes: 1440, label: 'Tomorrow' },
] as const;

export type ArrivalTime = typeof ARRIVAL_TIMES[number];
