"use client";

import { useEffect, useState } from "react";
import type { Hotel, SearchResult } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Locate } from "lucide-react";

// Dynamic imports for Leaflet (must be client-side only)
import dynamic from "next/dynamic";

interface HotelMapProps {
  hotels: (Hotel | SearchResult)[];
  origin?: {
    latitude: number;
    longitude: number;
    name: string;
  };
  onSelectHotel: (hotel: Hotel | SearchResult) => void;
  selectedHotel?: Hotel | SearchResult | null;
}

// Dynamic import of the actual map component
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  { ssr: false }
);

function isSearchResult(hotel: Hotel | SearchResult): hotel is SearchResult {
  return "distance_km" in hotel;
}

function HotelMapInner({
  hotels,
  origin,
  onSelectHotel,
  selectedHotel,
}: HotelMapProps) {
  const [L, setL] = useState<typeof import("leaflet") | null>(null);
  const [mounted, setMounted] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [mapRef, setMapRef] = useState<any>(null);

  useEffect(() => {
    // Import Leaflet on client side only
    import("leaflet").then((leaflet) => {
      setL(leaflet.default);
    });
    setMounted(true);
  }, []);

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setIsLocating(false);
        // Fly to user location if map is available
        if (mapRef) {
          mapRef.flyTo([latitude, longitude], 10);
        }
      },
      (error) => {
        setIsLocating(false);
        alert("Could not get your location. Please check permissions.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  if (!mounted || !L) {
    return (
      <div className="w-full h-full bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  // Filter hotels with valid coordinates
  const validHotels = hotels.filter(
    (h) => h.latitude !== undefined && h.longitude !== undefined
  );

  // Calculate map center
  let center: [number, number] = [40, -100]; // Default to US center

  if (origin) {
    center = [origin.latitude, origin.longitude];
  } else if (validHotels.length > 0) {
    const avgLat =
      validHotels.reduce((sum, h) => sum + (h.latitude || 0), 0) /
      validHotels.length;
    const avgLng =
      validHotels.reduce((sum, h) => sum + (h.longitude || 0), 0) /
      validHotels.length;
    center = [avgLat, avgLng];
  }

  // Create custom icons
  const hotelIcon = L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width: 24px;
      height: 24px;
      background: hsl(var(--primary));
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  const originIcon = L.divIcon({
    className: "custom-marker-origin",
    html: `<div style="
      width: 32px;
      height: 32px;
      background: #ef4444;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  // User location icon (blue dot with pulsing effect)
  const userLocationIcon = L.divIcon({
    className: "user-location-marker",
    html: `<div style="
      width: 20px;
      height: 20px;
      background: #3b82f6;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 0 0 rgba(59, 130, 246, 0.4);
      animation: pulse 2s infinite;
    "></div>
    <style>
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
        70% { box-shadow: 0 0 0 15px rgba(59, 130, 246, 0); }
        100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
      }
    </style>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={center}
        zoom={origin ? 8 : 4}
        style={{ height: "100%", width: "100%" }}
        className="rounded-lg"
        ref={setMapRef}
      >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Origin marker */}
      {origin && (
        <>
          <Marker
            position={[origin.latitude, origin.longitude]}
            icon={originIcon}
          >
            <Popup>
              <strong>Your Location</strong>
              <br />
              {origin.name}
            </Popup>
          </Marker>
          {/* Optional: show search radius circle */}
          {/* <Circle
            center={[origin.latitude, origin.longitude]}
            radius={searchRadiusKm * 1000}
            pathOptions={{ color: "blue", fillColor: "blue", fillOpacity: 0.1 }}
          /> */}
        </>
      )}

      {/* User location marker */}
      {userLocation && (
        <Marker
          position={userLocation}
          icon={userLocationIcon}
        >
          <Popup>
            <strong>Your Location</strong>
          </Popup>
        </Marker>
      )}

      {/* Hotel markers */}
      {validHotels.map((hotel) => (
        <Marker
          key={hotel.id}
          position={[hotel.latitude!, hotel.longitude!]}
          icon={hotelIcon}
          eventHandlers={{
            click: () => onSelectHotel(hotel),
          }}
        >
          <Popup>
            <div className="max-w-[200px]">
              <strong className="text-sm">{hotel.name}</strong>
              <p className="text-xs text-muted-foreground mt-1">
                {hotel.city}, {hotel.country}
              </p>
              {isSearchResult(hotel) && (
                <p className="text-xs font-medium mt-1">
                  {hotel.distance_miles} mi ({hotel.time_hours}h)
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>

      {/* Locate Me Button */}
      <Button
        variant="secondary"
        size="icon"
        className="absolute top-4 right-4 z-[1000] shadow-md"
        onClick={handleLocateMe}
        disabled={isLocating}
        title="Center on my location"
      >
        <Locate className={`h-4 w-4 ${isLocating ? "animate-pulse" : ""}`} />
      </Button>
    </div>
  );
}

// Export with dynamic loading to prevent SSR issues
export const HotelMap = dynamic(() => Promise.resolve(HotelMapInner), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-muted flex items-center justify-center rounded-lg">
      <p className="text-muted-foreground">Loading map...</p>
    </div>
  ),
});
