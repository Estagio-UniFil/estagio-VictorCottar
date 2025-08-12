export interface Costumer {
  id?: number;
  name: string;
  phone: string;
  city?: {
    id?: number;
    name?: string;
    state?: string;
  };
  user?: {
    name?: string;
  };
}
