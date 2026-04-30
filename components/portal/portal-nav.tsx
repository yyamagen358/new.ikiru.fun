"use client";

import { useState } from "react";

const navLinks = [
  { label: "スピリチュアル", href: "#streams" },
  { label: "ASIへの道", href: "#streams" },
  { label: "Twin Ray", href: "https://twinrayclub.com/ja" },
  { label: "SoulMission", href: "https://soulmission358.com" },
  { label: "図書館", href: "https://yyamagen358.github.io/asaichi-skills/toshokan.html" },
  { label: "朝市", href: "https://yyamagen358.github.io/asaichi-skills/" },
];

export function PortalNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[68px] flex items-center justify-between px-6 [@media(min-width:900px)]:px-12 bg-portal-cream/92 backdrop-blur-[12px] border-b border-portal-amber/15 animate-portal-fade-in">
      <a href="/portal" className="font-serif text-[1.4rem] font-bold tracking-[0.04em] text-portal-text-dark leading-none select-none">
        AI{" "}
        <span className="bg-gradient-to-br from-portal-rose to-portal-amber bg-clip-text text-transparent">
          Nation
        </span>
      </a>

      <ul className="hidden [@media(min-width:900px)]:flex items-center gap-9 list-none">
        {navLinks.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="relative font-round text-[0.88rem] font-medium tracking-[0.03em] text-portal-text-mid transition-colors duration-200 hover:text-portal-amber-deep pb-[3px] group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-gradient-to-r from-portal-rose to-portal-amber transition-all duration-300 group-hover:w-full" />
            </a>
          </li>
        ))}
      </ul>

      <a
        href="https://twinrayclub.com/ja"
        className="hidden [@media(min-width:900px)]:inline-flex items-center font-round text-[0.85rem] font-bold tracking-[0.05em] text-white px-6 py-[10px] rounded-full bg-gradient-to-br from-portal-rose to-portal-amber shadow-[0_4px_16px_rgba(212,132,138,0.35)] transition-transform duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(212,132,138,0.45)]"
      >
        無料で始める
      </a>

      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="[@media(min-width:900px)]:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px] cursor-pointer"
        aria-label="メニューを開く"
      >
        <span className={`block w-5 h-[2px] bg-portal-text-dark rounded-full transition-all duration-300 ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
        <span className={`block w-5 h-[2px] bg-portal-text-dark rounded-full transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
        <span className={`block w-5 h-[2px] bg-portal-text-dark rounded-full transition-all duration-300 ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
      </button>

      {menuOpen && (
        <div className="[@media(min-width:900px)]:hidden fixed inset-0 top-[68px] bg-portal-cream/98 backdrop-blur-md z-40 animate-portal-fade-in">
          <div className="flex flex-col items-center pt-12 gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-round text-[1.1rem] font-medium text-portal-text-mid tracking-[0.04em] transition-colors duration-200 hover:text-portal-amber-deep"
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://twinrayclub.com/ja"
              onClick={() => setMenuOpen(false)}
              className="mt-4 inline-flex items-center font-round text-[1rem] font-bold tracking-[0.05em] text-white px-8 py-3 rounded-full bg-gradient-to-br from-portal-rose to-portal-amber shadow-[0_4px_16px_rgba(212,132,138,0.35)]"
            >
              無料で始める
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
