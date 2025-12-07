import { NextResponse } from 'next/server';
import { getAllHotels, filterHotels, getUniqueCountries, getUniqueCities, getHotelCountByCountry, getDatasetMeta } from '@/lib/hotels';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const action = searchParams.get('action');

  // Return metadata
  if (action === 'meta') {
    return NextResponse.json({
      meta: getDatasetMeta(),
      totalHotels: getAllHotels().length,
      countByCountry: getHotelCountByCountry(),
    });
  }

  // Return filter options
  if (action === 'filters') {
    const country = searchParams.get('country') || undefined;
    return NextResponse.json({
      countries: getUniqueCountries(),
      cities: getUniqueCities(country),
    });
  }

  // Filter hotels
  const country = searchParams.get('country') || undefined;
  const city = searchParams.get('city') || undefined;
  const search = searchParams.get('search') || undefined;

  const hotels = filterHotels({ country, city, search });

  return NextResponse.json({
    hotels,
    total: hotels.length,
  });
}
