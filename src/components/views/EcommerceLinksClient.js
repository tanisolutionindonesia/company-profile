"use client";

import Image from "next/image";

const links = [
  {
    title: "Shopee | @tanisolutionindonesia",
    url: "https://id.shp.ee/gEqChd6C",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopee_logo.svg",
    style: "bg-primary text-white hover:bg-green-600",
  },
  {
    title: "Shopee | @tanisolution",
    url: "https://id.shp.ee/r3bke1Dw",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopee_logo.svg",
    style: "bg-primary text-white hover:bg-green-600",
  },
  {
    title: "Shopee | @primegarden_",
    url: "https://id.shp.ee/eSWAytEH",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopee_logo.svg",
    style: "bg-primary text-white hover:bg-green-600",
  },
  {
    title: "TikTok Shop | @tanisolution.id",
    url: "https://www.tiktok.com/@tanisolution.id?_r=1&_t=ZS-958o96lMTvI",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/34/Ionicons_logo-tiktok.svg",
    style: "bg-primary text-white hover:bg-green-600",
  },
  {
    title: "TikTok Shop | @bisnispetani",
    url: "https://www.tiktok.com/@bisnispetani?_r=1&_t=ZS-958oBLi1cAu",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/34/Ionicons_logo-tiktok.svg",
    style: "bg-primary text-white hover:bg-green-600",
  },
];

export default function EcommerceLinksClient() {
  return (
    <main className="min-h-[100dvh] bg-accent flex flex-col items-center py-12 px-6 font-sans">
      <div className="text-center mb-10 animate-fadeInUp">
        <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-md border-2 border-primary relative overflow-hidden p-4">
          <Image
            src="/tani.webp"
            alt="Logo Tani Solution"
            width={80}
            height={80}
            className="object-contain"
            priority
          />
        </div>
        <h1 className="text-2xl font-bold text-secondary tracking-tight">
          Tani Solution E-Commerce
        </h1>
        <p className="text-[10px] text-secondary/60 mt-2 font-bold tracking-[0.2em] uppercase opacity-80">
          Toko Resmi & Partner
        </p>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-4">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${link.style} group flex items-center justify-between p-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all duration-300 hover-lift`}
          >
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl flex items-center justify-center w-12 h-12 border border-white/30 shadow-inner">
                <Image
                  src={link.logo}
                  alt={link.title}
                  width={48}
                  height={48}
                  className="w-full h-full object-contain filter brightness-0 invert grayscale drop-shadow-sm"
                />
              </div>
              <span className="font-bold text-base tracking-wide whitespace-nowrap">
                {link.title}
              </span>
            </div>

            <svg
              className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        ))}
      </div>

      <footer className="mt-auto pt-16">
        <div className="flex flex-col items-center gap-2">
          <span className="h-px w-8 bg-primary mb-2"></span>
          <p className="text-[10px] text-secondary/40 font-black tracking-widest uppercase">
            tanisolution.id/ecommerce
          </p>
        </div>
      </footer>
    </main>
  );
}
