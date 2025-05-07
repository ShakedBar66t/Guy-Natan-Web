'use client';

import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsAppButton() {
  const whatsappUrl = "https://web.whatsapp.com/send?phone=972552655305&text=%D7%94%D7%99%D7%99%20%D7%92%D7%99%D7%90%2C%20%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%A4%D7%A8%D7%98%D7%99%D7%9D%20%D7%A2%D7%9C%20%D7%94%D7%AA%D7%95%D7%9B%D7%A0%D7%99%D7%AA%20%D7%9C%D7%99%D7%95%D7%95%D7%99%20%D7%A9%D7%9C%D7%9A";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors duration-300"
      aria-label="צור קשר בוואטסאפ"
    >
      <FaWhatsapp className="w-6 h-6" />
    </a>
  );
} 