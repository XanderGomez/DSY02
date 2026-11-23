export type StoreLocation = {
  id: string;
  name: string;
  address: string;
  phone: string;
  bannerClass: string;
};

export type Employee = { id: string; name: string };

// Sponsor-provided locations with provisional banner colors.
export const storeLocations: StoreLocation[] = [
  { id: 'north', name: 'North Location', address: '2311 N. 90th St., Omaha, NE 68134', phone: '(402) 399-9141', bannerClass: 'bg-blue-800 text-white' },
  { id: 'millard', name: 'Millard Location', address: '14616 W. Center Rd., Omaha, NE 68144', phone: '(402) 895-5653', bannerClass: 'bg-purple-800 text-white' },
];

// Demo staff from the manager dashboard; replace with authenticated backend
// records when available. Never store employee PINs here.
// Every employee works at both stores: this roster is independent of location.
export const demoEmployees: Employee[] = [
  { id: '1042', name: 'Jordan Davis' },
  { id: '1087', name: 'Alex Kim' },
  { id: '1124', name: 'Morgan Lee' },
];
