"use client";

import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube, FaSpotify, FaApple } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-[#002F42] py-16 border-t border-gray-300">
            <div className="container mx-auto max-w-5xl px-4">
                {/* Main footer columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
                    {/* Column 1: About Guy Natan (Left for LTR, but visually right in RTL) */}
                    <div>
                        <h4 className="text-xl font-bold text-white mb-4">גיא נתן</h4>
                        <div className="text-white space-y-1">
                            <p>כתב YNET, מרצה, מנהל קרן הגידור Valley</p>
                            <p>יוצר הפודקאסט ״מפת החום״ ובקרוב גם סופר</p>
                            <p>תכנון פיננסי, ליווי משקיעים ומסחר במניות</p>
                        </div>
                    </div>

                    {/* Column 2: Navigation Links (Middle) */}
                    <div className="md:border-l md:border-r md:border-gray-300 md:px-8">
                        <h4 className="text-xl font-bold text-white mb-4">ניווט כללי</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/faq" className="text-white hover:text-[#32a191]">שאלות תשובות</Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-white hover:text-[#32a191]">דברו איתנו</Link>
                            </li>
                            <li>
                                <Link href="/accessibility" className="text-white hover:text-[#32a191]">הצהרת נגישות</Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-white hover:text-[#32a191]">תקנון ותנאי שימוש באתר</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Contact Information (Right for LTR, but visually left in RTL) */}
                    <div>
                        <h4 className="text-xl font-bold text-white mb-4">צרו קשר</h4>
                        <ul className="space-y-3">
                            <li className="text-white">
                                <Link href="tel:054-571-0816" className="hover:text-[#32a191]">054-571-0816</Link>
                            </li>
                            <li className="text-white">
                                <Link href="mailto:office@guynatan.com" className="hover:text-[#32a191]">office@guynatan.com</Link>
                            </li>
                            <li className="text-white">בניין רסיטל מנחם בגין 156, תל אביב</li>
                        </ul>
                        <div className="flex justify-center gap-4 mt-8">
                            <Link href="https://www.facebook.com/guy.natan.fin" className="bg-[#022E41] text-white p-2 rounded-full hover:bg-[#32a191] transition-colors">
                                <FaFacebookF size={18} />
                            </Link>
                            <Link href="https://www.instagram.com/guynatan/" className="bg-[#022E41] text-white p-2 rounded-full hover:bg-[#32a191] transition-colors">
                                <FaInstagram size={18} />
                            </Link>
                            <Link href="https://www.tiktok.com/@guy_natan" className="bg-[#022E41] text-white p-2 rounded-full hover:bg-[#32a191] transition-colors">
                                <FaTiktok size={18} />
                            </Link>
                            <Link href="https://www.youtube.com/@guynatan" className="bg-[#022E41] text-white p-2 rounded-full hover:bg-[#32a191] transition-colors">
                                <FaYoutube size={18} />
                            </Link>
                            <Link href="https://open.spotify.com/show/5CHDJ0c5LF3ThE2G8TLgr2" className="bg-[#022E41] text-white p-2 rounded-full hover:bg-[#32a191] transition-colors">
                                <FaSpotify size={18} />
                            </Link>
                            <Link href="https://podcasts.apple.com/il/podcast/%D7%9E%D7%A4%D7%AA-%D7%94%D7%97%D7%95%D7%9D/id1606746398" className="bg-[#022E41] text-white p-2 rounded-full hover:bg-[#32a191] transition-colors">
                                <FaApple size={18} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Copyright section */}
                <div className="mt-12 pt-6 border-t border-gray-300 text-center">
                    <p className="text-white mb-2 text-sm">האתר עוצב ונבנה על ידי שקד ברששת</p>
                    <p className="text-white font-medium">כל הזכויות שמורות גיא נתן בע״מ © {new Date().getFullYear()}</p>
                </div>
            </div>
        </footer>
    );
}   