"use client";
import React, { useState, useEffect } from 'react';
import { Event } from '@/types/Event';


interface EventPageProps {
  params: Promise<{ event: string }>;
}

export default function IndividualEvent({ params }: EventPageProps) {
    const { event: eventid } = React.use(params);
    const [eventDetails, setEventDetails] = useState<Event | null>(null);

    useEffect(() => {
        // Fetch event details using eventid when implemented
        console.log("Event ID:", eventid);
        const fetchEventDetails = async () => {
            const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
            const response = await fetch(`${baseUrl}/events/${eventid}`);
            if (response.ok) {
                const data = await response.json();
                setEventDetails(data);
            } else {
                console.error("Failed to fetch event details");
            }
        };
        fetchEventDetails();
    }, [eventid]);
    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {eventDetails != null ? (
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-8 py-10">
                            <h1 className="text-4xl font-bold text-white">{eventDetails.name}</h1>
                            <p className="mt-2 text-rose-100 text-lg">Hosted by {eventDetails.host}</p>
                        </div>

                        <div className="px-8 py-8 space-y-6">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Date</p>
                                    <p className="mt-1 text-xl text-gray-900">{new Date(eventDetails.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Location</p>
                                    <p className="mt-1 text-xl text-gray-900">{eventDetails.location}</p>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-6">
                                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">About this event</h2>
                                <p className="text-gray-700 text-lg leading-relaxed">{eventDetails.description}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                        <div className="animate-pulse flex flex-col items-center">
                            <div className="w-16 h-16 bg-rose-200 rounded-full mb-4"></div>
                            <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                        </div>
                        <p className="mt-4 text-gray-500">Loading event details...</p>
                    </div>
                )}
            </div>
        </main>
    );
}