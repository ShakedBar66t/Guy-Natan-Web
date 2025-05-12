"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { FaBars, FaTimes } from "react-icons/fa";
import AdminButton from './AdminButton';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
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

  // All navigation links, including dropdown items
  const navLinks = [
    { href: "/", label: "עמוד הבית" },
    { href: "/podcast", label: "פודקאסט ״מפת החום״", isDropdownItem: true },
    { href: "/blog", label: "הבלוג שלנו", isDropdownItem: true },
    { href: "/ynet", label: "גיא נתן ב - YNET", isDropdownItem: true },
    { href: "/calculator", label: "חישוב ריבית דריבית", isDropdownItem: true },
    { href: "/portfolio", label: "פעימות לתיקי השקעות", isDropdownItem: true },
    { href: "/testimonials", label: "מרוצים וממליצים" },
    { href: "/qna", label: "שאלות תשובות" },
    { href: "/contact", label: "בואו נדבר" },
  ];

  // For desktop view only - dropdown parent
  const dropdownParent = { href: "#", label: "נתחיל מכאן" };

  // Navigate to a page and close the mobile menu
  const handleNavigation = (href: string) => {
    router.push(href);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className={`w-full ${isScrolled ? 'fixed top-0 left-0 right-0 z-[10001] bg-white shadow-md' : 'sticky top-0 z-[10001] bg-white'}`}>
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
                    className="mb-2 w-[70px] h-auto sm:w-[90px]"
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
                
                {/* Home link */}
                {navLinks.filter(link => link.href === "/").map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`hover:underline underline-offset-[10px] ${pathname === link.href ? "underline" : ""}`}
                  >
                    {link.label}
                  </Link>
                ))}
                
                {/* Dropdown menu for desktop - now placed right after Home */}
                <div
                  className="relative"
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <div
                    className="flex items-center cursor-pointer hover:underline underline-offset-[10px]"
                  >
                    {dropdownParent.label}
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
                      {navLinks.filter(item => item.isDropdownItem).map((dropdownItem) => (
                        <Link
                          key={dropdownItem.href}
                          href={dropdownItem.href}
                          className="block px-4 py-2 text-gray-700 hover:bg-[#022E41] hover:text-white text-lg"
                        >
                          {dropdownItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Other non-dropdown links for desktop */}
                {navLinks.filter(link => !link.isDropdownItem && link.href !== "/").map((link) => (
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
                ))}
              </nav>
            </div>
          </div>
        </header>
      </MaxWidthWrapper>
      
      {/* Mobile menu - slides down when burger is clicked */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white p-4 shadow-lg z-[10000]">
          <nav className="flex flex-col space-y-4 text-center">
            {/* Admin Button in mobile menu */}
            <div className="py-2">
              <AdminButton />
            </div>
            
            {/* Flattened mobile menu with all links */}
            {navLinks.map((link) => (
              <div 
                key={link.href} 
                onClick={() => handleNavigation(link.href)}
                className={`block py-2 cursor-pointer ${pathname === link.href ? "font-bold" : ""} ${
                  link.href === "/contact"
                    ? "bg-[#022E41] text-white px-5 py-2 rounded-xl text-center mt-4"
                    : ""
                }`}
              >
                {link.label}
              </div>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
