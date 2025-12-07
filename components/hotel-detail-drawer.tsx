"use client";

import type { Hotel, SearchResult } from "@/lib/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Clock,
  ExternalLink,
  Navigation,
  Building2,
  Car,
  Globe,
  Star,
  MapPinned,
  Route
} from "lucide-react";

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
      <SheetContent className="sm:max-w-md flex flex-col">
        {/* Header Section */}
        <SheetHeader className="text-left space-y-3">
          <div className="space-y-2">
            {hotel.brand && (
              <Badge variant="outline" className="text-xs font-medium">
                <Star className="h-3 w-3 mr-1" />
                {hotel.brand}
              </Badge>
            )}
            <SheetTitle className="text-2xl font-bold leading-tight pr-8">
              {hotel.name}
            </SheetTitle>
          </div>
          <SheetDescription asChild>
            <div className="flex items-center gap-2 text-base text-foreground/80">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{hotel.city}, {hotel.country}</span>
            </div>
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-6 space-y-6">
          {/* Distance Card (if from search) */}
          {hasDistance && (
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-5 border border-primary/20">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Route className="h-4 w-4 text-primary" />
                </div>
                <h4 className="font-semibold text-sm">
                  Distance from {originLocation || "your location"}
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-background/60 rounded-lg p-3 text-center">
                  <div className="text-3xl font-bold text-primary">{hotel.distance_miles}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">miles</div>
                </div>
                <div className="bg-background/60 rounded-lg p-3 text-center">
                  <div className="text-3xl font-bold text-primary">{hotel.distance_km}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">kilometers</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-background/60 rounded-lg p-3">
                <Car className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">~{hotel.time_hours} hours</div>
                  <div className="text-xs text-muted-foreground">Estimated driving time</div>
                </div>
              </div>
            </div>
          )}

          {/* Location Details Card */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-muted rounded-lg">
                <MapPinned className="h-4 w-4 text-muted-foreground" />
              </div>
              <h4 className="font-semibold text-sm">Location Details</h4>
            </div>

            <div className="bg-muted/30 rounded-xl p-4 space-y-2">
              <div className="space-y-1 text-sm">
                {hotel.address_line_1 && (
                  <p className="font-medium">{hotel.address_line_1}</p>
                )}
                {hotel.address_line_2 && (
                  <p className="text-muted-foreground">{hotel.address_line_2}</p>
                )}
                <p className="text-muted-foreground">
                  {hotel.city}
                  {hotel.region && `, ${hotel.region}`}
                  {hotel.postal_code && ` ${hotel.postal_code}`}
                </p>
                <p className="text-muted-foreground">{hotel.country}</p>
              </div>

              {hotel.latitude && hotel.longitude && (
                <div className="pt-2 border-t border-border/50">
                  <p className="text-xs text-muted-foreground font-mono">
                    {hotel.latitude.toFixed(5)}, {hotel.longitude.toFixed(5)}
                  </p>
                </div>
              )}
            </div>

            {hotel.needs_review && (
              <div className="flex items-start gap-2 text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/30 rounded-lg p-3">
                <span className="text-amber-500">⚠️</span>
                <span>Location coordinates are approximate and may need verification.</span>
              </div>
            )}
          </div>

          <Separator />

          {/* Quick Actions */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Quick Actions</h4>
            <div className="grid gap-2">
              {hotel.map_url && (
                <Button asChild size="lg" className="w-full justify-start h-12">
                  <a
                    href={hotel.map_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Navigation className="mr-3 h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">Open in Google Maps</div>
                      <div className="text-xs opacity-80">Get directions</div>
                    </div>
                  </a>
                </Button>
              )}

              <Button variant="outline" asChild size="lg" className="w-full justify-start h-12">
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(hotel.name + " " + hotel.city)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Globe className="mr-3 h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Search on Google</div>
                    <div className="text-xs text-muted-foreground">Find reviews & info</div>
                  </div>
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <SheetFooter className="border-t pt-4">
          <p className="text-xs text-muted-foreground text-center w-full">
            Part of The Edit by Chase. Always verify details through the{" "}
            <a
              href="https://www.chase.com/personal/credit-cards/travel"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              Chase Travel Portal
            </a>
            .
          </p>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
