"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onGetQuoteClick: () => void;
}

export function Header({ onGetQuoteClick }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-40 w-full transition-all duration-300 bg-[#0B132B] border-b border-primary/15 shadow-lg shadow-black/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-22 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-[#D4AF37]/25 bg-slate-900/50 shadow-md transition-transform group-hover:scale-105 duration-300">
            <Image
              src="/image_0.png"
              alt="SBA Conseil Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-wider text-gold-gradient uppercase leading-none">
              SBA Conseil
            </span>
            <span className="text-[9px] text-slate-300 tracking-wider uppercase mt-1">
              Courtier d'Assurances
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#"
            className="text-sm font-medium text-slate-200 hover:text-white transition-colors duration-200"
          >
            Accueil
          </Link>
          <Link
            href="#services"
            className="text-sm font-medium text-slate-200 hover:text-white transition-colors duration-200"
          >
            Nos Services
          </Link>
          <Link
            href="#about"
            className="text-sm font-medium text-slate-200 hover:text-white transition-colors duration-200"
          >
            À Propos
          </Link>
          <Link
            href="#contact"
            className="text-sm font-medium text-slate-200 hover:text-white transition-colors duration-200"
          >
            Contact
          </Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Button
            onClick={onGetQuoteClick}
            className="bg-[#D4AF37] hover:bg-[#c39e2e] text-slate-950 font-semibold rounded-xl px-5 py-2.5 shadow-lg shadow-[#D4AF37]/15 transition-all duration-300 border border-[#D4AF37]/20 cursor-pointer"
          >
            Obtenir mon devis
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-slate-200 hover:bg-white/10 hover:text-white transition-all"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-22 left-0 w-full bg-[#0B132B] border-b border-primary/15 px-4 py-6 flex flex-col gap-5 animate-in slide-in-from-top duration-200 shadow-xl">
          <nav className="flex flex-col gap-4">
            <Link
              href="#"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-base font-medium text-slate-200 hover:text-white py-1 transition-colors"
            >
              Accueil
            </Link>
            <Link
              href="#services"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-base font-medium text-slate-200 hover:text-white py-1 transition-colors"
            >
              Nos Services
            </Link>
            <Link
              href="#about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-base font-medium text-slate-200 hover:text-white py-1 transition-colors"
            >
              À Propos
            </Link>
            <Link
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-base font-medium text-slate-200 hover:text-white py-1 transition-colors"
            >
              Contact
            </Link>
          </nav>
          <Button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onGetQuoteClick();
            }}
            className="bg-[#D4AF37] hover:bg-[#c39e2e] text-slate-950 font-semibold rounded-xl w-full py-3 shadow-md transition-all duration-300 border border-[#D4AF37]/20 cursor-pointer"
          >
            Obtenir mon devis
          </Button>
        </div>
      )}
    </header>
  );
}
