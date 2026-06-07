import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0B132B] border-t border-primary/15 text-slate-300">
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
                <span className="font-bold text-lg tracking-wider text-gold-gradient uppercase leading-none">
                  SBA Conseil
                </span>
                <span className="text-[9px] text-slate-300 tracking-wider uppercase mt-1">
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
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-6">
              Nos Solutions
            </h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="#services" className="hover:text-primary transition-colors">Assurance Automobile</Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-primary transition-colors">Assurance Moto</Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-primary transition-colors">Assurance Trottinette Électrique</Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-primary transition-colors">Santé & Prévoyance</Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-primary transition-colors">Protection Juridique</Link>
              </li>
            </ul>
          </div>

          {/* Cabinet Column */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-6">
              Le Cabinet
            </h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="#about" className="hover:text-primary transition-colors">Qui sommes-nous ?</Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-primary transition-colors">Nos Engagements</Link>
              </li>
              <li>
                <Link href="#testimonials" className="hover:text-primary transition-colors">Témoignages</Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-primary transition-colors">Nous Contacter</Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div id="contact">
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-6">
              Coordonnées
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span>+33 (0)1 80 40 00 00</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span>contact@sba-conseil.fr</span>
              </li>
              <li className="flex items-start gap-3 leading-relaxed">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>8 Rue de la Paix<br />75002 Paris, France</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary/15 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>&copy; {new Date().getFullYear()} SBA Conseil. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-primary transition-colors">Mentions Légales</Link>
            <Link href="#" className="hover:text-primary transition-colors">Politique de Confidentialité</Link>
            <Link href="#" className="hover:text-primary transition-colors">Gestion des Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
