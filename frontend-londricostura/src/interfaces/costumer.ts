export interface Costumer {
  id?: number;
  name: string;
  phone: string;
  city?: {
    name?: string;
    state?: string;
  };
  user?: {
    name?: string;
  };
}