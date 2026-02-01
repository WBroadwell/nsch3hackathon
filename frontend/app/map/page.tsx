"use client";
import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { Event } from "@/types/Event";
import { parseLocalDate } from "@/lib/utils";

// Dynamically import the map component to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gray-200 rounded-2xl animate-pulse flex items-center justify-center">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
});

interface Coordinates {
  lat: number;
  lng: number;
}

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function MapPage() {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationStatus, setLocationStatus] = useState<"loading" | "granted" | "denied" | "manual">("loading");
  const [isSearching, setIsSearching] = useState(false);

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      try {
        const response = await fetch(`${baseUrl}/events`);
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };
    fetchEvents();
  }, []);

  // Request user location on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationStatus("granted");
        },
        (error) => {
          console.log("Geolocation error:", error.message);
          setLocationStatus("denied");
          // Default to a central US location
          setUserLocation({ lat: 39.8283, lng: -98.5795 });
        }
      );
    } else {
      // Defer state update to avoid synchronous setState in effect
      const timer = setTimeout(() => {
        setLocationStatus("denied");
        setUserLocation({ lat: 39.8283, lng: -98.5795 });
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  // Filter events within 50 miles when user location or events change
  // Also filters out events that have already passed
  const filteredEvents = useMemo(() => {
    if (!userLocation || events.length === 0) return [];

    // Get today's date at midnight for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventsWithDistance = events
      // Filter out events without coordinates
      .filter((event) => event.latitude != null && event.longitude != null)
      // Filter out past events
      .filter((event) => {
        const eventDate = parseLocalDate(event.date as unknown as string);
        return eventDate >= today;
      })
      .map((event) => {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          event.latitude!,
          event.longitude!
        );

        return {
          ...event,
          distance,
          coordinates: { lat: event.latitude!, lng: event.longitude! },
        };
      });

    // Filter events within 50 miles
    return eventsWithDistance
      .filter((event) => event.distance <= 50)
      .sort((a, b) => a.distance - b.distance);
  }, [userLocation, events]);

  // Search for location using Nominatim (OpenStreetMap)
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        setUserLocation({
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        });
        setLocationStatus("manual");
      } else {
        alert("Location not found. Please try a different search.");
      }
    } catch (error) {
      console.error("Search error:", error);
      alert("Failed to search location. Please try again.");
    }
    setIsSearching(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">Event Map</span>
          </h1>
          <p className="mt-2 text-gray-600">Find charity events within 50 miles of your location</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Enter a city, address, or zip code..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition disabled:opacity-50"
            >
              {isSearching ? "Searching..." : "Search Location"}
            </button>
          </div>
          {locationStatus === "denied" && (
            <p className="mt-3 text-sm text-amber-600">
              Location access denied. Use the search bar above to set your location.
            </p>
          )}
          {locationStatus === "granted" && (
            <p className="mt-3 text-sm text-green-600">
              Using your current location. You can search for a different location above.
            </p>
          )}
          {locationStatus === "manual" && (
            <p className="mt-3 text-sm text-blue-600">
              Showing events near: {searchQuery}
            </p>
          )}
        </div>

        {/* Map Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-rose-500 to-pink-500"></div>
          <div className="p-4">
            {userLocation ? (
              <MapComponent
                userLocation={userLocation}
                events={filteredEvents}
              />
            ) : (
              <div className="w-full h-[600px] bg-gray-100 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">Getting your location...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Events List */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Nearby Events ({filteredEvents.length})
          </h2>
          {filteredEvents.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <p className="text-gray-600">No events found within 50 miles. Try searching a different location.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredEvents.map((event) => (
                <a
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition block"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{event.name}</h3>
                      <p className="text-rose-500 text-sm">{event.host}</p>
                    </div>
                    <span className="bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-sm font-medium">
                      {event.distance.toFixed(1)} mi
                    </span>
                  </div>
                  <div className="mt-3 flex items-center text-gray-600 text-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.location}
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
