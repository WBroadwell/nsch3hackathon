import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-gray-800">
            <div className="max-w-6xl mx-auto px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <Image
                            src="/charitymaplogo2.png"
                            alt="Charity Map"
                            width={160}
                            height={32}
                            className="mb-4"
                        />
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Connecting volunteers and donors with local charity events in your community.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-gray-400 hover:text-rose-400 transition text-sm">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/events" className="text-gray-400 hover:text-rose-400 transition text-sm">
                                    Browse Events
                                </Link>
                            </li>
                            <li>
                                <Link href="/addevent" className="text-gray-400 hover:text-rose-400 transition text-sm">
                                    Host an Event
                                </Link>
                            </li>
                            <li>
                                <Link href="/map" className="text-gray-400 hover:text-rose-400 transition text-sm">
                                    Event Map
                                </Link>
                            </li>
                            <li>
                                <Link href="/signin" className="text-gray-400 hover:text-rose-400 transition text-sm">
                                    Organization Sign In
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Project Info */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">About</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Built by William B. for the NSCH3 Hackathon.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-gray-700 text-rose-400 rounded-full text-xs font-medium">Next.js</span>
                            <span className="px-3 py-1 bg-gray-700 text-rose-400 rounded-full text-xs font-medium">Flask</span>
                            <span className="px-3 py-1 bg-gray-700 text-rose-400 rounded-full text-xs font-medium">PostgreSQL</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} Charity Map. All rights reserved.
                    </p>
                    <p className="text-gray-500 text-sm mt-2 sm:mt-0">
                        Made with <span className="text-rose-500">&#10084;</span> for communities everywhere
                    </p>
                </div>
            </div>
        </footer>
    );
}