"use client";

import { useState, useEffect, useCallback } from "react";
import type { Hotel, SearchResult } from "@/lib/types";
import { SearchControls } from "@/components/search-controls";
import { HotelList } from "@/components/hotel-list";
import { HotelDetailDrawer } from "@/components/hotel-detail-drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  MapPin,
  Info,
  Hotel as HotelIcon,
  AlertCircle,
  Map,
  List,
} from "lucide-react";
import { HotelMap } from "@/components/hotel-map";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SearchState {
  origin: {
    input: string;
    resolved: string;
    latitude: number;
    longitude: number;
  } | null;
  results: SearchResult[];
  searchParams: {
    hours: number;
    averageSpeedKmh: number;
    maxDistanceKm: number;
  } | null;
}

export default function Home() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchState, setSearchState] = useState<SearchState>({
    origin: null,
    results: [],
    searchParams: null,
  });
  const [selectedHotel, setSelectedHotel] = useState<
    (Hotel | SearchResult) | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [totalHotels, setTotalHotels] = useState(0);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  // Load initial data
  useEffect(() => {
    async function loadData() {
      try {
        const [hotelsRes, filtersRes, metaRes] = await Promise.all([
          fetch("/api/hotels"),
          fetch("/api/hotels?action=filters"),
          fetch("/api/hotels?action=meta"),
        ]);

        const hotelsData = await hotelsRes.json();
        const filtersData = await filtersRes.json();
        const metaData = await metaRes.json();

        setHotels(hotelsData.hotels);
        setCountries(filtersData.countries);
        setCities(filtersData.cities);
        setTotalHotels(metaData.totalHotels);
      } catch (err) {
        console.error("Failed to load hotels:", err);
        setError("Failed to load hotel data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Handle country change to update cities
  const handleCountryChange = useCallback(async (country: string | undefined) => {
    setSelectedCountry(country);
    try {
      const res = await fetch(
        `/api/hotels?action=filters${country ? `&country=${encodeURIComponent(country)}` : ""}`
      );
      const data = await res.json();
      setCities(data.cities);
    } catch (err) {
      console.error("Failed to load cities:", err);
    }
  }, []);

  // Handle filter changes
  const handleFilter = useCallback(
    async (params: { country?: string; city?: string; search?: string }) => {
      try {
        const queryParams = new URLSearchParams();
        if (params.country) queryParams.set("country", params.country);
        if (params.city) queryParams.set("city", params.city);
        if (params.search) queryParams.set("search", params.search);

        const res = await fetch(`/api/hotels?${queryParams.toString()}`);
        const data = await res.json();
        setHotels(data.hotels);
      } catch (err) {
        console.error("Failed to filter hotels:", err);
      }
    },
    []
  );

  // Handle distance search
  const handleSearch = useCallback(
    async (params: {
      originInput: string;
      hours: number;
      averageSpeedKmh: number;
      coordinates?: { latitude: number; longitude: number };
    }) => {
      setSearching(true);
      setError(null);

      try {
        const res = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Search failed. Please try again.");
          return;
        }

        setSearchState({
          origin: data.origin,
          results: data.results,
          searchParams: data.searchParams,
        });
      } catch (err) {
        console.error("Search error:", err);
        setError("An error occurred. Please try again.");
      } finally {
        setSearching(false);
      }
    },
    []
  );

  // Clear search results
  const handleClearSearch = useCallback(() => {
    setSearchState({ origin: null, results: [], searchParams: null });
  }, []);

  // Export data
  const handleExport = useCallback((format: "json" | "csv") => {
    const dataToExport = searchState.results.length > 0 ? searchState.results : hotels;

    if (format === "json") {
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "edit-hotels.json";
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const headers = [
        "Name",
        "City",
        "Country",
        "Brand",
        "Latitude",
        "Longitude",
      ];
      const rows = dataToExport.map((h) => [
        h.name,
        h.city,
        h.country,
        h.brand || "",
        h.latitude?.toString() || "",
        h.longitude?.toString() || "",
      ]);
      const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "edit-hotels.csv";
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [hotels, searchState.results]);

  const displayedHotels = searchState.results.length > 0 ? searchState.results : hotels;
  const hasSearchResults = searchState.results.length > 0;

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <HotelIcon className="h-6 w-6" />
                <div>
                  <h1 className="text-xl font-bold">The Edit Explorer</h1>
                  <p className="text-xs text-muted-foreground">
                    Explore Chase Sapphire Hotels
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {totalHotels} Hotels
                </Badge>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" asChild>
                      <a
                        href="https://www.awardtravel.co/blog/the-edit-by-chase-list"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Info className="h-4 w-4" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>View source data</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sidebar with Controls */}
            <aside className="lg:col-span-4 xl:col-span-3">
              <div className="bg-card rounded-lg border p-4 sticky top-24">
                <SearchControls
                  onSearch={handleSearch}
                  onFilter={handleFilter}
                  isSearching={searching}
                  countries={countries}
                  cities={cities}
                  onCountryChange={handleCountryChange}
                  selectedCountry={selectedCountry}
                  hasSearchResults={hasSearchResults}
                  onClearSearch={handleClearSearch}
                />

                <Separator className="my-4" />

                {/* Export Section */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Data
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExport("json")}
                    >
                      JSON
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExport("csv")}
                    >
                      CSV
                    </Button>
                  </div>
                </div>
              </div>
            </aside>

            {/* Hotel List */}
            <section className="lg:col-span-8 xl:col-span-9">
              {/* Search Result Header */}
              {hasSearchResults && searchState.origin && (
                <div className="bg-muted/50 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 mt-0.5 text-primary" />
                    <div>
                      <h3 className="font-medium">
                        {searchState.results.length} hotels within{" "}
                        {searchState.searchParams?.hours} hours
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        From: {searchState.origin.resolved}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Max distance: ~{searchState.searchParams?.maxDistanceKm} km
                        ({Math.round((searchState.searchParams?.maxDistanceKm || 0) * 0.621)} mi)
                        at {searchState.searchParams?.averageSpeedKmh} km/h average
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* View Toggle and Results Count */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  {displayedHotels.length} Hotels
                </h2>
                <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "list" | "map")}>
                  <TabsList className="grid w-[160px] grid-cols-2">
                    <TabsTrigger value="list" className="flex items-center gap-1">
                      <List className="h-4 w-4" />
                      List
                    </TabsTrigger>
                    <TabsTrigger value="map" className="flex items-center gap-1">
                      <Map className="h-4 w-4" />
                      Map
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Hotel List or Map View */}
              {viewMode === "list" ? (
                <HotelList
                  hotels={displayedHotels}
                  onSelectHotel={setSelectedHotel}
                  isSearchResult={hasSearchResults}
                  loading={loading}
                />
              ) : (
                <div className="h-[600px] rounded-lg border overflow-hidden">
                  <HotelMap
                    hotels={displayedHotels}
                    origin={
                      searchState.origin
                        ? {
                            latitude: searchState.origin.latitude,
                            longitude: searchState.origin.longitude,
                            name: searchState.origin.resolved,
                          }
                        : undefined
                    }
                    onSelectHotel={setSelectedHotel}
                    selectedHotel={selectedHotel}
                  />
                </div>
              )}

              {/* Disclaimer */}
              {!loading && displayedHotels.length > 0 && (
                <p className="text-xs text-muted-foreground mt-6 text-center">
                  Distances are straight-line estimates. Actual driving time may
                  differ from real-world travel conditions.
                  <br />
                  This is an unofficial tool. Not affiliated with Chase.
                </p>
              )}
            </section>
          </div>
        </main>

        {/* Hotel Detail Drawer */}
        <HotelDetailDrawer
          hotel={selectedHotel}
          onClose={() => setSelectedHotel(null)}
          originLocation={searchState.origin?.input}
        />

        {/* Error Dialog */}
        <AlertDialog open={!!error} onOpenChange={() => setError(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Search Error
              </AlertDialogTitle>
              <AlertDialogDescription>{error}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setError(null)}>
                OK
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
}
