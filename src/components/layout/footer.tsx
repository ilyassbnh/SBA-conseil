import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0B132B] border-t border-[#D4AF37]/20 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-[#D4AF37]/25 bg-slate-900/50 shadow-md transition-transform group-hover:scale-105 duration-300">
                <Image
                  src="/image_0.png"
                  alt="SBA Conseil Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-wider text-[#D4AF37] uppercase leading-none">
                  SBA Conseil
                </span>
                <span className="text-[9px] text-slate-400 tracking-wider uppercase mt-1">
                  Courtier d'Assurances
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-300 leading-relaxed">
              Cabinet de courtage en assurances de prestige en France. Nous concevons des solutions sur-mesure pour protéger vos biens les plus précieux.
            </p>
          </div>

          {/* Solutions Column */}
          <div>
            <h3 className="text-[#D4AF37] font-semibold text-sm tracking-wider uppercase mb-6">
              Nos Solutions
            </h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="#services" className="hover:text-[#D4AF37] transition-colors">Assurance Automobile</Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-[#D4AF37] transition-colors">Assurance Moto</Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-[#D4AF37] transition-colors">Assurance Trottinette Électrique</Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-[#D4AF37] transition-colors">Santé & Prévoyance</Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-[#D4AF37] transition-colors">Protection Juridique</Link>
              </li>
            </ul>
          </div>

          {/* Cabinet Column */}
          <div>
            <h3 className="text-[#D4AF37] font-semibold text-sm tracking-wider uppercase mb-6">
              Le Cabinet
            </h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="#about" className="hover:text-[#D4AF37] transition-colors">Qui sommes-nous ?</Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-[#D4AF37] transition-colors">Nos Engagements</Link>
              </li>
              <li>
                <Link href="#testimonials" className="hover:text-[#D4AF37] transition-colors">Témoignages</Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-[#D4AF37] transition-colors">Nous Contacter</Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div id="contact">
            <h3 className="text-[#D4AF37] font-semibold text-sm tracking-wider uppercase mb-6">
              Coordonnées
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[#D4AF37] shrink-0" />
                <span>+33 7 57 81 82 31</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[#D4AF37] shrink-0" />
                <span>contact@sba-conseil.fr</span>
              </li>
              <li className="flex items-start gap-3 leading-relaxed">
                <MapPin className="h-5 w-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>66 avenue des champs elysées, 75008 Paris</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#D4AF37]/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} SBA Conseil. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-[#D4AF37] transition-colors">Mentions Légales</Link>
            <Link href="#" className="hover:text-[#D4AF37] transition-colors">Politique de Confidentialité</Link>
            <Link href="#" className="hover:text-[#D4AF37] transition-colors">Gestion des Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
