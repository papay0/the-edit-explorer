"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Search, MapPin, Clock, Filter, ChevronDown, Settings, Locate } from "lucide-react";

interface SearchControlsProps {
  onSearch: (params: {
    originInput: string;
    hours: number;
    averageSpeedKmh: number;
    coordinates?: { latitude: number; longitude: number };
  }) => void;
  onFilter: (params: {
    country?: string;
    city?: string;
    search?: string;
  }) => void;
  isSearching: boolean;
  countries: string[];
  cities: string[];
  onCountryChange: (country: string | undefined) => void;
  selectedCountry?: string;
  hasSearchResults: boolean;
  onClearSearch: () => void;
}

export function SearchControls({
  onSearch,
  onFilter,
  isSearching,
  countries,
  cities,
  onCountryChange,
  selectedCountry,
  hasSearchResults,
  onClearSearch,
}: SearchControlsProps) {
  const [originInput, setOriginInput] = useState("");
  const [hours, setHours] = useState(3);
  const [averageSpeedKmh, setAverageSpeedKmh] = useState(90);
  const [nameSearch, setNameSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState<string | undefined>();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [currentCoordinates, setCurrentCoordinates] = useState<{ latitude: number; longitude: number } | undefined>();

  const handleDistanceSearch = () => {
    if (!originInput.trim() && !currentCoordinates) return;
    onSearch({
      originInput: originInput.trim() || "Current Location",
      hours,
      averageSpeedKmh,
      coordinates: currentCoordinates,
    });
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentCoordinates({ latitude, longitude });
        setOriginInput("Current Location");
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert("Location access denied. Please enable location permissions.");
            break;
          case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            alert("Location request timed out.");
            break;
          default:
            alert("An error occurred getting your location.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  const handleFilterChange = () => {
    onFilter({
      country: selectedCountry,
      city: selectedCity,
      search: nameSearch || undefined,
    });
  };

  useEffect(() => {
    handleFilterChange();
  }, [selectedCountry, selectedCity, nameSearch]);

  const handleCountryChange = (value: string) => {
    const country = value === "all" ? undefined : value;
    onCountryChange(country);
    setSelectedCity(undefined);
  };

  const handleCityChange = (value: string) => {
    setSelectedCity(value === "all" ? undefined : value);
  };

  return (
    <div className="space-y-6">
      {/* Distance Search Section */}
      <div className="space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Find Hotels Near You
        </h3>

        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="origin">Starting Location</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="origin"
                  placeholder="e.g., San Francisco, CA"
                  value={originInput}
                  onChange={(e) => {
                    setOriginInput(e.target.value);
                    // Clear coordinates if user types a different location
                    if (e.target.value !== "Current Location") {
                      setCurrentCoordinates(undefined);
                    }
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleDistanceSearch()}
                  className="pr-10"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleUseCurrentLocation}
                disabled={isLocating}
                title="Use current location"
              >
                <Locate className={`h-4 w-4 ${isLocating ? "animate-pulse" : ""}`} />
              </Button>
            </div>
            {currentCoordinates && (
              <p className="text-xs text-muted-foreground">
                Using GPS: {currentCoordinates.latitude.toFixed(4)}, {currentCoordinates.longitude.toFixed(4)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Travel Time</Label>
              <span className="text-sm font-medium">{hours} hours</span>
            </div>
            <Slider
              value={[hours]}
              onValueChange={([value]) => setHours(value)}
              min={0.5}
              max={10}
              step={0.5}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>30 min</span>
              <span>10 hours</span>
            </div>
          </div>

          <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between text-muted-foreground"
              >
                <span className="flex items-center gap-2">
                  <Settings className="h-3 w-3" />
                  Advanced Settings
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    showAdvanced ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Average Speed</Label>
                  <span className="text-sm text-muted-foreground">
                    {averageSpeedKmh} km/h ({Math.round(averageSpeedKmh * 0.621)} mph)
                  </span>
                </div>
                <Slider
                  value={[averageSpeedKmh]}
                  onValueChange={([value]) => setAverageSpeedKmh(value)}
                  min={40}
                  max={120}
                  step={10}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Button
            onClick={handleDistanceSearch}
            disabled={!originInput.trim() || isSearching}
            className="w-full"
          >
            {isSearching ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Find Hotels Within {hours}h
              </>
            )}
          </Button>

          {hasSearchResults && (
            <Button
              variant="outline"
              onClick={onClearSearch}
              className="w-full"
              size="sm"
            >
              Clear Distance Search
            </Button>
          )}
        </div>
      </div>

      <div className="border-t pt-6" />

      {/* Filter Section */}
      <div className="space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter Hotels
        </h3>

        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="name-search">Search by Name</Label>
            <Input
              id="name-search"
              placeholder="Hotel name, brand..."
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Country</Label>
            <Select
              value={selectedCountry || "all"}
              onValueChange={handleCountryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {cities.length > 0 && (
            <div className="space-y-2">
              <Label>City</Label>
              <Select
                value={selectedCity || "all"}
                onValueChange={handleCityChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
