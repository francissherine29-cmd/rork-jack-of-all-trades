import { SERVICE_CATEGORIES, type ServiceCategory } from '@/constants/services';
import { MOCK_PROVIDERS, type ServiceProvider } from '@/constants/mock-providers';

/** Extra everyday words people type, so search finds the right service. */
const CATEGORY_KEYWORDS: Record<string, string> = {
  landscaping: 'lawn grass garden gardener yard tree trim mow plants',
  taxi: 'taxi cab ride driver airport transfer tour transport',
  babysitting: 'babysitter nanny child kids childcare sitter',
  'food-delivery': 'food meal restaurant delivery eat lunch dinner takeout',
  'home-repair': 'plumber plumbing electrician electrical handyman fix leak carpenter ac',
  cleaning: 'clean cleaner maid housekeeping deep clean laundry',
  'pet-care': 'dog cat pet walk walker groom grooming sitter vet',
  moving: 'move mover moving hauling furniture truck delivery',
  construction: 'builder build renovation paint painter tile roof contractor',
  property: 'villa property management caretaker housekeeping',
  'car-rental': 'car rent rental vehicle suv jeep scooter hire',
  mechanic: 'mechanic car repair garage tire tyre oil brakes battery tow towing engine',
  tutoring: 'tutor teacher lesson homework math english school exam',
  haircare: 'hair haircut barber salon braids stylist fade beard',
  'pool-service': 'pool swimming clean chlorine filter',
  'self-care': 'self care manicure pedicure massage nails nail spa facial wax waxing relax beauty',
};

const toWords = (query: string) =>
  query.toLowerCase().split(/\s+/).filter((w) => w.length > 0);

export function searchCategories(query: string): ServiceCategory[] {
  const words = toWords(query);
  if (words.length === 0) return [];
  return SERVICE_CATEGORIES.filter((c) => {
    const haystack = `${c.name} ${c.description} ${CATEGORY_KEYWORDS[c.id] ?? ''}`.toLowerCase();
    return words.every((w) => haystack.includes(w));
  });
}

export function searchProviders(query: string): ServiceProvider[] {
  const words = toWords(query);
  if (words.length === 0) return [];
  const matched = new Set(searchCategories(query).map((c) => c.id));
  return MOCK_PROVIDERS.filter((p) => {
    const categoryName = SERVICE_CATEGORIES.find((c) => c.id === p.category)?.name ?? '';
    const haystack = `${p.name} ${p.description} ${categoryName}`.toLowerCase();
    return matched.has(p.category) || words.every((w) => haystack.includes(w));
  }).sort((a, b) => b.rating - a.rating);
}
