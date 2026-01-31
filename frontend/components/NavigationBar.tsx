import Link from "next/dist/client/link";
import Image from "next/image";

export default function NavigationBar() {
  return (
    <div className="w-full bg-gradient-to-r from-rose-500 to-pink-500 shadow-lg">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-8 py-4">
        <Link href="/" className="transition hover:scale-110 hover:opacity-80">
          <Image src="/charitymapheart.png" alt="Charity Map Logo" width={40} height={40} />
        </Link>
        <div className="flex items-center space-x-8">
          <Link href="/events" className="text-lg font-semibold text-white hover:text-rose-100 transition">
            Events
          </Link>
          <Link href="/addevent" className="bg-white text-rose-500 px-4 py-2 rounded-full font-semibold hover:bg-rose-50 transition">
            Add Event
          </Link>
        </div>
      </nav>
    </div>
  );
}