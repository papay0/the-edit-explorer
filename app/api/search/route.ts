import { NextResponse } from 'next/server';
import { geocodeAddress, searchHotelsWithinTime } from '@/lib/hotels';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      originInput,
      hours,
      country,
      city,
      averageSpeedKmh = 90,
      coordinates, // Direct coordinates from browser geolocation
    } = body;

    // Validate inputs
    if (!originInput || typeof originInput !== 'string') {
      return NextResponse.json(
        { error: 'Origin address is required' },
        { status: 400 }
      );
    }

    if (!hours || typeof hours !== 'number' || hours <= 0) {
      return NextResponse.json(
        { error: 'Valid hours value is required' },
        { status: 400 }
      );
    }

    let latitude: number;
    let longitude: number;
    let displayName: string;

    // If coordinates are provided directly (from browser geolocation), use them
    if (coordinates && typeof coordinates.latitude === 'number' && typeof coordinates.longitude === 'number') {
      latitude = coordinates.latitude;
      longitude = coordinates.longitude;
      displayName = `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
    } else {
      // Otherwise, geocode the origin address
      const geocodeResult = await geocodeAddress(originInput);

      if (!geocodeResult) {
        return NextResponse.json(
          { error: 'Could not find the specified location. Please try a more specific address or city name.' },
          { status: 400 }
        );
      }

      latitude = geocodeResult.latitude;
      longitude = geocodeResult.longitude;
      displayName = geocodeResult.display_name;
    }

    // Search for hotels within the specified time
    const results = searchHotelsWithinTime(
      latitude,
      longitude,
      hours,
      averageSpeedKmh,
      { country, city }
    );

    return NextResponse.json({
      origin: {
        input: originInput,
        resolved: displayName,
        latitude,
        longitude,
      },
      searchParams: {
        hours,
        averageSpeedKmh,
        maxDistanceKm: hours * averageSpeedKmh,
      },
      results,
      total: results.length,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'An error occurred while searching. Please try again.' },
      { status: 500 }
    );
  }
}
