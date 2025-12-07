/**
 * Geocode hotels using Nominatim (OpenStreetMap)
 * Run with: node tools/geocode-hotels.mjs
 *
 * This script:
 * 1. Reads parsed hotels from data/parsed_hotels.json
 * 2. Merges with existing data/edit_hotels.json (preserves existing coordinates)
 * 3. Geocodes hotels without coordinates using Nominatim
 * 4. Saves progress incrementally
 *
 * Rate limit: 1 request per second (Nominatim requirement)
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const RATE_LIMIT_MS = 1100; // Slightly over 1 second to be safe
const PROGRESS_FILE = './data/geocode_progress.json';
const OUTPUT_FILE = './data/edit_hotels.json';

// Sleep function for rate limiting
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Geocode using Nominatim
async function geocodeAddress(query) {
  const params = new URLSearchParams({
    q: query,
    format: 'json',
    limit: '1',
    addressdetails: '1'
  });

  try {
    const response = await fetch(`${NOMINATIM_URL}?${params}`, {
      headers: {
        'User-Agent': 'TheEditHotelFinder/1.0 (hotel data enrichment)'
      }
    });

    if (!response.ok) {
      console.error(`Geocode error: ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (data.length > 0) {
      const result = data[0];
      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        display_name: result.display_name
      };
    }

    return null;
  } catch (error) {
    console.error(`Geocode fetch error: ${error.message}`);
    return null;
  }
}

// Load existing data
function loadExistingData() {
  if (existsSync(OUTPUT_FILE)) {
    const data = JSON.parse(readFileSync(OUTPUT_FILE, 'utf-8'));
    return data.hotels || [];
  }
  return [];
}

// Load parsed hotels
function loadParsedHotels() {
  const data = JSON.parse(readFileSync('./data/parsed_hotels.json', 'utf-8'));
  return data.hotels || [];
}

// Load progress
function loadProgress() {
  if (existsSync(PROGRESS_FILE)) {
    return JSON.parse(readFileSync(PROGRESS_FILE, 'utf-8'));
  }
  return { processedIds: [], hotels: {} };
}

// Save progress
function saveProgress(progress) {
  writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

// Save final output
function saveOutput(hotels) {
  const output = {
    meta: {
      data_version: 'v2',
      last_built_at: new Date().toISOString(),
      source_url: 'https://theeditchase.com/properties',
      total_hotels: hotels.length
    },
    hotels
  };
  writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
}

// Create lookup key for deduplication
function createKey(name, city, country) {
  return `${name}|${city}|${country}`.toLowerCase().replace(/\s+/g, ' ').trim();
}

// Normalize hotel for comparison
function normalizeForComparison(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

async function main() {
  console.log('Starting geocoding process...\n');

  // Load data
  const existingHotels = loadExistingData();
  const parsedHotels = loadParsedHotels();
  const progress = loadProgress();

  console.log(`Existing hotels: ${existingHotels.length}`);
  console.log(`Parsed hotels from HTML: ${parsedHotels.length}`);
  console.log(`Previously processed: ${progress.processedIds.length}`);

  // Create map of existing hotels by normalized name+city for matching
  const existingMap = new Map();
  existingHotels.forEach(h => {
    const key = normalizeForComparison(`${h.name}${h.city}`);
    existingMap.set(key, h);
  });

  // Merge hotels - prefer existing data if it has coordinates
  const mergedHotels = new Map();

  // First add all existing hotels
  existingHotels.forEach(h => {
    const key = createKey(h.name, h.city, h.country);
    mergedHotels.set(key, h);
  });

  // Then add/update with parsed hotels
  parsedHotels.forEach(parsed => {
    const key = createKey(parsed.name, parsed.city, parsed.country);

    if (mergedHotels.has(key)) {
      // Keep existing if it has coordinates
      const existing = mergedHotels.get(key);
      if (!existing.latitude && progress.hotels[parsed.id]) {
        // Use progress data if available
        const progData = progress.hotels[parsed.id];
        existing.latitude = progData.latitude;
        existing.longitude = progData.longitude;
        existing.needs_review = progData.needs_review;
      }
    } else {
      // Try to find a fuzzy match by normalized name
      const normalizedKey = normalizeForComparison(`${parsed.name}${parsed.city}`);
      if (existingMap.has(normalizedKey)) {
        const existing = existingMap.get(normalizedKey);
        // Copy coordinates from fuzzy match
        parsed.latitude = existing.latitude;
        parsed.longitude = existing.longitude;
        parsed.map_url = existing.map_url;
        parsed.needs_review = existing.needs_review;
      }

      // Check progress for this hotel
      if (progress.hotels[parsed.id]) {
        const progData = progress.hotels[parsed.id];
        parsed.latitude = progData.latitude;
        parsed.longitude = progData.longitude;
        parsed.needs_review = progData.needs_review;
      }

      mergedHotels.set(key, parsed);
    }
  });

  // Convert to array
  let allHotels = Array.from(mergedHotels.values());

  // Find hotels that need geocoding
  const needsGeocoding = allHotels.filter(h => !h.latitude && !progress.processedIds.includes(h.id));

  console.log(`Hotels needing geocoding: ${needsGeocoding.length}`);
  console.log(`\nStarting geocoding (this will take ~${Math.ceil(needsGeocoding.length / 60)} minutes)...`);
  console.log('Press Ctrl+C to stop - progress will be saved.\n');

  let geocoded = 0;
  let failed = 0;

  for (const hotel of needsGeocoding) {
    // Try geocoding with hotel name + city + country first
    const fullQuery = `${hotel.name}, ${hotel.city}, ${hotel.country}`;
    console.log(`[${geocoded + failed + 1}/${needsGeocoding.length}] Geocoding: ${hotel.name}`);

    let result = await geocodeAddress(fullQuery);

    // Fallback to city + country if full query fails
    if (!result) {
      const fallbackQuery = `${hotel.city}, ${hotel.country}`;
      console.log(`  Trying fallback: ${fallbackQuery}`);
      result = await geocodeAddress(fallbackQuery);

      if (result) {
        hotel.needs_review = true; // Mark for review since we only got city-level coords
      }
    }

    if (result) {
      hotel.latitude = result.latitude;
      hotel.longitude = result.longitude;
      hotel.map_url = `https://www.google.com/maps/search/?api=1&query=${result.latitude},${result.longitude}`;
      hotel.needs_review = hotel.needs_review || false;
      geocoded++;
      console.log(`  ✓ Found: ${result.latitude}, ${result.longitude}`);
    } else {
      hotel.needs_review = true;
      failed++;
      console.log(`  ✗ Not found`);
    }

    // Save to progress
    progress.processedIds.push(hotel.id);
    progress.hotels[hotel.id] = {
      latitude: hotel.latitude,
      longitude: hotel.longitude,
      needs_review: hotel.needs_review
    };

    // Save progress periodically
    if ((geocoded + failed) % 10 === 0) {
      saveProgress(progress);
      console.log(`  [Progress saved]`);
    }

    // Rate limit
    await sleep(RATE_LIMIT_MS);
  }

  // Final save
  saveProgress(progress);

  // Update all hotels with progress data
  allHotels = allHotels.map(h => {
    if (progress.hotels[h.id]) {
      const progData = progress.hotels[h.id];
      if (progData.latitude) {
        h.latitude = progData.latitude;
        h.longitude = progData.longitude;
        h.map_url = `https://www.google.com/maps/search/?api=1&query=${progData.latitude},${progData.longitude}`;
      }
      h.needs_review = progData.needs_review;
    }
    return h;
  });

  // Sort by country, then city, then name
  allHotels.sort((a, b) => {
    if (a.country !== b.country) return a.country.localeCompare(b.country);
    if (a.city !== b.city) return a.city.localeCompare(b.city);
    return a.name.localeCompare(b.name);
  });

  // Save final output
  saveOutput(allHotels);

  // Summary
  const withCoords = allHotels.filter(h => h.latitude).length;
  const needsReview = allHotels.filter(h => h.needs_review).length;

  console.log('\n=== Summary ===');
  console.log(`Total hotels: ${allHotels.length}`);
  console.log(`With coordinates: ${withCoords}`);
  console.log(`Needs review: ${needsReview}`);
  console.log(`Geocoded this run: ${geocoded}`);
  console.log(`Failed this run: ${failed}`);
  console.log(`\nOutput saved to: ${OUTPUT_FILE}`);
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n\nInterrupted - saving progress...');
  process.exit(0);
});

main().catch(console.error);
