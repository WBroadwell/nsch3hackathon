"use client";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-16 flex flex-col items-center">
        <Image
          src="/charitymaplogo.png"
          alt="Logo"
          width={350}
          height={350}
          className="drop-shadow-xl"
        />
        <h1 className="text-5xl font-bold text-gray-800 mt-8 text-center">
          Welcome to <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-500 to-pink-500">Charity Map</span>!
        </h1>
        <p className="mt-6 text-xl text-gray-600 text-center max-w-2xl">
          Connecting volunteers and donors with local opportunities and events in your community.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            href="/events"
            className="px-8 py-4 bg-linear-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition text-center"
          >
            Browse Events
          </Link>
          <Link
            href="/addevent"
            className="px-8 py-4 bg-white text-rose-500 font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition border-2 border-rose-500 text-center"
          >
            Host an Event
          </Link>
        </div>
      </div>
    </main>
  );
}