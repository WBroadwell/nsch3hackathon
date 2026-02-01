/**
 * Map Component
 *
 * An interactive map that displays charity events near the user's location.
 * Uses Leaflet for map rendering and OpenStreetMap for tiles.
 *
 * Features:
 * - Shows user's current location (blue marker)
 * - Displays nearby events as red markers
 * - Groups multiple events at the same location into a single marker
 * - Clicking an event marker shows details and links to event pages
 * - Supports two-finger scroll/pinch zoom on touch devices
 */

"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { GestureHandling } from "leaflet-gesture-handling";
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";
import { parseLocalDate } from "@/lib/utils";

// Enable gesture handling for better mobile experience
// Requires two-finger scroll instead of one to pan the map
L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);

// Type definitions
interface Coordinates {
  lat: number;
  lng: number;
}

interface EventWithDistance {
  id: number;
  name: string;
  host: string;
  date: Date;
  location: string;
  latitude: number | null;
  longitude: number | null;
  description: string;
  distance: number;           // Miles from user's location
  coordinates?: Coordinates;  // Parsed lat/lng for map
}

interface MapComponentProps {
  userLocation: Coordinates;
  events: EventWithDistance[];
}

// Type for grouped events at a single location
interface GroupedLocation {
  coordinates: Coordinates;
  events: EventWithDistance[];
}

// Custom marker icon for user's location (blue)
const userIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom marker icon for single event (red)
const eventIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom marker icon for multiple events at same location (orange)
const multiEventIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

/**
 * Create a location key for grouping events
 * Rounds coordinates to 5 decimal places (~1 meter precision)
 * to group events at effectively the same location
 */
function getLocationKey(lat: number, lng: number): string {
  return `${lat.toFixed(5)},${lng.toFixed(5)}`;
}

/**
 * MapController - Internal component to manage map state
 *
 * Handles recentering the map when the user's location changes
 * and enables gesture handling for better mobile UX.
 */
function MapController({ center }: { center: Coordinates }) {
  const map = useMap();

  // Recenter map when location changes
  useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom());
  }, [center, map]);

  // Enable two-finger scroll on touch devices
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (map as any).gestureHandling?.enable();
  }, [map]);

  return null;
}

/**
 * MapComponent - Main exported component
 *
 * Renders the Leaflet map with user location and event markers.
 * Groups events at the same location into a single marker.
 */
export default function MapComponent({ userLocation, events }: MapComponentProps) {
  // Group events by location so multiple events at the same place share one marker
  const groupedLocations = useMemo(() => {
    const groups = new Map<string, GroupedLocation>();

    events.forEach((event) => {
      if (!event.coordinates) return;

      const key = getLocationKey(event.coordinates.lat, event.coordinates.lng);

      if (groups.has(key)) {
        groups.get(key)!.events.push(event);
      } else {
        groups.set(key, {
          coordinates: event.coordinates,
          events: [event],
        });
      }
    });

    return Array.from(groups.values());
  }, [events]);

  return (
    <MapContainer
      center={[userLocation.lat, userLocation.lng]}
      zoom={10}
      scrollWheelZoom={true}
      className="w-full h-[600px] rounded-xl z-0"
    >
      {/* Map tiles from OpenStreetMap */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Controller for map state management */}
      <MapController center={userLocation} />

      {/* User's location marker (blue) */}
      <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
        <Popup>
          <div className="text-center">
            <strong className="text-blue-600">Your Location</strong>
          </div>
        </Popup>
      </Marker>

      {/* Event markers - grouped by location */}
      {groupedLocations.map((group) => {
        const isMultiple = group.events.length > 1;

        return (
          <Marker
            key={getLocationKey(group.coordinates.lat, group.coordinates.lng)}
            position={[group.coordinates.lat, group.coordinates.lng]}
            icon={isMultiple ? multiEventIcon : eventIcon}
          >
            <Popup>
              <div className="min-w-[220px] max-h-[300px] overflow-y-auto">
                {/* Show count if multiple events */}
                {isMultiple && (
                  <div className="mb-3 pb-2 border-b border-gray-200">
                    <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-semibold">
                      {group.events.length} events at this location
                    </span>
                  </div>
                )}

                {/* List all events at this location */}
                {group.events.map((event, index) => (
                  <div
                    key={event.id}
                    className={index > 0 ? "mt-4 pt-4 border-t border-gray-200" : ""}
                  >
                    <h3 className="font-bold text-gray-800 text-base">{event.name}</h3>
                    <p className="text-rose-500 text-sm">{event.host}</p>
                    <div className="mt-1 text-sm text-gray-600">
                      <p className="text-xs text-gray-500">
                        {parseLocalDate(event.date as unknown as string).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <p className="mt-1">
                        <span className="font-semibold text-rose-600">{event.distance.toFixed(1)} mi</span> away
                      </p>
                    </div>
                    <a
                      href={`/events/${event.id}`}
                      className="mt-2 inline-block w-full text-center bg-rose-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-rose-600 transition"
                    >
                      View Details
                    </a>
                  </div>
                ))}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
