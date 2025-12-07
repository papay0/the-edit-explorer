import type { Hotel, HotelDataset, SearchResult, GeocodingResult } from './types';
import hotelData from '@/data/edit_hotels.json';

// Type assertion for the imported JSON
const dataset = hotelData as HotelDataset;

/**
 * Get all hotels from the dataset
 */
export function getAllHotels(): Hotel[] {
  return dataset.hotels;
}

/**
 * Get dataset metadata
 */
export function getDatasetMeta() {
  return dataset.meta;
}

/**
 * Get unique countries from the hotel list
 */
export function getUniqueCountries(): string[] {
  const countries = new Set(dataset.hotels.map(h => h.country));
  return Array.from(countries).sort();
}

/**
 * Get unique cities, optionally filtered by country
 */
export function getUniqueCities(country?: string): string[] {
  let hotels = dataset.hotels;
  if (country) {
    hotels = hotels.filter(h => h.country === country);
  }
  const cities = new Set(hotels.map(h => h.city));
  return Array.from(cities).sort();
}

/**
 * Filter hotels by country and/or city
 */
export function filterHotels(params: {
  country?: string;
  city?: string;
  search?: string;
}): Hotel[] {
  let results = dataset.hotels;

  if (params.country) {
    results = results.filter(h => h.country === params.country);
  }

  if (params.city) {
    results = results.filter(h => h.city === params.city);
  }

  if (params.search) {
    const searchLower = params.search.toLowerCase();
    results = results.filter(h =>
      h.name.toLowerCase().includes(searchLower) ||
      h.city.toLowerCase().includes(searchLower) ||
      h.country.toLowerCase().includes(searchLower) ||
      (h.brand && h.brand.toLowerCase().includes(searchLower))
    );
  }

  return results;
}

/**
 * Calculate distance between two points using Haversine formula
 * @returns distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km

  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);

  const c = 2 * Math.asin(Math.sqrt(a));
  return R * c;
}

/**
 * Convert kilometers to miles
 */
export function kmToMiles(km: number): number {
  return km * 0.621371;
}

/**
 * Calculate approximate travel time in hours
 * @param distanceKm Distance in kilometers
 * @param averageSpeedKmh Average speed in km/h (default 90 km/h)
 */
export function calculateTravelTime(distanceKm: number, averageSpeedKmh = 90): number {
  return distanceKm / averageSpeedKmh;
}

/**
 * Search hotels within a certain travel time from an origin
 */
export function searchHotelsWithinTime(
  originLat: number,
  originLng: number,
  maxHours: number,
  averageSpeedKmh = 90,
  filters?: { country?: string; city?: string }
): SearchResult[] {
  const maxDistanceKm = maxHours * averageSpeedKmh;

  let hotels = dataset.hotels;

  // Apply filters
  if (filters?.country) {
    hotels = hotels.filter(h => h.country === filters.country);
  }
  if (filters?.city) {
    hotels = hotels.filter(h => h.city === filters.city);
  }

  // Calculate distances and filter
  const results: SearchResult[] = [];

  for (const hotel of hotels) {
    // Skip hotels without coordinates
    if (hotel.latitude === undefined || hotel.longitude === undefined) {
      continue;
    }

    const distanceKm = calculateDistance(
      originLat,
      originLng,
      hotel.latitude,
      hotel.longitude
    );

    const timeHours = calculateTravelTime(distanceKm, averageSpeedKmh);

    if (timeHours <= maxHours) {
      results.push({
        ...hotel,
        distance_km: Math.round(distanceKm * 10) / 10,
        distance_miles: Math.round(kmToMiles(distanceKm) * 10) / 10,
        time_hours: Math.round(timeHours * 10) / 10,
      });
    }
  }

  // Sort by distance
  return results.sort((a, b) => a.distance_km - b.distance_km);
}

/**
 * Geocode an address using Nominatim (OpenStreetMap)
 * Note: This should be called server-side to respect usage policies
 */
export async function geocodeAddress(address: string): Promise<GeocodingResult | null> {
  try {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'TheEditHotelsExplorer/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.status}`);
    }

    const data = await response.json();

    if (data.length === 0) {
      return null;
    }

    return {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon),
      display_name: data[0].display_name,
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

/**
 * Get a hotel by ID
 */
export function getHotelById(id: string): Hotel | undefined {
  return dataset.hotels.find(h => h.id === id);
}

/**
 * Get hotel count by country
 */
export function getHotelCountByCountry(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const hotel of dataset.hotels) {
    counts[hotel.country] = (counts[hotel.country] || 0) + 1;
  }
  return counts;
}
