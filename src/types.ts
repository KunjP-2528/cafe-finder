
export interface Position {
  lat: number;
  lng: number;
}

export interface Cafe {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address?: string;
  rating?: number;
  hours?: string;
  description?: string;
}