"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { NewEvent } from "@/types/NewEvent";

export default function AddEvent() {
    const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);

    async function addEvent(data: any) {
        // Placeholder for any data fetching logic if needed in the future
        console.log("Submitting event data:", data);
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
        try {
                const res = await fetch(`${baseUrl}/events`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: data.eventName,
                    host: data.eventHost,
                    date: data.date,
                    location: data.location,
                    description: data.description,
                }),
            }).then((res) => res.json());
            setSubmissionStatus("Successfully added event.");
        } catch (error) {
            console.error("Error during fetch:", error);
            setSubmissionStatus("Error adding event.");
            return;
        }
    };

    const {
        register, handleSubmit, formState: { errors },
    } = useForm<NewEvent>({
        defaultValues: {
            eventName: "",
            eventHost: "",
            date: new Date(),
            location: "",
            description: "",
        }
    });

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">
                        Host a <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">Charity Event</span>
                    </h1>
                    <p className="mt-3 text-gray-600">Share your event with the community</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-rose-500 to-pink-500"></div>
                    <form className="p-8 space-y-6" onSubmit={handleSubmit(addEvent)}>
                        <div className="flex flex-col">
                            <label className="mb-2 text-sm font-medium text-gray-700">Event Name</label>
                            <input
                                type="text"
                                id="eventName"
                                className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition"
                                placeholder="Give your event a name"
                                {...register("eventName", { required: true })}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-2 text-sm font-medium text-gray-700">Host / Organization</label>
                            <input
                                type="text"
                                id="eventHost"
                                className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition"
                                placeholder="Who is hosting this event?"
                                {...register("eventHost", { required: true })}
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex flex-col">
                                <label className="mb-2 text-sm font-medium text-gray-700">Date</label>
                                <input
                                    type="date"
                                    id="date"
                                    className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition"
                                    {...register("date", { required: true })}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-2 text-sm font-medium text-gray-700">Location</label>
                                <input
                                    type="text"
                                    id="location"
                                    className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition"
                                    placeholder="Where is it happening?"
                                    {...register("location", { required: true })}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-2 text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                id="description"
                                className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition resize-none"
                                placeholder="Tell people what this event is about..."
                                rows={4}
                                {...register("description", { required: false })}
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl p-4 font-semibold hover:shadow-lg hover:scale-[1.02] transition"
                        >
                            Create Event
                        </button>
                        {submissionStatus && (
                            <div className={`p-4 rounded-xl text-center font-medium ${
                                submissionStatus === "Successfully added event."
                                    ? "bg-green-50 text-green-600 border border-green-200"
                                    : "bg-red-50 text-red-600 border border-red-200"
                            }`}>
                                {submissionStatus}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </main>
    );
}