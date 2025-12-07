export interface Hotel {
  id: string;
  name: string;
  brand?: string;
  address_line_1?: string;
  address_line_2?: string;
  city: string;
  region?: string;
  postal_code?: string;
  country: string;
  latitude?: number;
  longitude?: number;
  map_url?: string;
  source_url?: string;
  needs_review: boolean;
}

export interface HotelDataset {
  meta: {
    data_version: string;
    last_built_at: string;
    source_url: string;
  };
  hotels: Hotel[];
}

export interface SearchResult extends Hotel {
  distance_km: number;
  distance_miles: number;
  time_hours: number;
}

export interface SearchParams {
  originInput: string;
  hours: number;
  country?: string;
  city?: string;
  averageSpeedKmh?: number;
}

export interface GeocodingResult {
  latitude: number;
  longitude: number;
  display_name: string;
}
