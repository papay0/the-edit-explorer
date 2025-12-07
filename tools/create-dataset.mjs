/**
 * Create the full hotel dataset
 * Run with: node tools/create-dataset.mjs
 */

import { writeFileSync } from 'fs';

// City coordinates lookup
const cityCoordinates = {
  // Anguilla
  "Rendezvous Bay, Anguilla": { lat: 18.1735, lng: -63.0583 },
  "Maundays Bay, Anguilla": { lat: 18.1683, lng: -63.1528 },
  "West End Village, Anguilla": { lat: 18.2167, lng: -63.1500 },
  // Antigua & Barbuda
  "Saint Mary Parish, Antigua & Barbuda": { lat: 17.0608, lng: -61.7964 },
  "St. John's, Antigua & Barbuda": { lat: 17.1175, lng: -61.8456 },
  "St. Paul's, Antigua & Barbuda": { lat: 17.0478, lng: -61.7828 },
  // Argentina
  "Buenos Aires, Argentina": { lat: -34.6037, lng: -58.3816 },
  "Tunuyan - Uco Valley - Mendoza, Argentina": { lat: -33.5800, lng: -69.0167 },
  // Aruba
  "Palm Beach, Aruba": { lat: 12.5833, lng: -70.0500 },
  "Aruba": { lat: 12.5211, lng: -69.9683 },
  // Australia
  "Perth, Australia": { lat: -31.9505, lng: 115.8605 },
  "Sydney, Australia": { lat: -33.8688, lng: 151.2093 },
  "The Rocks, Australia": { lat: -33.8598, lng: 151.2090 },
  "Crafers, Australia": { lat: -34.9833, lng: 138.7167 },
  "Cairns, Australia": { lat: -16.9186, lng: 145.7781 },
  "Melbourne, Australia": { lat: -37.8136, lng: 144.9631 },
  "Melbourne, VIC, Australia": { lat: -37.8136, lng: 144.9631 },
  "Brisbane, Australia": { lat: -27.4698, lng: 153.0251 },
  // Austria
  "Wien, Austria": { lat: 48.2082, lng: 16.3738 },
  "Vienna, Austria": { lat: 48.2082, lng: 16.3738 },
  "Salzburg, Austria": { lat: 47.8095, lng: 13.0550 },
  "Zuers am Arlberg, Austria": { lat: 47.1697, lng: 10.1592 },
  // Azerbaijan
  "Baku, Azerbaijan": { lat: 40.4093, lng: 49.8671 },
  // Bahamas
  "Dunmore Town, Bahamas": { lat: 25.5017, lng: -76.6350 },
  "Nassau, Bahamas": { lat: 25.0343, lng: -77.3963 },
  "Paradise Island, Bahamas": { lat: 25.0867, lng: -77.3100 },
  // Bahrain
  "Manama, Bahrain": { lat: 26.2285, lng: 50.5860 },
  // Barbados
  "St. James, Barbados": { lat: 13.1939, lng: -59.6339 },
  // Belgium
  "Brussels, Belgium": { lat: 50.8503, lng: 4.3517 },
  // Belize
  "San Pedro Ambergris Caye, Belize": { lat: 17.9214, lng: -87.9611 },
  "Placencia, Belize": { lat: 16.5167, lng: -88.3667 },
  // Bermuda
  "Pembroke Parish, Bermuda": { lat: 32.2933, lng: -64.7833 },
  "Tuckers Town, Bermuda": { lat: 32.3333, lng: -64.7000 },
  // Botswana
  "Maun, Botswana": { lat: -19.9833, lng: 23.4167 },
  // Brazil
  "Rio de Janeiro, Brazil": { lat: -22.9068, lng: -43.1729 },
  "Foz do Iguaçu, Brazil": { lat: -25.5478, lng: -54.5882 },
  "São Paulo, Brazil": { lat: -23.5505, lng: -46.6333 },
  // Cambodia
  "Siem Reap, Cambodia": { lat: 13.3671, lng: 103.8448 },
  "Prey Nob, Cambodia": { lat: 10.5733, lng: 103.4925 },
  // Canada
  "Toronto, Canada": { lat: 43.6532, lng: -79.3832 },
  "Québec city, Canada": { lat: 46.8139, lng: -71.2080 },
  "Québec City, Canada": { lat: 46.8139, lng: -71.2080 },
  "Banff, Canada": { lat: 51.1784, lng: -115.5708 },
  "Lake Louise, Canada": { lat: 51.4254, lng: -116.1773 },
  "Ottawa, Canada": { lat: 45.4215, lng: -75.6972 },
  "Whistler, Canada": { lat: 50.1163, lng: -122.9574 },
  "Vancouver, Canada": { lat: 49.2827, lng: -123.1207 },
  "Jasper, Canada": { lat: 52.8737, lng: -118.0814 },
  "Montreal, Canada": { lat: 45.5017, lng: -73.5673 },
  "Joe Batt's Arm, Canada": { lat: 49.7167, lng: -54.1667 },
  "Halifax, Canada": { lat: 44.6488, lng: -63.5752 },
  // Cayman Islands
  "Cayman Islands": { lat: 19.3133, lng: -81.2546 },
  "Seven Mile Beach, Cayman Islands": { lat: 19.3500, lng: -81.3833 },
  "Grand Cayman, Cayman Islands": { lat: 19.3133, lng: -81.2546 },
  // Chile
  "Santiago, Chile": { lat: -33.4489, lng: -70.6693 },
  // China
  "Beijing, China": { lat: 39.9042, lng: 116.4074 },
  "Shanghai, China": { lat: 31.2304, lng: 121.4737 },
  "Hangzhou, China": { lat: 30.2741, lng: 120.1551 },
  "Shenzhen, China": { lat: 22.5431, lng: 114.0579 },
  "Suzhou, China": { lat: 31.2989, lng: 120.5853 },
  "Tianjin, China": { lat: 39.0842, lng: 117.2009 },
  "Xiangyang, China": { lat: 32.0090, lng: 112.1228 },
  "Jiuzhaigou, China": { lat: 33.2600, lng: 103.9200 },
  // Colombia
  "Cartagena, Colombia": { lat: 10.3910, lng: -75.4794 },
  "Cartagena de Indias, Colombia": { lat: 10.3910, lng: -75.4794 },
  "Bogotá, Colombia": { lat: 4.7110, lng: -74.0721 },
  "Bogota, Colombia": { lat: 4.7110, lng: -74.0721 },
  // Costa Rica
  "Nacascolo, Costa Rica": { lat: 10.6167, lng: -85.6500 },
  "Cóbano, Costa Rica": { lat: 9.6833, lng: -85.1000 },
  "Manuel Antonio, Costa Rica": { lat: 9.3914, lng: -84.1361 },
  "La Fortuna, Costa Rica": { lat: 10.4678, lng: -84.6428 },
  "Arenal, Costa Rica": { lat: 10.4625, lng: -84.7033 },
  "Cabo Velas, Costa Rica": { lat: 10.3667, lng: -85.8500 },
  // Croatia
  "Pula, Croatia": { lat: 44.8666, lng: 13.8496 },
  "Savudrija, Croatia": { lat: 45.4947, lng: 13.5025 },
  "Stari Grad, Croatia": { lat: 43.1833, lng: 16.6000 },
  "Split, Croatia": { lat: 43.5081, lng: 16.4402 },
  "Dubrovnik, Croatia": { lat: 42.6507, lng: 18.0944 },
  // Cyprus
  "Limassol, Cyprus": { lat: 34.6823, lng: 33.0464 },
  // Czechia
  "Prague, Czechia": { lat: 50.0755, lng: 14.4378 },
  // Denmark
  "Copenhagen, Denmark": { lat: 55.6761, lng: 12.5683 },
  // Dominica
  "Portsmouth, Dominica": { lat: 15.5750, lng: -61.4569 },
  // Dominican Republic
  "La Romana, Dominican Republic": { lat: 18.4273, lng: -68.9728 },
  "Cap Cana, Dominican Republic": { lat: 18.4500, lng: -68.4000 },
  "Santo Domingo, Dominican Republic": { lat: 18.4861, lng: -69.9312 },
  "Punta Cana, Dominican Republic": { lat: 18.5601, lng: -68.3725 },
  // Egypt
  "Alexandria, Egypt": { lat: 31.2001, lng: 29.9187 },
  "Cairo, Egypt": { lat: 30.0444, lng: 31.2357 },
  "Sharm El Sheikh, Egypt": { lat: 27.9158, lng: 34.3300 },
  // Fiji
  "Pacific Harbour, Fiji": { lat: -18.2000, lng: 178.0667 },
  "Malolo Island, Fiji": { lat: -17.7833, lng: 177.1833 },
  "Nadi, Fiji": { lat: -17.7765, lng: 177.4356 },
  // Finland
  "Helsinki, Finland": { lat: 60.1699, lng: 24.9384 },
  // France
  "Nice, France": { lat: 43.7102, lng: 7.2620 },
  "Paris, France": { lat: 48.8566, lng: 2.3522 },
  "Cannes, France": { lat: 43.5528, lng: 7.0174 },
  "Bordeaux, France": { lat: 44.8378, lng: -0.5792 },
  "Lyon, France": { lat: 45.7640, lng: 4.8357 },
  "Marseille, France": { lat: 43.2965, lng: 5.3698 },
  "Avignon, France": { lat: 43.9493, lng: 4.8055 },
  "Megeve, France": { lat: 45.8569, lng: 6.6175 },
  "Saint-Jean-Cap-Ferrat, France": { lat: 43.6833, lng: 7.3333 },
  "Aix-en-Provence, France": { lat: 43.5297, lng: 5.4474 },
  // French Polynesia
  "Bora Bora, French Polynesia": { lat: -16.5004, lng: -151.7415 },
  "Tahiti, French Polynesia": { lat: -17.6509, lng: -149.4260 },
  // Germany
  "Baden-Baden, Germany": { lat: 48.7606, lng: 8.2398 },
  "Hamburg, Germany": { lat: 53.5511, lng: 9.9937 },
  "Frankfurt, Germany": { lat: 50.1109, lng: 8.6821 },
  "Berlin, Germany": { lat: 52.5200, lng: 13.4050 },
  "Munich, Germany": { lat: 48.1351, lng: 11.5820 },
  // Greece
  "Athens, Greece": { lat: 37.9838, lng: 23.7275 },
  "Mykonos, Greece": { lat: 37.4467, lng: 25.3289 },
  "Santorini, Greece": { lat: 36.3932, lng: 25.4615 },
  "Heraklion, Greece": { lat: 35.3387, lng: 25.1442 },
  "Paros, Greece": { lat: 37.0853, lng: 25.1525 },
  // Hong Kong
  "Hong Kong": { lat: 22.3193, lng: 114.1694 },
  "Kowloon, Hong Kong": { lat: 22.3193, lng: 114.1694 },
  // Hungary
  "Budapest, Hungary": { lat: 47.4979, lng: 19.0402 },
  // Iceland
  "Reykjavik, Iceland": { lat: 64.1466, lng: -21.9426 },
  // India
  "Bengaluru, India": { lat: 12.9716, lng: 77.5946 },
  "Mumbai, India": { lat: 19.0760, lng: 72.8777 },
  "Jaipur, India": { lat: 26.9124, lng: 75.7873 },
  "Udaipur, India": { lat: 24.5854, lng: 73.7125 },
  "New Delhi, India": { lat: 28.6139, lng: 77.2090 },
  // Indonesia
  "Bali, Indonesia": { lat: -8.4095, lng: 115.1889 },
  "Jakarta, Indonesia": { lat: -6.2088, lng: 106.8456 },
  "Jimbaran, Indonesia": { lat: -8.7906, lng: 115.1591 },
  // Ireland
  "Dublin, Ireland": { lat: 53.3498, lng: -6.2603 },
  "Galway, Ireland": { lat: 53.2707, lng: -9.0568 },
  // Israel
  "Tel Aviv, Israel": { lat: 32.0853, lng: 34.7818 },
  "Jerusalem, Israel": { lat: 31.7683, lng: 35.2137 },
  // Italy
  "Rome, Italy": { lat: 41.9028, lng: 12.4964 },
  "Roma, Italy": { lat: 41.9028, lng: 12.4964 },
  "Venice, Italy": { lat: 45.4408, lng: 12.3155 },
  "Milan, Italy": { lat: 45.4642, lng: 9.1900 },
  "Milano, Italy": { lat: 45.4642, lng: 9.1900 },
  "Florence, Italy": { lat: 43.7696, lng: 11.2558 },
  "Firenze, Italy": { lat: 43.7696, lng: 11.2558 },
  "Amalfi, Italy": { lat: 40.6340, lng: 14.6027 },
  "Positano, Italy": { lat: 40.6280, lng: 14.4850 },
  "Capri, Italy": { lat: 40.5533, lng: 14.2222 },
  "Taormina, Italy": { lat: 37.8525, lng: 15.2866 },
  "Portofino, Italy": { lat: 44.3033, lng: 9.2100 },
  "Como, Italy": { lat: 45.8081, lng: 9.0852 },
  "Sorrento, Italy": { lat: 40.6263, lng: 14.3758 },
  // Jamaica
  "Montego Bay, Jamaica": { lat: 18.4762, lng: -77.8939 },
  // Japan
  "Tokyo, Japan": { lat: 35.6762, lng: 139.6503 },
  "Kyoto, Japan": { lat: 35.0116, lng: 135.7681 },
  "Osaka, Japan": { lat: 34.6937, lng: 135.5023 },
  "Nikko, Japan": { lat: 36.7198, lng: 139.6983 },
  "Hokkaido, Japan": { lat: 43.0646, lng: 141.3469 },
  // Jordan
  "Amman, Jordan": { lat: 31.9454, lng: 35.9284 },
  // Kuwait
  "Kuwait City, Kuwait": { lat: 29.3759, lng: 47.9774 },
  // Macao
  "Cotai, Macao": { lat: 22.1333, lng: 113.5500 },
  "Taipa, Macao": { lat: 22.1583, lng: 113.5583 },
  // Malaysia
  "Kuala Lumpur, Malaysia": { lat: 3.1390, lng: 101.6869 },
  "Langkawi, Malaysia": { lat: 6.3500, lng: 99.8000 },
  // Maldives
  "Male, Maldives": { lat: 4.1755, lng: 73.5093 },
  // Malta
  "Valletta, Malta": { lat: 35.8989, lng: 14.5146 },
  // Mauritius
  "Mauritius": { lat: -20.3484, lng: 57.5522 },
  // Mexico
  "Mexico City, Mexico": { lat: 19.4326, lng: -99.1332 },
  "Cancun, Mexico": { lat: 21.1619, lng: -86.8515 },
  "Playa del Carmen, Mexico": { lat: 20.6296, lng: -87.0739 },
  "Cabo San Lucas, Mexico": { lat: 22.8905, lng: -109.9167 },
  "San Jose del Cabo, Mexico": { lat: 23.0578, lng: -109.7006 },
  "Tulum, Mexico": { lat: 20.2118, lng: -87.4659 },
  "Puerto Vallarta, Mexico": { lat: 20.6534, lng: -105.2253 },
  // Monaco
  "Monaco": { lat: 43.7384, lng: 7.4246 },
  // Montenegro
  "Tivat, Montenegro": { lat: 42.4317, lng: 18.6961 },
  // Morocco
  "Marrakech, Morocco": { lat: 31.6295, lng: -7.9811 },
  "Casablanca, Morocco": { lat: 33.5731, lng: -7.5898 },
  "Rabat, Morocco": { lat: 34.0209, lng: -6.8416 },
  // Netherlands
  "Amsterdam, Netherlands": { lat: 52.3676, lng: 4.9041 },
  // New Zealand
  "Auckland, New Zealand": { lat: -36.8509, lng: 174.7645 },
  // Norway
  "Oslo, Norway": { lat: 59.9139, lng: 10.7522 },
  // Panama
  "Panamá, Panama": { lat: 8.9824, lng: -79.5199 },
  // Peru
  "Lima, Peru": { lat: -12.0464, lng: -77.0428 },
  "Cusco, Peru": { lat: -13.5319, lng: -71.9675 },
  // Philippines
  "Makati, Philippines": { lat: 14.5547, lng: 121.0244 },
  // Poland
  "Warsaw, Poland": { lat: 52.2297, lng: 21.0122 },
  // Portugal
  "Lisbon, Portugal": { lat: 38.7223, lng: -9.1393 },
  "Lisboa, Portugal": { lat: 38.7223, lng: -9.1393 },
  "Porto, Portugal": { lat: 41.1579, lng: -8.6291 },
  "Funchal, Portugal": { lat: 32.6669, lng: -16.9241 },
  // Puerto Rico
  "San Juan, Puerto Rico": { lat: 18.4655, lng: -66.1057 },
  "Dorado, Puerto Rico": { lat: 18.4589, lng: -66.2678 },
  // Qatar
  "Doha, Qatar": { lat: 25.2854, lng: 51.5310 },
  // Saudi Arabia
  "Riyadh, Saudi Arabia": { lat: 24.7136, lng: 46.6753 },
  // Seychelles
  "Mahé Island, Seychelles": { lat: -4.6833, lng: 55.4833 },
  // Singapore
  "Singapore": { lat: 1.3521, lng: 103.8198 },
  // South Africa
  "Cape Town, South Africa": { lat: -33.9249, lng: 18.4241 },
  // South Korea
  "Seoul, South Korea": { lat: 37.5665, lng: 126.9780 },
  // Sweden
  "Stockholm, Sweden": { lat: 59.3293, lng: 18.0686 },
  // Switzerland
  "Geneva, Switzerland": { lat: 46.2044, lng: 6.1432 },
  "Zurich, Switzerland": { lat: 47.3769, lng: 8.5417 },
  "Zürich, Switzerland": { lat: 47.3769, lng: 8.5417 },
  "St. Moritz, Switzerland": { lat: 46.4908, lng: 9.8355 },
  "Zermatt, Switzerland": { lat: 46.0207, lng: 7.7491 },
  "Gstaad, Switzerland": { lat: 46.4750, lng: 7.2861 },
  // Taiwan
  "Taipei City, Taiwan": { lat: 25.0330, lng: 121.5654 },
  // Thailand
  "Bangkok, Thailand": { lat: 13.7563, lng: 100.5018 },
  "Phuket, Thailand": { lat: 7.8804, lng: 98.3923 },
  "Koh Samui, Thailand": { lat: 9.5120, lng: 100.0136 },
  "Chiang Mai, Thailand": { lat: 18.7883, lng: 98.9853 },
  // Tunisia
  "Tunis, Tunisia": { lat: 36.8065, lng: 10.1815 },
  // Turkey
  "Istanbul, Türkiye": { lat: 41.0082, lng: 28.9784 },
  // Turks & Caicos Islands
  "Providenciales, Turks & Caicos Islands": { lat: 21.7741, lng: -72.2657 },
  // U.S. Virgin Islands
  "St. Thomas, U.S. Virgin Islands": { lat: 18.3358, lng: -64.8963 },
  // United Arab Emirates
  "Dubai, United Arab Emirates": { lat: 25.2048, lng: 55.2708 },
  "Abu Dhabi, United Arab Emirates": { lat: 24.4539, lng: 54.3773 },
  // United Kingdom
  "London, United Kingdom": { lat: 51.5074, lng: -0.1278 },
  "Edinburgh, United Kingdom": { lat: 55.9533, lng: -3.1883 },
  "Bath, United Kingdom": { lat: 51.3758, lng: -2.3599 },
  "Glasgow, United Kingdom": { lat: 55.8642, lng: -4.2518 },
  "Oxford, United Kingdom": { lat: 51.7520, lng: -1.2577 },
  // United States - Major Cities
  "New York": { lat: 40.7128, lng: -74.0060 },
  "Los Angeles, California": { lat: 34.0522, lng: -118.2437 },
  "Chicago, Illinois": { lat: 41.8781, lng: -87.6298 },
  "San Francisco, California": { lat: 37.7749, lng: -122.4194 },
  "Miami, Florida": { lat: 25.7617, lng: -80.1918 },
  "Miami Beach, Florida": { lat: 25.7907, lng: -80.1300 },
  "Las Vegas, Nevada": { lat: 36.1699, lng: -115.1398 },
  "Boston, Massachusetts": { lat: 42.3601, lng: -71.0589 },
  "Washington, District of Columbia": { lat: 38.9072, lng: -77.0369 },
  "Seattle, Washington": { lat: 47.6062, lng: -122.3321 },
  "Denver, Colorado": { lat: 39.7392, lng: -104.9903 },
  "Atlanta, Georgia": { lat: 33.7490, lng: -84.3880 },
  "Dallas, Texas": { lat: 32.7767, lng: -96.7970 },
  "Houston, Texas": { lat: 29.7604, lng: -95.3698 },
  "Austin, Texas": { lat: 30.2672, lng: -97.7431 },
  "Nashville, Tennessee": { lat: 36.1627, lng: -86.7816 },
  "New Orleans, Louisiana": { lat: 29.9511, lng: -90.0715 },
  "Philadelphia, Pennsylvania": { lat: 39.9526, lng: -75.1652 },
  "San Diego, California": { lat: 32.7157, lng: -117.1611 },
  "Phoenix, Arizona": { lat: 33.4484, lng: -112.0740 },
  "Scottsdale, Arizona": { lat: 33.4942, lng: -111.9261 },
  "Honolulu, Hawaii": { lat: 21.3069, lng: -157.8583 },
  "Beverly Hills, California": { lat: 34.0736, lng: -118.4004 },
  "Santa Monica, California": { lat: 34.0195, lng: -118.4912 },
  "Palm Springs, California": { lat: 33.8303, lng: -116.5453 },
  "Napa, California": { lat: 38.2975, lng: -122.2869 },
  "Aspen, Colorado": { lat: 39.1911, lng: -106.8175 },
  "Vail, Colorado": { lat: 39.6403, lng: -106.3742 },
  "Park City, Utah": { lat: 40.6461, lng: -111.4980 },
  "Charleston, South Carolina": { lat: 32.7765, lng: -79.9311 },
  "Savannah, Georgia": { lat: 32.0809, lng: -81.0912 },
  "Key West, Florida": { lat: 24.5551, lng: -81.7800 },
  "Orlando, Florida": { lat: 28.5383, lng: -81.3792 },
  "Fort Lauderdale, Florida": { lat: 26.1224, lng: -80.1373 },
  "Palm Beach, Florida": { lat: 26.7056, lng: -80.0364 },
  "Sedona, Arizona": { lat: 34.8697, lng: -111.7610 },
  "Big Sur, California": { lat: 36.2704, lng: -121.8075 },
  "Santa Barbara, California": { lat: 34.4208, lng: -119.6982 },
  "Brooklyn, New York": { lat: 40.6782, lng: -73.9442 },
  "Newport, Rhode Island": { lat: 41.4901, lng: -71.3128 },
  "Minneapolis, Minnesota": { lat: 44.9778, lng: -93.2650 },
  "Portland, Oregon": { lat: 45.5051, lng: -122.6750 },
  "Detroit, Michigan": { lat: 42.3314, lng: -83.0458 },
  "Cleveland, Ohio": { lat: 41.4993, lng: -81.6944 },
  "Baltimore, Maryland": { lat: 39.2904, lng: -76.6122 },
  "St. Louis, Missouri": { lat: 38.6270, lng: -90.1994 },
  "Kansas City, Missouri": { lat: 39.0997, lng: -94.5786 },
  "Columbus, Ohio": { lat: 39.9612, lng: -82.9988 },
  "Wailea, Hawaii": { lat: 20.6875, lng: -156.4419 },
  "Kihei, Hawaii": { lat: 20.7644, lng: -156.4450 },
  "Lahaina, Hawaii": { lat: 20.8783, lng: -156.6825 },
  "Kapolei, Hawaii": { lat: 21.3358, lng: -158.0589 },
  "Lanai City, Hawaii": { lat: 20.8275, lng: -156.9197 },
  "Princeville, Hawaii": { lat: 22.2197, lng: -159.4822 },
  "Koloa, Hawaii": { lat: 21.9064, lng: -159.4700 },
  // Vietnam
  "Hanoi, Vietnam": { lat: 21.0278, lng: 105.8342 },
  "Hoi An, Vietnam": { lat: 15.8801, lng: 108.3380 },
};

// All hotels from AwardTravel
const rawHotels = [
  "Aurora Anguilla Resort & Golf Club - Rendezvous Bay, Anguilla",
  "Cap Juluca, A Belmond Hotel - Maundays Bay, Anguilla",
  "Four Seasons Resort and Residences Anguilla - West End Village, Anguilla",
  "Malliouhana Resort Anguilla - West End Village, Anguilla",
  "Carlisle Bay - Saint Mary Parish, Antigua & Barbuda",
  "Jumby Bay Island, Oetker Hotels - St. John's, Antigua & Barbuda",
  "The Inn at English Harbour - St. Paul's, Antigua & Barbuda",
  "Faena Hotel Buenos Aires - Buenos Aires, Argentina",
  "Four Seasons Hotel Buenos Aires - Buenos Aires, Argentina",
  "Palacio Duhau - Park Hyatt Buenos Aires - Buenos Aires, Argentina",
  "The Vines Resort & Spa - Tunuyan - Uco Valley - Mendoza, Argentina",
  "Hyatt Regency Aruba Resort Spa & Casino - Palm Beach, Aruba",
  "The Ritz-Carlton, Aruba - Aruba",
  "COMO The Treasury - Perth, Australia",
  "Four Seasons Hotel Sydney - Sydney, Australia",
  "InterContinental Sydney by IHG - Sydney, Australia",
  "Kimpton Margot Sydney by IHG - Sydney, Australia",
  "Mount Lofty House & Estate Adelaide Hills - Crafers, Australia",
  "Shangri-La Sydney - The Rocks, Australia",
  "Shangri-La The Marina, Cairns - Cairns, Australia",
  "Sofitel Melbourne On Collins - Melbourne, Australia",
  "The Langham, Melbourne - Melbourne, Australia",
  "The Langham, Sydney - Sydney, Australia",
  "The Ritz-Carlton, Perth - Perth, Australia",
  "W Brisbane - Brisbane, Australia",
  "W Melbourne - Melbourne, VIC, Australia",
  "Four Seasons Hotel Baku - Baku, Azerbaijan",
  "Pink Sands Resort - Dunmore Town, Bahamas",
  "SLS Baha Mar - Nassau, Bahamas",
  "The Cove at Atlantis - Paradise Island, Bahamas",
  "The Ocean Club, Bahamas - A Four Seasons Resort - Paradise Island, Bahamas",
  "The Reef at Atlantis - Paradise Island, Bahamas",
  "Four Seasons Hotel Bahrain Bay - Manama, Bahrain",
  "Fairmont Royal Pavilion - St. James, Barbados",
  "Sofitel Brussels Europe - Brussels, Belgium",
  "Alaia Belize, Autograph Collection - San Pedro Ambergris Caye, Belize",
  "Itz'ana Resort & Residences, Placencia - Placencia, Belize",
  "Hamilton Princess & Beach Club - a Fairmont Managed Hotel - Pembroke Parish, Bermuda",
  "The Loren at Pink Beach - Tuckers Town, Bermuda",
  "Copacabana Palace, A Belmond Hotel, Rio de Janeiro - Rio de Janeiro, Brazil",
  "Fairmont Rio de Janeiro Copacabana - Rio de Janeiro, Brazil",
  "Hotel das Cataratas, A Belmond Hotel, Iguassu Falls - Foz do Iguaçu, Brazil",
  "InterContinental São Paulo by IHG - São Paulo, Brazil",
  "Raffles Grand Hotel d'Angkor - Siem Reap, Cambodia",
  "1 Hotel Toronto - Toronto, Canada",
  "Fairmont Banff Springs - Banff, Canada",
  "Fairmont Chateau Lake Louise - Lake Louise, Canada",
  "Fairmont Chateau Laurier - Ottawa, Canada",
  "Fairmont Chateau Whistler - Whistler, Canada",
  "Fairmont Hotel Vancouver - Vancouver, Canada",
  "Fairmont Jasper Park Lodge - Jasper, Canada",
  "Fairmont Le Chateau Frontenac - Québec City, Canada",
  "Fairmont Pacific Rim - Vancouver, Canada",
  "Four Seasons Hotel Montreal - Montreal, Canada",
  "Four Seasons Hotel Toronto - Toronto, Canada",
  "Four Seasons Resort Whistler - Whistler, Canada",
  "Park Hyatt Toronto - Toronto, Canada",
  "Shangri-La Vancouver - Vancouver, Canada",
  "The Ritz-Carlton, Montreal - Montreal, Canada",
  "The Ritz-Carlton, Toronto - Toronto, Canada",
  "Kimpton Seafire Resort + Spa by IHG - Seven Mile Beach, Cayman Islands",
  "The Ritz-Carlton, Grand Cayman - Grand Cayman, Cayman Islands",
  "The Ritz-Carlton, Santiago - Santiago, Chile",
  "Bulgari Hotel Beijing - Beijing, China",
  "Bulgari Hotel Shanghai - Shanghai, China",
  "Four Seasons Hotel Beijing - Beijing, China",
  "Four Seasons Hotel Shanghai - Shanghai, China",
  "Four Seasons Hotel Shenzhen - Shenzhen, China",
  "The Peninsula Beijing - Beijing, China",
  "The Peninsula Shanghai - Shanghai, China",
  "Four Seasons Hotel Bogota - Bogotá, Colombia",
  "InterContinental Cartagena De Indias by IHG - Cartagena, Colombia",
  "Sofitel Legend Santa Clara Cartagena - Cartagena, Colombia",
  "Four Seasons Resort Peninsula Papagayo, Costa Rica - Nacascolo, Costa Rica",
  "Nayara Gardens - La Fortuna, Costa Rica",
  "Nayara Springs - Adults only - La Fortuna, Costa Rica",
  "Tabacon Thermal Resort & Spa - Arenal, Costa Rica",
  "W Costa Rica - Reserva Conchal - Cabo Velas, Costa Rica",
  "Sun Gardens Dubrovnik - Dubrovnik, Croatia",
  "Villa Dubrovnik - Dubrovnik, Croatia",
  "Four Seasons Hotel Prague - Prague, Czechia",
  "Nimb Hotel - Copenhagen, Denmark",
  "Casa de Campo Resort & Villas - La Romana, Dominican Republic",
  "Four Seasons Hotel Cairo at Nile Plaza - Cairo, Egypt",
  "Four Seasons Resort Sharm EL Sheikh - Sharm El Sheikh, Egypt",
  "Nanuku Resort, Fiji - Pacific Harbour, Fiji",
  "Six Senses Fiji - Malolo Island, Fiji",
  "Bulgari Hotel Paris - Paris, France",
  "Cheval Blanc Paris - Paris, France",
  "Four Seasons Hotel George V - Paris, France",
  "Four Seasons Hotel Megeve - Megeve, France",
  "Grand-Hôtel du Cap-Ferrat, A Four Seasons Hotel - Saint-Jean-Cap-Ferrat, France",
  "Hôtel Plaza Athénée - Dorchester Collection - Paris, France",
  "InterContinental Paris le Grand by IHG - Paris, France",
  "La Reserve Paris- Hotel and Spa - Paris, France",
  "Le Bristol Paris, Oetker Hotels - Paris, France",
  "Le Meurice - Dorchester Collection - Paris, France",
  "Park Hyatt Paris Vendome - Paris, France",
  "Ritz Paris - Paris, France",
  "Shangri-La Paris - Paris, France",
  "The Peninsula Paris - Paris, France",
  "Four Seasons Resort Bora Bora - Bora Bora, French Polynesia",
  "The Brando - Tahiti, French Polynesia",
  "The St. Regis Bora Bora Resort - Bora Bora, French Polynesia",
  "Rocco Forte Hotel De Rome Berlin - Berlin, Germany",
  "The Ritz-Carlton, Berlin - Berlin, Germany",
  "Four Seasons Astir Palace Hotel Athens - Athens, Greece",
  "Hotel Grande Bretagne, a Luxury Collection Hotel, Athens - Athens, Greece",
  "Canaves Oia Suites - Santorini, Greece",
  "Katikies Santorini - Santorini, Greece",
  "Mystique, a Luxury Collection Hotel, Santorini - Santorini, Greece",
  "Bill & Coo Mykonos - Mykonos, Greece",
  "Mykonos Grand Hotel & Resort - Mykonos, Greece",
  "Four Seasons Hotel Hong Kong - Hong Kong",
  "The Peninsula Hong Kong - Kowloon, Hong Kong",
  "The Upper House - Hong Kong",
  "Four Seasons Gresham Palace - Budapest, Hungary",
  "Four Seasons Hotel Bengaluru at Embassy One - Bengaluru, India",
  "Four Seasons Hotel Mumbai - Mumbai, India",
  "Taj Mahal, New Delhi - New Delhi, India",
  "The Oberoi, New Delhi - New Delhi, India",
  "The Taj Mahal Palace Mumbai - Mumbai, India",
  "Four Seasons Resort Bali at Jimbaran Bay - Jimbaran, Indonesia",
  "Four Seasons Resort Bali At Sayan - Bali, Indonesia",
  "Mandapa, a Ritz-Carlton Reserve - Ubud, Bali, Indonesia",
  "Six Senses Uluwatu - Pecatu, Indonesia",
  "Ashford Castle - Mayo, Ireland",
  "InterContinental Dublin by IHG - Dublin, Ireland",
  "The Merrion Hotel - Dublin, Ireland",
  "King David, Jerusalem - Jerusalem, Israel",
  "The Jaffa, a Luxury Collection Hotel, Tel Aviv - Tel Aviv, Israel",
  "Bulgari Hotel Milano - Milan, Italy",
  "Bulgari Hotel Roma - Rome, Italy",
  "Caruso, A Belmond Hotel, Amalfi Coast - Ravello, Italy",
  "Four Seasons Hotel Firenze - Firenze, Italy",
  "Four Seasons Hotel Milano - Milan, Italy",
  "Grand Hotel Tremezzo, Lake Como - Tremezzina, Italy",
  "Hotel Cipriani, A Belmond Hotel, Venice - Venice, Italy",
  "Hotel Eden - Dorchester Collection - Rome, Italy",
  "Park Hyatt Milan - Milan, Italy",
  "Portrait Roma - Lungarno Collection - Rome, Italy",
  "Rocco Forte Hotel De Russie - Rome, Italy",
  "Santa Caterina - Amalfi, Italy",
  "Six Senses Rome - Rome, Italy",
  "Splendido, A Belmond Hotel, Portofino - Portofino, Italy",
  "The Gritti Palace, a Luxury Collection Hotel, Venice - Venice, Italy",
  "The St. Regis Florence - Florence, Italy",
  "The St. Regis Rome - Rome, Italy",
  "The St. Regis Venice - Venice, Italy",
  "Villa d'Este - Cernobbio, Italy",
  "Round Hill Hotel & Villas - Montego Bay, Jamaica",
  "Andaz Tokyo Toranomon Hills - Tokyo, Japan",
  "Bulgari Hotel Tokyo - Tokyo, Japan",
  "Four Seasons Hotel Kyoto - Kyoto, Japan",
  "Four Seasons Hotel Tokyo at Otemachi - Tokyo, Japan",
  "Palace Hotel Tokyo - Tokyo, Japan",
  "Park Hyatt Tokyo - Tokyo, Japan",
  "The Peninsula Tokyo - Tokyo, Japan",
  "The Ritz-Carlton, Kyoto - Kyoto, Japan",
  "The Ritz-Carlton, Tokyo - Tokyo, Japan",
  "Four Seasons Hotel Amman - Amman, Jordan",
  "Four Seasons Hotel Kuwait at Burj Alshaya - Kuwait City, Kuwait",
  "Four Seasons Hotel Macao - Cotai, Macao",
  "Four Seasons Hotel Kuala Lumpur - Kuala Lumpur, Malaysia",
  "Four Seasons Resort Langkawi - Langkawi, Malaysia",
  "Four Seasons Resort Maldives at Kuda Huraa - Male, Maldives",
  "One&Only Reethi Rah - Male, Maldives",
  "Soneva Fushi - Male, Maldives",
  "Four Seasons Resort Mauritius at Anahita - Mauritius",
  "One&Only Le Saint Geran - Mauritius",
  "Andaz Condesa Mexico City - Mexico City, Mexico",
  "Banyan Tree Mayakoba - Playa del Carmen, Mexico",
  "Four Seasons Hotel Mexico City - Mexico City, Mexico",
  "Four Seasons Resort Los Cabos at Costa Palmas - Cabo San Lucas, Mexico",
  "Four Seasons Resort Punta Mita - Punta de Mita, Mexico",
  "Grand Velas Riviera Maya - All Inclusive - Playa del Carmen, Mexico",
  "Montage Los Cabos - Cabo San Lucas, Mexico",
  "NIZUC Resort & Spa - Cancun, Mexico",
  "One&Only Palmilla - San Jose del Cabo, Mexico",
  "The Ritz-Carlton, Mexico City - Mexico City, Mexico",
  "The St. Regis Mexico City - Mexico City, Mexico",
  "Zadún, a Ritz-Carlton Reserve - San Jose del Cabo, Mexico",
  "Fairmont Monte Carlo - Monaco",
  "Hotel de Paris Monte-Carlo - Monaco",
  "Four Seasons Hotel Casablanca - Casablanca, Morocco",
  "Four Seasons Resort Marrakech - Marrakech, Morocco",
  "Royal Mansour Marrakech - Marrakech, Morocco",
  "Conservatorium Hotel - Amsterdam, Netherlands",
  "De L'Europe Amsterdam - Leading Hotels of the World - Amsterdam, Netherlands",
  "Park Hyatt Auckland - Auckland, New Zealand",
  "Sommerro - Oslo, Norway",
  "Miraflores Park, A Belmond Hotel, Lima - Lima, Peru",
  "Monasterio, A Belmond Hotel, Cusco - Cusco, Peru",
  "Nobu Hotel Warsaw - Warsaw, Poland",
  "Raffles Europejski Warsaw - Warsaw, Poland",
  "Four Seasons Hotel Ritz Lisbon - Lisbon, Portugal",
  "Six Senses Douro Valley - Samodães, Lamego, Portugal",
  "Dorado Beach, a Ritz-Carlton Reserve - Dorado, Puerto Rico",
  "The St. Regis Bahia Beach Resort, Puerto Rico - Rio Grande, Puerto Rico",
  "Four Seasons Hotel Doha - Doha, Qatar",
  "Four Seasons Hotel Riyadh - Riyadh, Saudi Arabia",
  "Four Seasons Resort Seychelles - Mahé Island, Seychelles",
  "Six Senses Zil Pasyon Seychelles - Felicite Island, Seychelles",
  "Capella Singapore - Sentosa Island, Singapore",
  "Four Seasons Hotel Singapore - Singapore",
  "Raffles Singapore - Singapore",
  "The Fullerton Bay Hotel Singapore - Singapore",
  "Cape Grace, A Fairmont Managed Hotel - Cape Town, South Africa",
  "One&Only Cape Town - Cape Town, South Africa",
  "Four Seasons Hotel Seoul - Seoul, South Korea",
  "Park Hyatt Seoul - Seoul, South Korea",
  "Grand Hôtel Stockholm - Stockholm, Sweden",
  "Carlton Hotel St. Moritz - St. Moritz, Switzerland",
  "Four Seasons Hotel des Bergues Geneva - Geneva, Switzerland",
  "The Dolder Grand - Zurich, Switzerland",
  "Capella Bangkok - Bangkok, Thailand",
  "Four Seasons Hotel Bangkok at Chao Phraya River - Bangkok, Thailand",
  "Four Seasons Resort Koh Samui - Koh Samui, Thailand",
  "The Ritz-Carlton, Bangkok - Bangkok, Thailand",
  "The St. Regis Bangkok - Bangkok, Thailand",
  "Four Seasons Hotel Istanbul at the Bosphorus - Istanbul, Türkiye",
  "Raffles Istanbul - Istanbul, Türkiye",
  "The Peninsula Istanbul - Istanbul, Türkiye",
  "COMO Parrot Cay - Parrot Cay, Turks & Caicos Islands",
  "Grace Bay Club - Providenciales, Turks & Caicos Islands",
  "The Ritz-Carlton, Turks & Caicos - Providenciales, Turks & Caicos Islands",
  "The Ritz-Carlton, St. Thomas - St. Thomas, U.S. Virgin Islands",
  "Atlantis The Royal - Dubai, United Arab Emirates",
  "Bulgari Resort Dubai - Dubai, United Arab Emirates",
  "Burj Al Arab Jumeirah - Dubai, United Arab Emirates",
  "Four Seasons Hotel Abu Dhabi at Al Maryah Island - Abu Dhabi, United Arab Emirates",
  "Four Seasons Resort Dubai at Jumeirah Beach - Dubai, United Arab Emirates",
  "One&Only The Palm - Dubai, United Arab Emirates",
  "The Ritz-Carlton, Dubai - Dubai, United Arab Emirates",
  "1 Hotel Mayfair - London, United Kingdom",
  "45 Park Lane - Dorchester Collection - London, United Kingdom",
  "Brown's Hotel, a Rocco Forte hotel - London, United Kingdom",
  "Bulgari Hotel London - London, United Kingdom",
  "Claridge's - London, United Kingdom",
  "Corinthia London - London, United Kingdom",
  "Four Seasons Hotel London at Park Lane - London, United Kingdom",
  "Four Seasons Hotel London at Tower Bridge - London, United Kingdom",
  "Raffles London at The OWO - London, United Kingdom",
  "Shangri-La The Shard, London - London, United Kingdom",
  "The Berkeley - London, United Kingdom",
  "The Connaught - Mayfair, United Kingdom",
  "The Dorchester - London, United Kingdom",
  "The Lanesborough, Oetker Hotels - London, United Kingdom",
  "The Langham, London - London, United Kingdom",
  "The Peninsula London - London, United Kingdom",
  "The Savoy, A Fairmont Managed Hotel - London, United Kingdom",
  "The Balmoral Hotel - Edinburgh, United Kingdom",
  "The Gleneagles Hotel - Perthshire, United Kingdom",
  // United States - Major hotels
  "1 Hotel Brooklyn Bridge - Brooklyn, New York",
  "1 Hotel Nashville - Nashville, Tennessee",
  "1 Hotel San Francisco - San Francisco, California",
  "1 Hotel South Beach - Miami Beach, Florida",
  "1 Hotel West Hollywood - West Hollywood, California",
  "Acqualina Resort & Residences - Sunny Isles, Florida",
  "Alila Ventana Big Sur, a Hyatt Luxury Resort - Big Sur, California",
  "Andaz Maui at Wailea Resort - Wailea, Hawaii",
  "Andaz Scottsdale Resort & Bungalows - Scottsdale, Arizona",
  "ARIA Resort & Casino - Las Vegas, Nevada",
  "Auberge Du Soleil - St. Helena, California",
  "Baccarat Hotel New York - New York",
  "Bellagio Hotel and Casino - Las Vegas, Nevada",
  "Beverly Wilshire - Beverly Hills, A Four Seasons Hotel - Beverly Hills, California",
  "Boston Harbor Hotel - Boston, Massachusetts",
  "Carneros Resort and Spa - Napa, California",
  "Cavallo Point - Sausalito, California",
  "Chicago Athletic Association, a Hyatt Hotel - Chicago, Illinois",
  "Enchantment Resort - Sedona, Arizona",
  "Faena Hotel Miami Beach - Miami Beach, Florida",
  "Fairmont Copley Plaza, Boston - Boston, Massachusetts",
  "Fairmont Grand Del Mar - San Diego, California",
  "Fairmont Kea Lani - Wailea, Hawaii",
  "Fairmont San Francisco - San Francisco, California",
  "Fairmont Scottsdale Princess - Scottsdale, Arizona",
  "Fontainebleau Miami Beach - Miami Beach, Florida",
  "Four Seasons Hotel Atlanta - Atlanta, Georgia",
  "Four Seasons Hotel Austin - Austin, Texas",
  "Four Seasons Hotel Boston - Boston, Massachusetts",
  "Four Seasons Hotel Chicago - Chicago, Illinois",
  "Four Seasons Hotel Denver - Denver, Colorado",
  "Four Seasons Hotel Houston - Houston, Texas",
  "Four Seasons Hotel Las Vegas - Las Vegas, Nevada",
  "Four Seasons Hotel Los Angeles at Beverly Hills - Los Angeles, California",
  "Four Seasons Hotel Miami - Miami, Florida",
  "Four Seasons Hotel Minneapolis - Minneapolis, Minnesota",
  "Four Seasons Hotel New Orleans - New Orleans, Louisiana",
  "Four Seasons Hotel New York - New York",
  "Four Seasons Hotel New York Downtown - New York",
  "Four Seasons Hotel One Dalton Street, Boston - Boston, Massachusetts",
  "Four Seasons Hotel Philadelphia at Comcast Center - Philadelphia, Pennsylvania",
  "Four Seasons Hotel San Francisco - San Francisco, California",
  "Four Seasons Hotel Seattle - Seattle, Washington",
  "Four Seasons Hotel Washington DC - Washington, District of Columbia",
  "Four Seasons Nashville - Nashville, Tennessee",
  "Four Seasons Resort and Residences Napa Valley - Calistoga, California",
  "Four Seasons Resort Hualalai - Kailua-Kona, Hawaii",
  "Four Seasons Resort Jackson Hole - Teton Village, Wyoming",
  "Four Seasons Resort Lanai - Lanai City, Hawaii",
  "Four Seasons Resort Maui at Wailea - Kihei, Hawaii",
  "Four Seasons Resort Oahu at Ko Olina - Kapolei, Hawaii",
  "Four Seasons Resort Orlando at WALT DISNEY WORLD® Resort - Lake Buena Vista, Florida",
  "Four Seasons Resort Palm Beach - Palm Beach, Florida",
  "Four Seasons Resort Scottsdale at Troon North - Scottsdale, Arizona",
  "Four Seasons Resort Vail - Vail, Colorado",
  "Grand Hyatt Vail - Vail, Colorado",
  "Hotel Bel-Air - Dorchester Collection - Los Angeles, California",
  "Hotel Casa del Mar - Santa Monica, California",
  "JW Marriott Essex House New York - New York",
  "L'Ermitage Beverly Hills - Beverly Hills, California",
  "Little Palm Island Resort & Spa - Little Torch Key, Florida",
  "Loews Miami Beach Hotel - Miami Beach, Florida",
  "Lotte New York Palace - New York",
  "Malibu Beach Inn Hotel & Spa - Malibu, California",
  "Montage Big Sky - Big Sky, Montana",
  "Montage Deer Valley - Park City, Utah",
  "Montage Healdsburg - Healdsburg, California",
  "Montage Kapalua Bay - Lahaina, Hawaii",
  "Montage Laguna Beach - Laguna Beach, California",
  "Montage Palmetto Bluff - Bluffton, South Carolina",
  "Nobu Hotel Chicago - Chicago, Illinois",
  "Nobu Hotel Miami Beach - Miami Beach, Florida",
  "Ojai Valley Inn - Ojai, California",
  "Omni Boston Hotel at the Seaport - Boston, Massachusetts",
  "Park Hyatt Chicago - Chicago, Illinois",
  "Park Hyatt New York - New York",
  "Park Hyatt Washington DC - District of Columbia",
  "Pendry Manhattan West - New York",
  "Pendry Newport Beach - Newport Beach, California",
  "Pendry Park City - Park City, Utah",
  "Pendry San Diego - San Diego, California",
  "Post Ranch Inn - Big Sur, California",
  "Raffles Boston - Boston, Massachusetts",
  "Rancho Valencia Resort and Spa - Rancho Santa Fe, California",
  "Regent Santa Monica Beach - Santa Monica, California",
  "Rosewood Miramar Beach - Montecito, California",
  "San Ysidro Ranch - Santa Barbara, California",
  "Shutters on the Beach - Santa Monica, California",
  "SLS Hotel, a Luxury Collection Hotel, Beverly Hills - Los Angeles, California",
  "Taj Campton Place - San Francisco, California",
  "The Boca Raton - Boca Raton, Florida",
  "The Breakers - Palm Beach, Florida",
  "The Chatwal, In The Unbound Collection By Hyatt - New York City, New York",
  "The Cosmopolitan Las Vegas - Las Vegas, Nevada",
  "The Hay-Adams - Washington, District of Columbia",
  "The Jefferson - Washington, District of Columbia",
  "The Joule - Dallas, Texas",
  "The Kahala Hotel & Resort - Honolulu, Hawaii",
  "The Langham, Boston - Boston, Massachusetts",
  "The Langham, Chicago - Chicago, Illinois",
  "The Langham, New York - New York",
  "The Little Nell - Aspen, Colorado",
  "The Lowell Hotel - New York",
  "The Mark - New York",
  "The Maybourne Beverly Hills, Maybourne - Beverly Hills, California",
  "The Miami Beach EDITION - Miami Beach, Florida",
  "The New York EDITION - New York",
  "The Newbury Boston - Boston, Massachusetts",
  "The Peninsula Beverly Hills - Beverly Hills, California",
  "The Peninsula Chicago - Chicago, Illinois",
  "The Peninsula New York - New York City, New York",
  "The Phoenician, a Luxury Collection Resort, Scottsdale - Scottsdale, Arizona",
  "The Pierre, A Taj Hotel - New York",
  "The Plaza, a Fairmont Managed Hotel - New York",
  "The Resort at Pelican Hill - Newport Coast, California",
  "The Ritz-Carlton Bacara, Santa Barbara - Goleta, California",
  "The Ritz-Carlton Bal Harbour, Miami - Bal Harbour, Florida",
  "The Ritz-Carlton Key Biscayne, Miami - Miami, Florida",
  "The Ritz-Carlton Maui, Kapalua - Kapalua, Hawaii",
  "The Ritz-Carlton New York, Central Park - New York",
  "The Ritz-Carlton New York, NoMad - New York",
  "The Ritz-Carlton O'ahu, Turtle Bay - Kahuku, Hawaii",
  "The Ritz-Carlton Orlando, Grande Lakes - Orlando, Florida",
  "The Ritz-Carlton, Atlanta - Atlanta, Georgia",
  "The Ritz-Carlton, Bachelor Gulch - Avon, Colorado",
  "The Ritz-Carlton, Boston - Boston, Massachusetts",
  "The Ritz-Carlton, Chicago - Chicago, Illinois",
  "The Ritz-Carlton, Dallas - Dallas, Texas",
  "The Ritz-Carlton, Denver - Denver, Colorado",
  "The Ritz-Carlton, Fort Lauderdale - Fort Lauderdale, Florida",
  "The Ritz-Carlton, Half Moon Bay - Half Moon Bay, California",
  "The Ritz-Carlton, Laguna Niguel - Dana Point, California",
  "The Ritz-Carlton, Lake Tahoe - Truckee, California",
  "The Ritz-Carlton, Los Angeles - Los Angeles, California",
  "The Ritz-Carlton, Naples - Naples, Florida",
  "The Ritz-Carlton, New Orleans - New Orleans, Louisiana",
  "The Ritz-Carlton, Philadelphia - Philadelphia, Pennsylvania",
  "The Ritz-Carlton, San Francisco - San Francisco, California",
  "The Ritz-Carlton, South Beach - Miami Beach, Florida",
  "The Ritz-Carlton, Washington, D.C. - Washington, District of Columbia",
  "The Setai, Miami Beach - Miami Beach, Florida",
  "The St. Regis Aspen Resort - Aspen, Colorado",
  "The St. Regis Atlanta - Atlanta, Georgia",
  "The St. Regis Bal Harbour Resort - Bal Harbour, Florida",
  "The St. Regis Chicago - Chicago, Illinois",
  "The St. Regis Deer Valley - Park City, Utah",
  "The St. Regis Houston - Houston, Texas",
  "The St. Regis New York - New York",
  "The St. Regis San Francisco - San Francisco, California",
  "The St. Regis Washington, D.C. - Washington, District of Columbia",
  "The Surrey, A Corinthia Hotel - New York",
  "The Tampa EDITION - Tampa, Florida",
  "Thompson Austin, Part Of Hyatt - Austin, Texas",
  "Thompson Central Park New York, Part Of Hyatt - New York",
  "Thompson Dallas - Dallas, Texas",
  "Thompson Denver - Denver, Colorado",
  "Thompson Houston, by Hyatt - Houston, Texas",
  "Thompson Nashville, by Hyatt - Nashville, Tennessee",
  "Thompson Seattle - Seattle, Washington",
  "Twin Farms - Barnard, Vermont",
  "Viceroy Chicago - Chicago, Illinois",
  "W Aspen - Aspen, Colorado",
  "W Austin - Austin, Texas",
  "W Fort Lauderdale - Fort Lauderdale, Florida",
  "W South Beach - Miami Beach, Florida",
  "Waldorf Astoria Beverly Hills - Beverly Hills, California",
  "Waldorf Astoria Las Vegas - Las Vegas, Nevada",
  "The Lodge at Torrey Pines - La Jolla, California",
  "The Charleston Place - Charleston, South Carolina",
  "Hotel Bennett - Charleston, South Carolina",
  "Zero George Street Hotel - Charleston, South Carolina",
  "Perry Lane Hotel, a Luxury Collection Hotel, Savannah - Savannah, Georgia",
  "Thompson Savannah - Savannah, Georgia",
  "The Sanctuary at Kiawah Island Golf Resort - Kiawah Island, South Carolina",
  "Ocean House - Watch Hill, Rhode Island",
  "Castle Hill Inn - Newport, Rhode Island",
  "The Chanler at Cliff Walk - Newport, Rhode Island",
  "The Hermitage Hotel Nashville - Nashville, Tennessee",
  "The Weekapaug Inn - Westerly, Rhode Island",
  // Vietnam
  "Four Seasons Resort The Nam Hai- Hoi An- Vietnam - Hoi An, Vietnam",
  "Six Senses Ninh Van Bay - Ninh Hoa, Vietnam",
  "Sofitel Legend Metropole Hanoi - Hanoi, Vietnam",
];

function getCoords(location) {
  // Try exact match first
  if (cityCoordinates[location]) {
    return cityCoordinates[location];
  }

  // Try to find partial match
  for (const [key, coords] of Object.entries(cityCoordinates)) {
    if (location.includes(key.split(',')[0]) || key.includes(location.split(',')[0])) {
      return coords;
    }
  }

  // Try city name only
  const city = location.split(',')[0].trim();
  for (const [key, coords] of Object.entries(cityCoordinates)) {
    if (key.toLowerCase().includes(city.toLowerCase())) {
      return coords;
    }
  }

  return null;
}

function extractBrand(name) {
  const brandPatterns = [
    'Four Seasons', 'Ritz-Carlton', 'St. Regis', 'Fairmont', 'Sofitel',
    'InterContinental', 'Kimpton', 'Andaz', 'Park Hyatt', 'Grand Hyatt',
    'Hyatt Regency', 'JW Marriott', 'Shangri-La', 'Mandarin Oriental',
    'Peninsula', 'Belmond', 'Rosewood', 'One&Only', 'Six Senses', 'Bulgari',
    'COMO', 'Raffles', 'Langham', 'Montage', 'Pendry', 'Thompson', 'Nobu',
    'W ', 'Ace Hotel', '1 Hotel', '21c Museum Hotel', 'Corinthia',
    'Radisson', 'Loews', 'Omni', 'Viceroy', 'Virgin Hotels', 'Waldorf Astoria'
  ];

  for (const pattern of brandPatterns) {
    if (name.includes(pattern)) {
      return pattern.replace('W ', 'W Hotels').trim();
    }
  }
  return undefined;
}

function generateId(name, city) {
  const slug = `${name}-${city}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return slug.substring(0, 80);
}

function processHotel(entry) {
  const parts = entry.split(' - ');
  const name = parts[0].trim();
  const location = parts.slice(1).join(' - ').trim();

  const locationParts = location.split(', ').map(p => p.trim());
  let city, region, country;

  if (locationParts.length === 1) {
    city = locationParts[0];
    country = locationParts[0];
  } else if (locationParts.length === 2) {
    city = locationParts[0];
    country = locationParts[1];
  } else {
    city = locationParts[0];
    region = locationParts.slice(1, -1).join(', ');
    country = locationParts[locationParts.length - 1];
  }

  const coords = getCoords(location);

  return {
    id: generateId(name, city),
    name,
    brand: extractBrand(name),
    city,
    region,
    country,
    latitude: coords?.lat,
    longitude: coords?.lng,
    map_url: coords
      ? `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`
      : undefined,
    needs_review: !coords
  };
}

// Process all hotels
const hotels = rawHotels.map(processHotel);

// Add some additional coordinates for missing hotels (based on city)
hotels.forEach(hotel => {
  if (!hotel.latitude) {
    // Try to match by city name in coordinates list
    for (const [loc, coords] of Object.entries(cityCoordinates)) {
      if (loc.toLowerCase().includes(hotel.city.toLowerCase())) {
        hotel.latitude = coords.lat;
        hotel.longitude = coords.lng;
        hotel.map_url = `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
        hotel.needs_review = true; // Mark for review since it's city-level
        break;
      }
    }
  }
});

const dataset = {
  meta: {
    data_version: 'v1',
    last_built_at: new Date().toISOString(),
    source_url: 'https://www.awardtravel.co/blog/the-edit-by-chase-list'
  },
  hotels
};

// Write to file
writeFileSync('./data/edit_hotels.json', JSON.stringify(dataset, null, 2));

console.log(`Generated dataset with ${hotels.length} hotels`);
console.log(`Hotels with coordinates: ${hotels.filter(h => h.latitude).length}`);
console.log(`Hotels needing review: ${hotels.filter(h => h.needs_review).length}`);
