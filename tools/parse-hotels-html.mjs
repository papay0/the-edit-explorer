/**
 * Parse hotels from HTML file
 * Run with: node tools/parse-hotels-html.mjs
 */

import { readFileSync, writeFileSync } from 'fs';

const html = readFileSync('./data/hotels.html', 'utf-8');

const hotels = [];
const seenHotels = new Set();

// Primary extraction: use the p tags which are more reliable
// <p class="sc-jlZhew kjlwVW">City, Country</p>
// <p class="sc-dLMFU QofYA">Hotel Name</p>

const locationRegex = /<p class="sc-jlZhew[^"]*">([^<]+)<\/p>/g;
const nameRegex = /<p class="sc-dLMFU[^"]*">([^<]+)<\/p>/g;

const locations = [];
const names = [];

let match;
while ((match = locationRegex.exec(html)) !== null) {
  locations.push(match[1].trim());
}

while ((match = nameRegex.exec(html)) !== null) {
  names.push(match[1].trim());
}

console.log(`Found ${locations.length} locations and ${names.length} hotel names`);

// Pair them up
for (let i = 0; i < Math.min(locations.length, names.length); i++) {
  const location = locations[i];
  let hotelName = names[i];

  // Decode HTML entities
  hotelName = hotelName
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

  const decodedLocation = location
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

  const locationParts = decodedLocation.split(', ');
  let city, country;

  if (locationParts.length >= 2) {
    city = locationParts[0].trim();
    country = locationParts.slice(1).join(', ').trim();
  } else {
    city = decodedLocation;
    country = decodedLocation;
  }

  const key = `${hotelName}|${city}|${country}`.toLowerCase();

  if (!seenHotels.has(key) && hotelName.length > 0) {
    seenHotels.add(key);
    hotels.push({
      name: hotelName,
      city: city || '',
      country: country || ''
    });
  }
}

// Generate IDs
function generateId(name, city) {
  const slug = `${name}-${city}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return slug.substring(0, 80);
}

// Extract brand from name
function extractBrand(name) {
  const brandPatterns = [
    'Four Seasons', 'Ritz-Carlton', 'St. Regis', 'Fairmont', 'Sofitel',
    'InterContinental', 'Kimpton', 'Andaz', 'Park Hyatt', 'Grand Hyatt',
    'Hyatt Regency', 'JW Marriott', 'Shangri-La', 'Mandarin Oriental',
    'Peninsula', 'Belmond', 'Rosewood', 'One&Only', 'Six Senses', 'Bulgari',
    'COMO', 'Raffles', 'Langham', 'Montage', 'Pendry', 'Thompson', 'Nobu',
    'W ', 'Ace Hotel', '1 Hotel', '21c Museum Hotel', 'Corinthia',
    'Radisson', 'Loews', 'Omni', 'Viceroy', 'Virgin Hotels', 'Waldorf Astoria',
    'Capella', 'Conrad', 'Kempinski', 'Oberoi', 'Taj', 'Banyan Tree',
    'Anantara', 'Regent', 'Rocco Forte'
  ];

  for (const pattern of brandPatterns) {
    if (name.includes(pattern)) {
      return pattern.replace('W ', 'W Hotels').trim();
    }
  }
  return undefined;
}

const processedHotels = hotels.map(h => ({
  id: generateId(h.name, h.city),
  name: h.name,
  brand: extractBrand(h.name),
  city: h.city,
  country: h.country,
  needs_review: true
}));

// Write output
const output = {
  meta: {
    parsed_at: new Date().toISOString(),
    source_file: 'data/hotels.html',
    total_hotels: processedHotels.length
  },
  hotels: processedHotels
};

writeFileSync('./data/parsed_hotels.json', JSON.stringify(output, null, 2));

console.log(`Parsed ${processedHotels.length} unique hotels from HTML`);
console.log(`Output written to data/parsed_hotels.json`);

// Show sample
console.log('\nSample hotels:');
processedHotels.slice(0, 10).forEach(h => {
  console.log(`  - ${h.name} (${h.city}, ${h.country})`);
});

// Show country distribution
const countryCount = {};
processedHotels.forEach(h => {
  countryCount[h.country] = (countryCount[h.country] || 0) + 1;
});

console.log(`\nHotels by country (top 10):`);
Object.entries(countryCount)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .forEach(([country, count]) => {
    console.log(`  ${country}: ${count}`);
  });
