"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { FaBars, FaTimes } from "react-icons/fa";
import AdminButton from './AdminButton';

export default function Header() {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll event to apply sticky styles
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "עמוד הבית" },
    { href: "#", label: "נתחיל מכאן", isDropdown: true },
    { href: "/services", label: "מרוצים וממליצים" },
    { href: "/qna", label: "שאלות תשובות" },
    { href: "/contact", label: "בואו נדבר" },
  ];

  return (
    <div className={`w-full ${isScrolled ? 'fixed top-0 left-0 right-0 z-[10000] bg-white shadow-md' : 'relative z-[10000]'}`}>
      <MaxWidthWrapper>
        <header dir="rtl" className="w-full text-black py-3">
          <div>
            <div className="flex flex-row-reverse justify-between items-center">
              {/* Logo - Now on the left side */}
              <div className="order-1">
                <Link href="/">
                  <img
                    src="https://res.cloudinary.com/drld1bejg/image/upload/v1742985367/GuyNatanLogo_fkhh8t.png"
                    alt="Guy Natan Logo"
                    width={90}
                    height={90}
                    className="mb-2"
                  />
                </Link>
              </div>
              
              {/* Burger menu button - only visible on mobile and tablet */}
              <div className="lg:hidden order-2">
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-[#022E41] p-2 focus:outline-none"
                >
                  {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
              </div>
              
              {/* Desktop navigation - hidden on mobile and tablet */}
              <nav className="hidden lg:flex flex-wrap items-center gap-10 text-xl text-[#022E41] order-3">
                {/* Admin Button - Only shows when admin is logged in */}
                <div className="ml-4">
                  <AdminButton />
                </div>
                
                {navLinks.map((link) => {
                  if (link.isDropdown) {
                    return (
                      <div
                        key={link.href}
                        className="relative"
                        onMouseEnter={() => setIsDropdownOpen(true)}
                        onMouseLeave={() => setIsDropdownOpen(false)}
                      >
                        <div
                          className={`flex items-center cursor-pointer hover:underline underline-offset-[10px] ${pathname === link.href ? "underline" : ""}`}
                        >
                          {link.label}
                          <svg
                            className="mr-1 h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                        {isDropdownOpen && (
                          <div className="absolute right-0 mt-0 w-60 flex-col gap-1 rounded bg-white p-2 shadow-lg z-50">
                            <Link
                              href="/podcast"
                              className="block px-4 py-2 text-gray-700 hover:bg-[#022E41] hover:text-white text-lg"
                            >
                              פודקאסט ״מפת החום״
                            </Link>
                            <Link
                              href="/blog"
                              className="block px-4 py-2 text-gray-700 hover:bg-[#022E41] hover:text-white text-lg"
                            >
                              הבלוג שלנו
                            </Link>
                            <Link
                              href="/ynet"
                              className="block px-4 py-2 text-gray-700 hover:bg-[#022E41] hover:text-white text-lg"
                            >
                              גיא נתן ב - YNET
                            </Link>
                            <Link
                              href="/calculator"
                              className="block px-4 py-2 text-gray-700 hover:bg-[#022E41] hover:text-white text-lg"
                            >
                              חישוב ריבית דריבית
                            </Link>
                            <Link
                              href="/portfolio"
                              className="block px-4 py-2 text-gray-700 hover:bg-[#022E41] hover:text-white text-lg"
                            >
                              פעימות לתיקי השקעות
                            </Link>
                          </div>
                        )}
                      </div>
                    );
                  } else {
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`hover:underline underline-offset-[10px] ${pathname === link.href ? "underline" : ""} ${
                          link.href === "/contact"
                            ? "bg-[#022E41] text-white px-5 py-2 border border-2 rounded-xl hover:no-underline hover:bg-white hover:text-[#022E41] hover:border-[#022E41] no-underline"
                            : ""
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  }
                })}
              </nav>
            </div>
          </div>
        </header>
      </MaxWidthWrapper>
      
      {/* Mobile menu - slides down when burger is clicked */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white p-4 shadow-lg z-[10000]">
          <nav className="flex flex-col space-y-4">
            {/* Admin Button in mobile menu */}
            <div className="py-2">
              <AdminButton />
            </div>
            
            {navLinks.map((link) => {
              if (link.isDropdown) {
                return (
                  <div key={link.href}>
                    <button 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={`flex items-center justify-between w-full py-2 ${
                        pathname === link.href ? "font-bold" : ""
                      }`}
                    >
                      <span>{link.label}</span>
                      <svg
                        className={`h-4 w-4 transform transition-transform ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {isDropdownOpen && (
                      <div className="pl-4 mt-2 border-r-2 border-gray-300">
                        <Link
                          href="/podcast"
                          className="block py-2 text-gray-700 hover:text-[#022E41]"
                        >
                          פודקאסט ״מפת החום״
                        </Link>
                        <Link
                          href="/blog"
                          className="block py-2 text-gray-700 hover:text-[#022E41]"
                        >
                          הבלוג שלנו
                        </Link>
                        <Link
                          href="/ynet"
                          className="block py-2 text-gray-700 hover:text-[#022E41]"
                        >
                          גיא נתן ב - YNET
                        </Link>
                        <Link
                          href="/calculator"
                          className="block py-2 text-gray-700 hover:text-[#022E41]"
                        >
                          חישוב ריבית דריבית
                        </Link>
                        <Link
                          href="/portfolio"
                          className="block py-2 text-gray-700 hover:text-[#022E41]"
                        >
                          פעימות לתיקי השקעות
                        </Link>
                      </div>
                    )}
                  </div>
                );
              } else {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block py-2 ${pathname === link.href ? "font-bold" : ""} ${
                      link.href === "/contact"
                        ? "bg-[#022E41] text-white px-5 py-2 rounded-xl text-center mt-4"
                        : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              }
            })}
          </nav>
        </div>
      )}
    </div>
  );
}
