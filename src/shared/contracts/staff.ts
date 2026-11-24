export type StoreLocation = { id: string; name: string; address: string; phone: string };
export type Employee = { id: string; name: string };
export type StoreDirectory = { stores: StoreLocation[]; employees: Employee[] };
