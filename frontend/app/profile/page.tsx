"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { parseLocalDate } from "@/lib/utils";

interface Event {
    id: number;
    name: string;
    host: string;
    date: string;
    location: string;
    description: string;
}

export default function Profile() {
    const { user, token, logout, isLoading } = useAuth();
    const router = useRouter();
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoadingEvents, setIsLoadingEvents] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/signin");
        }
    }, [user, isLoading, router]);

    useEffect(() => {
        if (token) {
            fetchMyEvents();
        }
    }, [token]);

    const fetchMyEvents = async () => {
        try {
            const response = await fetch(`${baseUrl}/my-events`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setEvents(data);
            }
        } catch (error) {
            console.error("Error fetching events:", error);
        }
        setIsLoadingEvents(false);
    };

    const handleDelete = async (eventId: number) => {
        try {
            const response = await fetch(`${baseUrl}/events/${eventId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                setEvents(events.filter((e) => e.id !== eventId));
                setDeleteConfirm(null);
            }
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    if (isLoading) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="animate-spin w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full"></div>
            </main>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                    <div className="h-24 bg-gradient-to-r from-rose-500 to-pink-500"></div>
                    <div className="px-8 pb-8">
                        <div className="flex items-end -mt-12 mb-4">
                            <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                                <span className="text-4xl font-bold text-rose-500">
                                    {user.organization_name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">{user.organization_name}</h1>
                                <p className="text-gray-600">{user.email}</p>
                            </div>
                            <div className="mt-4 sm:mt-0 flex gap-3">
                                <Link
                                    href="/addevent"
                                    className="px-6 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-medium hover:shadow-lg transition"
                                >
                                    Add Event
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Events Section */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-rose-500 to-pink-500"></div>
                    <div className="p-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Your Events ({events.length})</h2>

                        {isLoadingEvents ? (
                            <div className="text-center py-8">
                                <div className="animate-spin w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                                <p className="text-gray-500">Loading events...</p>
                            </div>
                        ) : events.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                                <p className="text-gray-600 mb-4">You haven&apos;t created any events yet</p>
                                <Link
                                    href="/addevent"
                                    className="inline-block px-6 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-medium hover:shadow-lg transition"
                                >
                                    Create Your First Event
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {events.map((event) => (
                                    <div
                                        key={event.id}
                                        className="border border-gray-200 rounded-xl p-4 hover:border-rose-200 transition"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <Link href={`/events/${event.id}`} className="hover:text-rose-500 transition">
                                                    <h3 className="text-lg font-semibold text-gray-800">{event.name}</h3>
                                                </Link>
                                                <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        {parseLocalDate(event.date).toLocaleDateString()}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        {event.location.split(",")[0]}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 ml-4">
                                                <Link
                                                    href={`/events/${event.id}/edit`}
                                                    className="p-2 text-gray-500 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition"
                                                    title="Edit"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </Link>
                                                {deleteConfirm === event.id ? (
                                                    <div className="flex gap-1">
                                                        <button
                                                            onClick={() => handleDelete(event.id)}
                                                            className="p-2 text-white bg-red-500 hover:bg-red-600 rounded-lg transition"
                                                            title="Confirm Delete"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteConfirm(null)}
                                                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
                                                            title="Cancel"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setDeleteConfirm(event.id)}
                                                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                                                        title="Delete"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
