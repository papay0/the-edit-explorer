"use client";

import type { Hotel, SearchResult } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, ExternalLink, Building2 } from "lucide-react";

interface HotelListProps {
  hotels: (Hotel | SearchResult)[];
  onSelectHotel: (hotel: Hotel | SearchResult) => void;
  isSearchResult?: boolean;
  loading?: boolean;
}

function isSearchResult(hotel: Hotel | SearchResult): hotel is SearchResult {
  return "distance_km" in hotel;
}

export function HotelList({
  hotels,
  onSelectHotel,
  isSearchResult: showDistance = false,
  loading = false,
}: HotelListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-5 bg-muted rounded w-3/4 mb-2" />
              <div className="h-4 bg-muted rounded w-1/2 mb-2" />
              <div className="h-4 bg-muted rounded w-1/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (hotels.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No hotels found</h3>
        <p className="text-muted-foreground text-sm">
          Try adjusting your search criteria or filters
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {hotels.map((hotel) => (
        <Card
          key={hotel.id}
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onSelectHotel(hotel)}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start gap-3">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium leading-tight mb-1 line-clamp-2">
                  {hotel.name}
                </h4>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">
                    {hotel.city}, {hotel.country}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {hotel.brand && (
                    <Badge variant="secondary" className="text-xs">
                      {hotel.brand}
                    </Badge>
                  )}
                  {hotel.needs_review && (
                    <Badge variant="outline" className="text-xs text-amber-600">
                      Location approximate
                    </Badge>
                  )}
                </div>
              </div>

              {isSearchResult(hotel) && showDistance && (
                <div className="text-right flex-shrink-0">
                  <div className="text-lg font-semibold">
                    {hotel.distance_miles} mi
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {hotel.distance_km} km
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <Clock className="h-3 w-3" />
                    <span>~{hotel.time_hours}h</span>
                  </div>
                </div>
              )}
            </div>

            {hotel.map_url && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 h-7 text-xs px-2"
                asChild
                onClick={(e) => e.stopPropagation()}
              >
                <a
                  href={hotel.map_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View on Maps
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
