export interface Client {
  id?: number;
  name: string;
  phone: string;
  city?: {
    name?: string;
  };
  user?: {
    name?: string;
  };
}