"use client";

import type { Hotel, SearchResult } from "@/lib/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, Clock, ExternalLink, Navigation, Building2 } from "lucide-react";

interface HotelDetailDrawerProps {
  hotel: (Hotel | SearchResult) | null;
  onClose: () => void;
  originLocation?: string;
}

function isSearchResult(hotel: Hotel | SearchResult): hotel is SearchResult {
  return "distance_km" in hotel;
}

export function HotelDetailDrawer({
  hotel,
  onClose,
  originLocation,
}: HotelDetailDrawerProps) {
  if (!hotel) return null;

  const hasDistance = isSearchResult(hotel);

  return (
    <Sheet open={!!hotel} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="text-left">
          <SheetTitle className="text-xl leading-tight pr-6">
            {hotel.name}
          </SheetTitle>
          <SheetDescription className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {hotel.city}, {hotel.country}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Brand Badge */}
          {hotel.brand && (
            <div>
              <Badge variant="secondary" className="text-sm">
                {hotel.brand}
              </Badge>
            </div>
          )}

          {/* Distance Info (if from search) */}
          {hasDistance && (
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium mb-3 text-sm">Distance from {originLocation || "origin"}</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold">{hotel.distance_miles}</div>
                  <div className="text-sm text-muted-foreground">miles</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{hotel.distance_km}</div>
                  <div className="text-sm text-muted-foreground">kilometers</div>
                </div>
              </div>
              <Separator className="my-3" />
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Approximately <strong>{hotel.time_hours} hours</strong> travel time
                </span>
              </div>
            </div>
          )}

          {/* Location Details */}
          <div>
            <h4 className="font-medium mb-3 text-sm flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Location Details
            </h4>
            <div className="space-y-2 text-sm">
              {hotel.address_line_1 && (
                <p>{hotel.address_line_1}</p>
              )}
              {hotel.address_line_2 && (
                <p>{hotel.address_line_2}</p>
              )}
              <p>
                {hotel.city}
                {hotel.region && `, ${hotel.region}`}
                {hotel.postal_code && ` ${hotel.postal_code}`}
              </p>
              <p>{hotel.country}</p>
            </div>

            {hotel.latitude && hotel.longitude && (
              <p className="text-xs text-muted-foreground mt-2">
                Coordinates: {hotel.latitude.toFixed(4)}, {hotel.longitude.toFixed(4)}
              </p>
            )}

            {hotel.needs_review && (
              <p className="text-xs text-amber-600 mt-2">
                Note: Location coordinates are approximate and may need verification.
              </p>
            )}
          </div>

          <Separator />

          {/* Actions */}
          <div className="space-y-2">
            {hotel.map_url && (
              <Button asChild className="w-full">
                <a
                  href={hotel.map_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Navigation className="mr-2 h-4 w-4" />
                  Open in Google Maps
                </a>
              </Button>
            )}

            <Button variant="outline" asChild className="w-full">
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(hotel.name)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Search on Google
              </a>
            </Button>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground">
            This is an unofficial tool for exploring The Edit by Chase hotels.
            Always verify hotel details and availability through the official
            Chase Travel Portal before booking.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
