"use client";
import { useEffect, useState } from "react";
import { Event } from "@/types/Event";
import Link from "next/dist/client/link";

/*
events should be :
- id: number
- name: string
- date: string
- location: string
- description: string
- distance from user: number (in miles)
cut off at 20 miles?
*/

export default function Events() {
    const [events, setEvents] = useState<Event[] | null>(null);

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

    /* Sort events by date then by distance from user location */
    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800">
                        Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">Charity Events</span>
                    </h1>
                    <p className="mt-3 text-gray-600 text-lg">Find opportunities to make a difference near you</p>
                </div>

                <div className="space-y-6">
                    {events == null ? (
                        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                            <div className="animate-pulse flex flex-col items-center">
                                <div className="w-16 h-16 bg-rose-200 rounded-full mb-4"></div>
                                <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-32"></div>
                            </div>
                            <p className="mt-4 text-gray-500">Loading events...</p>
                        </div>
                    ) : events.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-gray-600 text-lg">No events found. Be the first to create one!</p>
                        </div>
                    ) : (
                        events.map((event) => (
                            <Link key={event.id} href={`/events/${event.id}`} className="block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] overflow-hidden">
                                <div className="flex">
                                    <div className="w-2 bg-gradient-to-b from-rose-500 to-pink-500"></div>
                                    <div className="flex-1 p-6">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-800 mb-2">{event.name}</h2>
                                                <p className="text-rose-500 font-medium">{event.host}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-sm font-medium">
                                                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </div>
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
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}