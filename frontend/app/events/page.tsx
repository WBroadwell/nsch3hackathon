"use client";
import { useEffect, useState } from "react";
import { Event } from "@/types/Event";
import Link from "next/link";
import { parseLocalDate } from "@/lib/utils";

export default function Events() {
    const [events, setEvents] = useState<Event[] | null>(null);
    const [showPastEvents, setShowPastEvents] = useState(false);

    async function getEvents() {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
        return await fetch(`${baseUrl}/events`).then((res) => res.json());
    }

    useEffect(() => {
        const fetchEvents = async () => {
            const data = await getEvents();
            if (data["errors"]) {
                console.error("Error fetching events:", data["errors"]);
                return;
            } else {
                console.log("Fetched events successfully:", data);
                setEvents(data);
            }
        };
        fetchEvents();
    }, []);

    // Separate events into upcoming and past
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingEvents = events
        ?.filter((event) => parseLocalDate(event.date) >= today)
        .sort((a, b) => parseLocalDate(a.date).getTime() - parseLocalDate(b.date).getTime()) || [];

    const pastEvents = events
        ?.filter((event) => parseLocalDate(event.date) < today)
        .sort((a, b) => parseLocalDate(b.date).getTime() - parseLocalDate(a.date).getTime()) || [];

    const EventCard = ({ event, isPast = false }: { event: Event; isPast?: boolean }) => (
        <Link
            href={`/events/${event.id}`}
            className={`block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] overflow-hidden ${isPast ? "opacity-75" : ""}`}
        >
            <div className="flex">
                <div className={`w-2 ${isPast ? "bg-gradient-to-b from-gray-400 to-gray-500" : "bg-gradient-to-b from-rose-500 to-pink-500"}`}></div>
                <div className="flex-1 p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">{event.name}</h2>
                            <p className={`font-medium ${isPast ? "text-gray-500" : "text-rose-500"}`}>{event.host}</p>
                        </div>
                        <div className="text-right">
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${isPast ? "bg-gray-100 text-gray-600" : "bg-rose-100 text-rose-600"}`}>
                                {parseLocalDate(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                            {isPast && (
                                <span className="text-xs text-gray-400 mt-1 block">Past Event</span>
                            )}
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-gray-600">
                        <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.location}
                    </div>
                </div>
            </div>
        </Link>
    );

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800">
                        Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">Charity Events</span>
                    </h1>
                    <p className="mt-3 text-gray-600 text-lg">Find opportunities to make a difference near you</p>
                </div>

                {/* Loading State */}
                {events == null ? (
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                        <div className="animate-pulse flex flex-col items-center">
                            <div className="w-16 h-16 bg-rose-200 rounded-full mb-4"></div>
                            <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                        </div>
                        <p className="mt-4 text-gray-500">Loading events...</p>
                    </div>
                ) : (
                    <>
                        {/* Upcoming Events Section */}
                        <div className="space-y-6 mb-12">
                            {upcomingEvents.length === 0 ? (
                                <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                                    <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-600 text-lg">No upcoming events scheduled.</p>
                                    <p className="text-gray-500 text-sm mt-2">Check back later or browse past events below.</p>
                                </div>
                            ) : (
                                upcomingEvents.map((event) => (
                                    <EventCard key={event.id} event={event} />
                                ))
                            )}
                        </div>

                        {/* Past Events Section */}
                        {pastEvents.length > 0 && (
                            <div className="border-t border-gray-200 pt-8">
                                <button
                                    onClick={() => setShowPastEvents(!showPastEvents)}
                                    className="w-full flex items-center justify-between p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition mb-6"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="text-left">
                                            <h2 className="text-lg font-semibold text-gray-800">Past Events</h2>
                                            <p className="text-sm text-gray-500">{pastEvents.length} event{pastEvents.length !== 1 ? 's' : ''}</p>
                                        </div>
                                    </div>
                                    <svg
                                        className={`w-6 h-6 text-gray-400 transition-transform ${showPastEvents ? "rotate-180" : ""}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {showPastEvents && (
                                    <div className="space-y-4">
                                        {pastEvents.map((event) => (
                                            <EventCard key={event.id} event={event} isPast />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}
