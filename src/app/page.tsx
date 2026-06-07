"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { InsuranceModal } from "@/components/insurance-modal";
import { Button } from "@/components/ui/button";
import {
  Car,
  Shield,
  Clock,
  ThumbsUp,
  Headphones,
  ArrowRight,
  Star,
  Check,
} from "lucide-react";

// Custom SVG Scooter Icon
const ScooterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <circle cx="5" cy="18" r="2.5" />
    <circle cx="19" cy="18" r="2.5" />
    <path d="M5 15.5h3.5l2-6.5H8.5" />
    <path d="M19 15.5h-5.5L11 8.5" />
    <path d="M10 8.5h3" />
    <path d="M11.5 8.5v2" />
  </svg>
);

// Custom SVG Motorcycle Icon
const MotoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="18" r="3" />
    <path d="M9 18h6" />
    <path d="M12 12v3" />
    <path d="M6 15l4-6h5l3 6" />
    <path d="M9 9l-1.5-2.5h2.5" />
    <path d="M14 9l1.5 3.5" />
  </svg>
);

// Specific line-art icons from the logo
const LogoHouseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const LogoShieldPulseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M8.5 12h2.5l1.2-2.5 1.2 5 1.1-2.5h2" />
  </svg>
);

const LogoCheckedDocumentIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeChoiceId, setActiveChoiceId] = useState<string | undefined>(undefined);

  const handleOpenModal = (choiceId?: string) => {
    setActiveChoiceId(choiceId);
    setIsModalOpen(true);
  };

  const vehicleOffers = [
    {
      id: "trottinette",
      title: "Trottinette Électrique",
      description: "Responsabilité civile obligatoire, protection contre le vol, les dommages corporels et matériels en ville.",
      icon: ScooterIcon,
      accentBg: "bg-primary/10",
      accentText: "text-primary",
    },
    {
      id: "auto",
      title: "Automobile",
      description: "Couverture Tous Risques haut de gamme, valeur à neuf garantie et assistance panne 0 km personnalisée.",
      icon: Car,
      accentBg: "bg-primary/10",
      accentText: "text-primary",
    },
    {
      id: "moto",
      title: "Moto",
      description: "Garanties tous types de cylindrées, protection équipements du motard, vol et assistance rapatriement.",
      icon: MotoIcon,
      accentBg: "bg-primary/10",
      accentText: "text-primary",
    },
  ];

  const widerPortfolio = [
    {
      title: "Votre Patrimoine & Habitation",
      description: "Protection complète pour vos villas, résidences secondaires, appartements de standing et collections d'art.",
      icon: LogoHouseIcon,
    },
    {
      title: "Votre Santé & Prévoyance",
      description: "Mutuelles haut de gamme et couvertures prévoyance adaptées aux dirigeants, professions libérales et particuliers.",
      icon: LogoShieldPulseIcon,
    },
    {
      title: "Votre Protection & Documents",
      description: "Garanties d'assistance juridique complète et sécurisation administrative de vos documents clés.",
      icon: LogoCheckedDocumentIcon,
    },
  ];

  const features = [
    {
      title: "Couverture sur-mesure",
      description: "Nous ajustons précisément les limites de vos garanties pour ne couvrir que vos besoins réels de prestige.",
      icon: Shield,
    },
    {
      title: "Assistance Premium 24h/24",
      description: "Un sinistre au milieu de la nuit ? Nos équipes répondent présentes instantanément pour vous assister.",
      icon: Clock,
    },
    {
      title: "Indemnisation d'excellence",
      description: "Bénéficiez de délais d'indemnisation ultra-rapides et simplifiés grâce à nos partenariats exclusifs.",
      icon: ThumbsUp,
    },
    {
      title: "Conseillers dédiés",
      description: "Un interlocuteur unique et hautement qualifié pour piloter l'intégralité de vos contrats de courtage.",
      icon: Headphones,
    },
  ];

  const testimonials = [
    {
      quote: "SBA Conseil a simplifié toutes mes démarches d'assurance. J'ai obtenu un contrat sur-mesure exceptionnel pour ma voiture de collection à un tarif parfaitement étudié.",
      author: "Jean-Christophe R.",
      role: "Chef d'entreprise, Paris",
      rating: 5,
    },
    {
      quote: "Leur formule d'assurance trottinette électrique est parfaite pour mes déplacements quotidiens. Une réactivité exemplaire et une gestion 100% digitale très fluide.",
      author: "Mathilde D.",
      role: "Directrice Marketing, Lyon",
      rating: 5,
    },
    {
      quote: "Suite à un sinistre sur ma moto, SBA Conseil a géré mon dossier avec un professionnalisme hors pair. Le versement des indemnités a été effectué sous 5 jours.",
      author: "Pierre B.",
      role: "Architecte, Bordeaux",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header onGetQuoteClick={() => handleOpenModal()} />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-24 sm:pb-32 lg:pt-28 lg:pb-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full mb-8 animate-fade-in backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                🏆 Courtier en Assurances de Prestige
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight max-w-5xl mx-auto">
              <span className="text-gold-gradient block mb-3">SBA CONSEIL</span>
              <span className="text-silver-gradient block text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wider uppercase mt-4">
                "ENSEMBLE, CONSTRUISONS VOTRE AVENIR ASSURÉ"
              </span>
            </h1>

            <p className="mt-8 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
              L'excellence du courtage pour vos véhicules d'exception et du quotidien. Sélectionnez votre couverture et obtenez votre devis personnalisé en moins de 2 minutes.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
              <Button
                onClick={() => handleOpenModal()}
                className="w-full sm:w-auto bg-gold-gradient hover:opacity-90 text-primary-foreground text-base font-bold py-5 px-9 rounded-xl shadow-lg shadow-primary/15 transition-all duration-300 flex items-center justify-center gap-2 group border border-primary/20 cursor-pointer"
              >
                Obtenir un devis personnalisé
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto border-primary/20 hover:border-primary/50 text-slate-300 hover:text-white bg-slate-900/40 hover:bg-slate-900/80 font-bold text-base py-5 px-9 rounded-xl shadow-sm transition-all duration-200 cursor-pointer backdrop-blur-sm"
              >
                Découvrir nos offres
              </Button>
            </div>

            {/* Quick Metrics */}
            <div className="mt-20 sm:mt-24 border-t border-primary/10 pt-10 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <p className="text-3xl sm:text-4xl font-extrabold text-white">10+ Ans</p>
                <p className="text-xs font-semibold text-primary uppercase tracking-widest mt-2">D'Expertise</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-extrabold text-white">99,2%</p>
                <p className="text-xs font-semibold text-primary uppercase tracking-widest mt-2">De Satisfaction</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-extrabold text-white">&lt; 2 Min</p>
                <p className="text-xs font-semibold text-primary uppercase tracking-widest mt-2">Devis En Ligne</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-extrabold text-white">24h/24</p>
                <p className="text-xs font-semibold text-primary uppercase tracking-widest mt-2">Conseillers Dédiés</p>
              </div>
            </div>
          </div>
        </section>

        {/* Vehicle Insurances Choices */}
        <section id="services" className="py-24 sm:py-32 bg-slate-950/40 border-y border-primary/10 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
              <h2 className="text-sm font-bold text-primary uppercase tracking-widest">Nos Offres Mobilité</h2>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Assurances Véhicules Sur-Mesure
              </h2>
              <p className="text-slate-400 leading-relaxed font-light">
                Sélectionnez le type de véhicule pour lequel vous souhaitez recevoir une étude tarifaire personnalisée par nos experts de courtage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {vehicleOffers.map((offer) => {
                const IconComponent = offer.icon;
                return (
                  <div
                    key={offer.id}
                    className="glass-card glass-card-hover p-8 rounded-2xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="inline-flex p-3.5 rounded-xl bg-primary/10 text-primary mb-6">
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3 text-gold-gradient">
                        {offer.title}
                      </h3>
                      <p className="text-slate-300 text-sm leading-relaxed mb-8 font-light font-sans">
                        {offer.description}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleOpenModal(offer.id)}
                      className="w-full bg-slate-900 hover:bg-gold-gradient text-white hover:text-primary-foreground border border-primary/25 rounded-xl py-3 font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 group/btn cursor-pointer"
                    >
                      Obtenir un devis {offer.title.split(" ")[0]}
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Wider Portfolio Services Section (with specific icons from logo) */}
        <section className="py-24 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
              <h2 className="text-sm font-bold text-primary uppercase tracking-widest">Une Expertise Globale</h2>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Votre Patrimoine & Personne Protégés
              </h2>
              <p className="text-slate-400 leading-relaxed font-light">
                SBA Conseil vous propose un accompagnement complet au-delà de la mobilité, couvrant toutes les dimensions de votre sécurité.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {widerPortfolio.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={idx}
                    className="glass-card p-8 rounded-2xl border border-primary/10 flex flex-col items-center text-center space-y-4 shadow-lg"
                  >
                    <div className="p-4 rounded-full bg-primary/10 text-primary mb-2">
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-bold text-white text-gold-gradient">{item.title}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed font-light">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features / Why Us Section */}
        <section id="about" className="py-24 sm:py-32 bg-slate-950/30 border-t border-primary/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
              <div className="space-y-6 lg:col-span-1">
                <div className="inline-flex bg-primary/10 border border-primary/20 px-3 py-1 rounded-full text-xs font-semibold text-primary uppercase tracking-widest">
                  Pourquoi SBA Conseil
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
                  L'exigence d'un courtier d'exception
                </h2>
                <p className="text-slate-300 leading-relaxed font-light">
                  Nous nous positionnons à l'intersection entre tradition, réactivité et innovation digitale, pour structurer vos contrats d'assurances autour d'une transparence absolue.
                </p>
                <ul className="space-y-4 pt-2">
                  {[
                    "Aucun frais administratif dissimulé",
                    "Ajustement des plafonds de couverture à tout moment",
                    "Règlement rapide des indemnités de sinistre"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                      <div className="bg-primary text-primary-foreground p-0.5 rounded-full shrink-0">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:col-span-2">
                {features.map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={idx}
                      className="glass-card p-6.5 rounded-2xl hover:border-primary/30 transition-all duration-300"
                    >
                      <div className="bg-primary/10 text-primary p-3 rounded-xl inline-flex mb-4">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed font-light">{feature.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-24 sm:py-32 bg-slate-950/40 border-y border-primary/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
              <h2 className="text-sm font-bold text-primary uppercase tracking-widest">Témoignages Clients</h2>
              <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Ils nous font confiance
              </p>
              <p className="text-slate-400 leading-relaxed font-light">
                Découvrez les retours d'expérience de nos assurés quant à la qualité de notre accompagnement et la rapidité de gestion de leurs garanties.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t, idx) => (
                <div
                  key={idx}
                  className="glass-card p-8 rounded-2xl flex flex-col justify-between relative hover:border-primary/35 transition-all duration-300"
                >
                  <div className="space-y-5">
                    {/* Stars */}
                    <div className="flex gap-1 text-primary">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="h-4.5 w-4.5 fill-current" />
                      ))}
                    </div>
                    <p className="text-slate-300 italic text-sm leading-relaxed font-light">
                      "{t.quote}"
                    </p>
                  </div>
                  <div className="border-t border-primary/10 mt-6 pt-5 flex flex-col">
                    <span className="font-bold text-white text-sm">{t.author}</span>
                    <span className="text-xs text-slate-400 mt-1">{t.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Bottom Banner */}
        <section className="bg-slate-950 text-white py-20 sm:py-24 relative overflow-hidden border-t border-primary/15">
          <div className="absolute inset-0 bg-primary/5 [mask-image:radial-gradient(circle_at_bottom_right,#000_30%,transparent_100%)] pointer-events-none" />
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-gold-gradient">
              Prêt à sécuriser votre avenir avec sérénité ?
            </h2>
            <p className="text-slate-300 max-w-xl mx-auto text-base sm:text-lg font-light">
              Définissez vos garanties personnalisées en 2 minutes en ligne ou contactez un conseiller expert pour une étude patrimoniale complète.
            </p>
            <div className="pt-4">
              <Button
                onClick={() => handleOpenModal()}
                className="bg-gold-gradient hover:opacity-90 text-primary-foreground font-bold py-5 px-9 rounded-xl shadow-lg shadow-primary/15 transition-all duration-300 inline-flex items-center gap-2 border border-primary/20 cursor-pointer"
              >
                Demander mon devis maintenant
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <InsuranceModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        defaultChoiceId={activeChoiceId}
      />
    </div>
  );
}
