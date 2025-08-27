export interface Costumer {
  id?: number;
  name: string;
  phone: string;
  city?: {
    id?: number;
    name?: string;
    state?: string;
  };
  neighborhood?: string;
  street?: string;
  number?: number;
  user?: {
    name?: string;
  };
}
