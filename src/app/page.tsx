"use client";

import React, { useState, useEffect } from "react";
import { getClientMetadata } from "@/lib/metadata";
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
  Heart,
  Wrench,
  X,
  ArrowLeft,
  Loader2,
  CheckCircle,
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

const formatTelephone = (val: string): string => {
  const digitsOnly = val.replace(/\D/g, "");
  let remainingDigits = "";
  if (digitsOnly.startsWith("33")) {
    remainingDigits = digitsOnly.slice(2);
  } else {
    if (digitsOnly.startsWith("0")) {
      remainingDigits = digitsOnly.slice(1);
    } else {
      remainingDigits = digitsOnly;
    }
  }
  remainingDigits = remainingDigits.slice(0, 9);
  return "+33 " + remainingDigits.replace(/(\d)(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5").trim();
};

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeChoiceId, setActiveChoiceId] = useState<string | undefined>(undefined);
  const [toast, setToast] = useState<string | null>(null);

  // Health Insurance (Mutuelle) Modal State
  const [isMutuelleOpen, setIsMutuelleOpen] = useState(false);
  const [mutuelleStep, setMutuelleStep] = useState(1);
  const [isMutuelleSubmitting, setIsMutuelleSubmitting] = useState(false);
  const [mutuelleSuccess, setMutuelleSuccess] = useState(false);

  // Health Insurance Form Fields State
  const [genre, setGenre] = useState<string | null>(null);
  const [quiAssurer, setQuiAssurer] = useState<string | null>(null);
  const [activite, setActivite] = useState<string | null>(null);
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [adresse, setAdresse] = useState("");
  const [codePostal, setCodePostal] = useState("");
  const [telephone, setTelephone] = useState("+33 ");
  const [email, setEmail] = useState("");

  // Step 7 Scheduling State
  const [callPreference, setCallPreference] = useState<"15min" | "30min" | "custom" | null>(null);
  const [callDate, setCallDate] = useState("");
  const [callHour, setCallHour] = useState("");
  const [callMinute, setCallMinute] = useState("");

  const [mutuelleError, setMutuelleError] = useState<string | null>(null);

  const showToastNotification = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleOpenModal = (choiceId?: string) => {
    if (choiceId === "sante") {
      setMutuelleStep(1);
      setGenre(null);
      setQuiAssurer(null);
      setActivite(null);
      setPrenom("");
      setNom("");
      setDateNaissance("");
      setAdresse("");
      setCodePostal("");
      setTelephone("+33 ");
      setEmail("");
      setCallPreference(null);
      setCallDate("");
      setCallHour("");
      setCallMinute("");
      setMutuelleError(null);
      setMutuelleSuccess(false);
      setIsMutuelleOpen(true);
      return;
    }
    if (choiceId === "emprunteur" || choiceId === "fad") {
      showToastNotification("Ce service n'est pas encore disponible en ligne. Veuillez nous contacter.");
      return;
    }
    setActiveChoiceId(choiceId);
    setIsModalOpen(true);
  };

  const getStepTitle = (s: number) => {
    switch (s) {
      case 1:
        return "Vous êtes ?";
      case 2:
        return "Qui souhaitez-vous assurer ?";
      case 3:
        return "Quelle est votre activité ?";
      case 4:
        return "Votre profil";
      case 5:
        return "Votre adresse";
      case 6:
        return "Vos Coordonnées";
      case 7:
        return "Planifier votre appel";
      default:
        return "";
    }
  };

  const activities = [
    "Salarié",
    "Sans emploi",
    "Retraité ancien salarié",
    "Fonctionnaire d'état",
    "Travailleurs Non Salariés, Autoentrepreneur",
    "Fonctionnaire territorial",
    "Fonctionnaire hospitalier",
    "Étudiant",
    "Alsace-Moselle",
    "Travailleurs Non Salariés, Profession libérale",
    "Retraité ancien travailleur non salarié",
    "Travailleurs Non Salariés, Chef d'entreprise",
    "Travailleurs Non Salariés, Artisan",
    "Travailleurs Non Salariés, Commerçant",
    "Salarié Agricole",
    "Exploitant Agricole",
  ];

  const minAgeDate = new Date(new Date().setFullYear(new Date().getFullYear() - 25)).toISOString().split('T')[0];

  const handleNextStep = () => {
    setMutuelleError(null);
    if (mutuelleStep === 1) {
      if (!genre) {
        setMutuelleError("Veuillez sélectionner votre genre pour continuer.");
        return;
      }
    } else if (mutuelleStep === 2) {
      if (!quiAssurer) {
        setMutuelleError("Veuillez sélectionner qui vous souhaitez assurer.");
        return;
      }
    } else if (mutuelleStep === 3) {
      if (!activite) {
        setMutuelleError("Veuillez sélectionner votre activité.");
        return;
      }
    } else if (mutuelleStep === 4) {
      if (!prenom.trim()) {
        setMutuelleError("Le prénom est requis.");
        return;
      }
      if (!nom.trim()) {
        setMutuelleError("Le nom est requis.");
        return;
      }
      if (!dateNaissance) {
        setMutuelleError("La date de naissance est requise.");
        return;
      }
      if (dateNaissance > minAgeDate) {
        setMutuelleError("Vous devez être âgé d'au moins 25 ans.");
        return;
      }
    } else if (mutuelleStep === 5) {
      if (!adresse.trim()) {
        setMutuelleError("L'adresse est requise.");
        return;
      }
      if (!/^\d{5}$/.test(codePostal)) {
        setMutuelleError("Le code postal doit contenir exactement 5 chiffres.");
        return;
      }
    } else if (mutuelleStep === 6) {
      const cleanPhone = telephone.replace(/\D/g, "");
      if (!cleanPhone || cleanPhone.length < 11) {
        setMutuelleError("Le numéro de téléphone doit être valide (Country code + 9 chiffres).");
        return;
      }
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setMutuelleError("Une adresse e-mail valide est requise.");
        return;
      }
    }
    setMutuelleStep(mutuelleStep + 1);
  };

  const handlePrevStep = () => {
    setMutuelleError(null);
    if (mutuelleStep > 1) {
      setMutuelleStep(mutuelleStep - 1);
    }
  };

  const handleMutuelleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMutuelleError(null);

    if (!callPreference) {
      setMutuelleError("Veuillez choisir une option de rappel.");
      return;
    }

    if (callPreference === "custom") {
      if (!callDate || !callHour || !callMinute) {
        setMutuelleError("Veuillez sélectionner une date, une heure et les minutes pour le rappel.");
        return;
      }
    }

    setIsMutuelleSubmitting(true);

    try {
      const finalCallTime = callHour && callMinute ? `${callHour}:${callMinute}` : "";
      const payload = {
        genre,
        quiAssurer,
        activite,
        nom: `${prenom} ${nom}`,
        dateNaissance,
        adresse,
        codePostal,
        telephone,
        email,
        callPreference,
        callDate,
        callTime: finalCallTime,
        assuranceType: "Santé / Mutuelle",
        vehicleType: "Santé",
        adminEmail: "benhida.ilyass@gmail.com",
        meta: getClientMetadata(),
      };

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Une erreur est survenue lors de l'envoi.");
      }

      setMutuelleSuccess(true);
    } catch (err: any) {
      setMutuelleError(err.message || "Une erreur est survenue.");
    } finally {
      setIsMutuelleSubmitting(false);
    }
  };

  const vehicleOffers = [
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
    {
      id: "trottinette",
      title: "Trottinette Électrique",
      description: "Responsabilité civile obligatoire, protection contre le vol, les dommages corporels et matériels en ville.",
      icon: ScooterIcon,
      accentBg: "bg-primary/10",
      accentText: "text-primary",
    },
  ];

  const otherOffers = [
    {
      id: "sante",
      title: "Santé",
      description: "Des garanties sur-mesure pour votre santé.",
      icon: Heart,
    },
    {
      id: "emprunteur",
      title: "Emprunteur",
      description: "Sécurisez votre crédit aux meilleures conditions.",
      icon: Shield,
    },
    {
      id: "fad",
      title: "FAD Service Dépannage",
      description: "Assistance et dépannage rapide.",
      icon: Wrench,
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

  const todayString = new Date().toISOString().split("T")[0];
  const HOURS = Array.from({ length: 11 }, (_, i) => String(i + 9).padStart(2, '0'));
  const MINUTES = ['00', '15', '30', '45'];

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      {toast && (
        <div className="fixed top-6 right-6 z-[9999] bg-[#0B132B] text-white px-5 py-3.5 rounded-xl shadow-2xl border border-white/10 flex items-center gap-3 transition-all duration-300 animate-in fade-in slide-in-from-top-5">
          <span className="text-[#D4AF37]">⚠️</span>
          <p className="text-sm font-semibold">{toast}</p>
        </div>
      )}

      <Header onGetQuoteClick={() => handleOpenModal()} />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-24 sm:pb-32 lg:pt-28 lg:pb-40 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-4 py-1.5 rounded-full mb-8 animate-fade-in backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-[#D4AF37] animate-pulse" />
              <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-widest">
                🏆 Courtier en Assurances de Prestige
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-[#0B132B] leading-tight max-w-5xl mx-auto">
              <span className="text-[#D4AF37] block mb-3">SBA CONSEIL</span>
              <span className="text-[#0B132B] block text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wider uppercase mt-4">
                "ENSEMBLE, CONSTRUISONS VOTRE AVENIR ASSURÉ"
              </span>
            </h1>

            <p className="mt-8 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
              L'excellence du courtage pour vos véhicules d'exception et du quotidien. Sélectionnez votre couverture et obtenez votre devis personnalisé en moins de 2 minutes.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
              <Button
                onClick={() => handleOpenModal()}
                className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#c39e2e] text-white text-base font-bold py-5 px-9 rounded-xl shadow-lg shadow-[#D4AF37]/15 transition-all duration-300 flex items-center justify-center gap-2 group border border-[#D4AF37]/20 cursor-pointer"
              >
                Obtenir un devis personnalisé
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto border-slate-200 hover:border-slate-300 text-slate-600 hover:text-[#0B132B] bg-white hover:bg-slate-50 font-bold text-base py-5 px-9 rounded-xl shadow-sm transition-all duration-200 cursor-pointer"
              >
                Découvrir nos offres
              </Button>
            </div>

            {/* Quick Metrics */}
            <div className="mt-20 sm:mt-24 border-t border-slate-100 pt-10 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <p className="text-3xl sm:text-4xl font-extrabold text-[#0B132B]">10+ Ans</p>
                <p className="text-xs font-semibold text-[#D4AF37] uppercase tracking-widest mt-2">D'Expertise</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-extrabold text-[#0B132B]">99,2%</p>
                <p className="text-xs font-semibold text-[#D4AF37] uppercase tracking-widest mt-2">De Satisfaction</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-extrabold text-[#0B132B]">&lt; 2 Min</p>
                <p className="text-xs font-semibold text-[#D4AF37] uppercase tracking-widest mt-2">Devis En Ligne</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-extrabold text-[#0B132B]">24h/24</p>
                <p className="text-xs font-semibold text-[#D4AF37] uppercase tracking-widest mt-2">Conseillers Dédiés</p>
              </div>
            </div>
          </div>
        </section>

        {/* Vehicle & Personal Insurances Choices */}
        <section id="services" className="py-24 sm:py-32 bg-slate-50 border-y border-slate-100 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
              <h2 className="text-sm font-bold text-[#D4AF37] uppercase tracking-widest">Nos Offres</h2>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0B132B] tracking-tight">
                Assurances Sur-Mesure
              </h2>
              <p className="text-slate-600 leading-relaxed font-light">
                Sélectionnez le type d'assurance pour lequel vous souhaitez recevoir une étude tarifaire personnalisée par nos experts de courtage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Row 1: Vehicles */}
              {vehicleOffers.map((offer) => {
                const IconComponent = offer.icon;
                return (
                  <div
                    key={offer.id}
                    className="bg-white border border-slate-100 p-8 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div>
                      <div className="inline-flex p-3.5 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] mb-6">
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold text-[#0B132B] mb-3">
                        {offer.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed mb-8 font-light font-sans">
                        {offer.description}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleOpenModal(offer.id)}
                      className="w-full bg-[#D4AF37] hover:bg-[#c39e2e] text-white rounded-xl py-3 font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 group/btn cursor-pointer"
                    >
                      Obtenir mon devis
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Button>
                  </div>
                );
              })}

              {/* Row 2: Other Offers */}
              {otherOffers.map((offer) => {
                const IconComponent = offer.icon;
                return (
                  <div
                    key={offer.id}
                    className="bg-white border border-slate-100 p-8 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div>
                      <div className="inline-flex p-3.5 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] mb-6">
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold text-[#0B132B] mb-3">
                        {offer.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed mb-8 font-light font-sans">
                        {offer.description}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleOpenModal(offer.id)}
                      className="w-full bg-[#D4AF37] hover:bg-[#c39e2e] text-white rounded-xl py-3 font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 group/btn cursor-pointer"
                    >
                      {offer.id === "sante" ? "Obtenir mon devis" : "Nous contacter"}
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Wider Portfolio Services Section (with specific icons from logo) */}
        <section className="py-24 sm:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
              <h2 className="text-sm font-bold text-[#D4AF37] uppercase tracking-widest">Une Expertise Globale</h2>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0B132B] tracking-tight">
                Votre Patrimoine & Personne Protégés
              </h2>
              <p className="text-slate-600 leading-relaxed font-light">
                SBA Conseil vous propose un accompagnement complet au-delà de la mobilité, couvrant toutes les dimensions de votre sécurité.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {widerPortfolio.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white p-8 rounded-2xl border border-slate-100 flex flex-col items-center text-center space-y-4 shadow-sm"
                  >
                    <div className="p-4 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] mb-2">
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-bold text-[#0B132B]">{item.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed font-light">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features / Why Us Section */}
        <section id="about" className="py-24 sm:py-32 bg-slate-50 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
              <div className="space-y-6 lg:col-span-1">
                <div className="inline-flex bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-3 py-1 rounded-full text-xs font-semibold text-[#D4AF37] uppercase tracking-widest">
                  Pourquoi SBA Conseil
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#0B132B] tracking-tight leading-tight">
                  L'exigence d'un courtier d'exception
                </h2>
                <p className="text-slate-600 leading-relaxed font-light">
                  Nous nous positionnons à l'intersection entre tradition, réactivité et innovation digitale, pour structurer vos contrats d'assurances autour d'une transparence absolue.
                </p>
                <ul className="space-y-4 pt-2">
                  {[
                    "Aucun frais administratif dissimulé",
                    "Ajustement des plafonds de couverture à tout moment",
                    "Règlement rapide des indemnités de sinistre"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                      <div className="bg-[#D4AF37] text-white p-0.5 rounded-full shrink-0">
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
                      className="bg-white border border-slate-100 p-6.5 rounded-2xl hover:border-[#D4AF37]/30 transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      <div className="bg-[#D4AF37]/10 text-[#D4AF37] p-3 rounded-xl inline-flex mb-4">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-bold text-[#0B132B] mb-2">{feature.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed font-light">{feature.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-24 sm:py-32 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
              <h2 className="text-sm font-bold text-[#D4AF37] uppercase tracking-widest">Témoignages Clients</h2>
              <p className="text-3xl sm:text-4xl font-bold text-[#0B132B] tracking-tight">
                Ils nous font confiance
              </p>
              <p className="text-slate-600 leading-relaxed font-light">
                Découvrez les retours d'expérience de nos assurés quant à la qualité de notre accompagnement et la rapidité de gestion de leurs garanties.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-100 p-8 rounded-2xl flex flex-col justify-between relative hover:border-[#D4AF37]/35 transition-all duration-300 shadow-sm"
                >
                  <div className="space-y-5">
                    {/* Stars */}
                    <div className="flex gap-1 text-[#D4AF37]">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="h-4.5 w-4.5 fill-current" />
                      ))}
                    </div>
                    <p className="text-slate-700 italic text-sm leading-relaxed font-light">
                      "{t.quote}"
                    </p>
                  </div>
                  <div className="border-t border-slate-200 mt-6 pt-5 flex flex-col">
                    <span className="font-bold text-[#0B132B] text-sm">{t.author}</span>
                    <span className="text-xs text-slate-500 mt-1">{t.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Bottom Banner */}
        <section className="bg-slate-50 text-slate-900 py-20 sm:py-24 relative overflow-hidden border-t border-slate-200">
          <div className="absolute inset-0 bg-[#D4AF37]/5 pointer-events-none" />
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0B132B]">
              Prêt à sécuriser votre avenir avec sérénité ?
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto text-base sm:text-lg font-light">
              Définissez vos garanties personnalisées en 2 minutes en ligne ou contactez un conseiller expert pour une étude patrimoniale complète.
            </p>
            <div className="pt-4">
              <Button
                onClick={() => handleOpenModal()}
                className="bg-[#D4AF37] hover:bg-[#c39e2e] text-white font-bold py-5 px-9 rounded-xl shadow-lg shadow-[#D4AF37]/15 transition-all duration-300 inline-flex items-center gap-2 border border-[#D4AF37]/20 cursor-pointer"
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
        onShowToast={showToastNotification}
        onSelectSante={() => {
          setIsModalOpen(false);
          handleOpenModal("sante");
        }}
      />

      {/* Health Insurance (Mutuelle) Multi-step Modal */}
      {isMutuelleOpen && (
        <div
          onClick={() => setIsMutuelleOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-hidden"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-xl shadow-xl flex flex-col h-auto max-h-[95vh] md:max-h-[85vh] border border-slate-200 text-slate-900 overflow-hidden relative"
          >
            <button
              onClick={() => setIsMutuelleOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors z-[60]"
              type="button"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Fermer</span>
            </button>

            {!mutuelleSuccess ? (
              <div className="flex flex-col flex-1 overflow-hidden">
                {/* Header & Progress */}
                <div className="p-6 pb-2 sm:p-8 sm:pb-2">
                  <div className="flex items-center gap-3">
                    {mutuelleStep > 1 && (
                      <Button
                        variant="ghost"
                        onClick={handlePrevStep}
                        className="text-slate-500 hover:text-[#0B132B] hover:bg-slate-100 rounded-xl h-10 w-10 p-0"
                        type="button"
                      >
                        <ArrowLeft className="h-5 w-5" />
                        <span className="sr-only">Retour</span>
                      </Button>
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#0B132B]">
                        Devis Santé Mutuelle
                      </h3>
                      <p className="text-sm text-slate-500">
                        Étape {mutuelleStep} : {getStepTitle(mutuelleStep)}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-1.5 w-full bg-slate-200 mt-4 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#D4AF37] transition-all duration-300"
                      style={{ width: `${(mutuelleStep / 7) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Error Banner */}
                {mutuelleError && (
                  <div className="mx-6 sm:mx-8 my-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {mutuelleError}
                  </div>
                )}

                {/* Scrollable Form Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4 sm:px-8">
                  {mutuelleStep === 1 && (
                    <div className="space-y-4">
                      <p className="text-sm font-medium text-slate-600">Choisissez votre genre :</p>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => {
                            setGenre("Femme");
                            setMutuelleError(null);
                          }}
                          className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-200 ${genre === "Femme"
                              ? "border-[#D4AF37] bg-[#D4AF37]/5 text-[#0B132B]"
                              : "border-slate-200 hover:border-slate-300 text-slate-600"
                            }`}
                        >
                          <span className="text-3xl mb-2">👩</span>
                          <span className="font-semibold">Une femme</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setGenre("Homme");
                            setMutuelleError(null);
                          }}
                          className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-200 ${genre === "Homme"
                              ? "border-[#D4AF37] bg-[#D4AF37]/5 text-[#0B132B]"
                              : "border-slate-200 hover:border-slate-300 text-slate-600"
                            }`}
                        >
                          <span className="text-3xl mb-2">👨</span>
                          <span className="font-semibold">Un homme</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {mutuelleStep === 2 && (
                    <div className="space-y-4">
                      <p className="text-sm font-medium text-slate-600">Personnes à assurer :</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { id: "Vous", label: "Vous", icon: "👤" },
                          { id: "Votre couple", label: "Votre couple", icon: "👥" },
                          { id: "Vos enfants et vous", label: "Vos enfants et vous", icon: "🧑‍👩‍👧" },
                          { id: "Toute la famille", label: "Toute la famille", icon: "👨‍👩‍👧‍👦" },
                        ].map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => {
                              setQuiAssurer(option.id);
                              setMutuelleError(null);
                            }}
                            className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 ${quiAssurer === option.id
                                ? "border-[#D4AF37] bg-[#D4AF37]/5 text-[#0B132B]"
                                : "border-slate-200 hover:border-slate-300 text-slate-700"
                              }`}
                          >
                            <span className="text-2xl">{option.icon}</span>
                            <span className="font-semibold">{option.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {mutuelleStep === 3 && (
                    <div className="space-y-4">
                      <p className="text-sm font-medium text-slate-600">Sélectionnez votre régime ou activité :</p>
                      <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-slate-50">
                        {activities.map((act) => (
                          <label
                            key={act}
                            className={`flex items-center gap-3 p-3 text-sm cursor-pointer hover:bg-slate-100/80 transition-colors ${activite === act ? "bg-[#D4AF37]/10" : ""
                              }`}
                          >
                            <input
                              type="radio"
                              name="activite"
                              value={act}
                              checked={activite === act}
                              onChange={() => {
                                setActivite(act);
                                setMutuelleError(null);
                              }}
                              className="h-4.5 w-4.5 border-slate-300 text-[#D4AF37] focus:ring-[#D4AF37] accent-[#D4AF37]"
                            />
                            <span className={`font-medium ${activite === act ? "text-[#0B132B] font-semibold" : "text-slate-700"}`}>
                              {act}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {mutuelleStep === 4 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-[#0B132B] uppercase tracking-wider">Prénom *</label>
                          <input
                            type="text"
                            placeholder="Jean"
                            value={prenom}
                            onChange={(e) => setPrenom(e.target.value.replace(/[^A-Za-zÀ-ÿ\s-]/g, ''))}
                            className="w-full h-11 px-3.5 border border-slate-300 rounded-xl text-[#0B132B] focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] bg-white outline-none text-sm"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-[#0B132B] uppercase tracking-wider">Nom *</label>
                          <input
                            type="text"
                            placeholder="Dupont"
                            value={nom}
                            onChange={(e) => setNom(e.target.value.replace(/[^A-Za-zÀ-ÿ\s-]/g, ''))}
                            className="w-full h-11 px-3.5 border border-slate-300 rounded-xl text-[#0B132B] focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] bg-white outline-none text-sm"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#0B132B] uppercase tracking-wider">Date de naissance *</label>
                        <input
                          type="date"
                          max={minAgeDate}
                          value={dateNaissance}
                          onChange={(e) => setDateNaissance(e.target.value)}
                          className="w-full h-11 px-3.5 border border-slate-300 rounded-xl text-[#0B132B] focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] bg-white outline-none text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {mutuelleStep === 5 && (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#0B132B] uppercase tracking-wider">Adresse postale *</label>
                        <input
                          type="text"
                          placeholder="12 Rue de la Paix"
                          value={adresse}
                          onChange={(e) => setAdresse(e.target.value)}
                          className="w-full h-11 px-3.5 border border-slate-300 rounded-xl text-[#0B132B] focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] bg-white outline-none text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#0B132B] uppercase tracking-wider">Code postal *</label>
                        <input
                          type="text"
                          placeholder="75002"
                          maxLength={5}
                          value={codePostal}
                          onChange={(e) => setCodePostal(e.target.value.replace(/\D/g, ""))}
                          className="w-full h-11 px-3.5 border border-slate-300 rounded-xl text-[#0B132B] focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] bg-white outline-none text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {mutuelleStep === 6 && (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#0B132B] uppercase tracking-wider">Numéro de téléphone *</label>
                        <input
                          type="text"
                          placeholder="+33 6 12 34 56 78"
                          value={telephone}
                          onChange={(e) => {
                            const formatted = formatTelephone(e.target.value);
                            setTelephone(formatted);
                          }}
                          className="w-full h-11 px-3.5 border border-slate-300 rounded-xl text-[#0B132B] focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] bg-white outline-none text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#0B132B] uppercase tracking-wider">Adresse E-mail *</label>
                        <input
                          type="email"
                          placeholder="jean.dupont@exemple.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full h-11 px-3.5 border border-slate-300 rounded-xl text-[#0B132B] focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] bg-white outline-none text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {mutuelleStep === 7 && (
                    <div className="space-y-4">
                      <p className="text-sm font-semibold text-[#0B132B]">Étape 7 : Planifier votre appel</p>

                      {/* Top Container (Appel immédiat) */}
                      <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                        <p className="text-[#0B132B] font-semibold text-xs mb-3 uppercase tracking-wider">Être rappelé rapidement (Appel immédiat)</p>
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() => {
                              setCallPreference("15min");
                              setMutuelleError(null);
                            }}
                            className={`h-11 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer border ${callPreference === "15min"
                                ? "bg-[#0B132B] text-white border-[#0B132B] shadow-md shadow-[#0B132B]/20"
                                : "bg-white text-[#0B132B] border-slate-300 hover:bg-slate-50"
                              }`}
                          >
                            15 min
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setCallPreference("30min");
                              setMutuelleError(null);
                            }}
                            className={`h-11 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer border ${callPreference === "30min"
                                ? "bg-[#0B132B] text-white border-[#0B132B] shadow-md shadow-[#0B132B]/20"
                                : "bg-white text-[#0B132B] border-slate-300 hover:bg-slate-50"
                              }`}
                          >
                            30 min
                          </button>
                        </div>
                      </div>

                      {/* Bottom Container (Date ultérieure) */}
                      <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                        <p className="text-[#0B132B] font-semibold text-xs mb-3 uppercase tracking-wider">Ou choisir une date ultérieure</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="date"
                            min={todayString}
                            className="w-full h-11 px-3 border border-slate-300 rounded-xl text-sm text-[#0B132B] focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent bg-white"
                            value={callDate}
                            onChange={(e) => {
                              setCallDate(e.target.value);
                              setCallPreference('custom');
                            }}
                          />
                          <div className="flex gap-2">
                            <select
                              className="w-full h-11 px-3 border border-slate-300 rounded-xl text-sm text-[#0B132B] focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent bg-white"
                              value={callHour}
                              onChange={(e) => {
                                setCallHour(e.target.value);
                                setCallPreference('custom');
                              }}
                            >
                              <option value="" disabled>Heure</option>
                              {HOURS.map(h => (
                                <option key={h} value={h}>{h}h</option>
                              ))}
                            </select>
                            <select
                              className="w-full h-11 px-3 border border-slate-300 rounded-xl text-sm text-[#0B132B] focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent bg-white"
                              value={callMinute}
                              onChange={(e) => {
                                setCallMinute(e.target.value);
                                setCallPreference('custom');
                              }}
                            >
                              <option value="" disabled>Min</option>
                              {callHour === "19" ? (
                                <option value="00">00</option>
                              ) : (
                                MINUTES.map(m => (
                                  <option key={m} value={m}>{m}</option>
                                ))
                              )}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Navigation */}
                <div className="border-t border-slate-100 p-4 bg-white flex justify-between items-center shrink-0">
                  <Button
                    variant="ghost"
                    onClick={mutuelleStep > 1 ? handlePrevStep : () => setIsMutuelleOpen(false)}
                    className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl px-5"
                    type="button"
                  >
                    {mutuelleStep > 1 ? "Précédent" : "Fermer"}
                  </Button>

                  {mutuelleStep < 7 ? (
                    <Button
                      onClick={handleNextStep}
                      className="bg-[#D4AF37] hover:bg-[#c39e2e] text-white font-bold px-6 py-2.5 rounded-xl shadow-lg transition-all duration-300 border border-[#D4AF37]/20 cursor-pointer flex items-center gap-2"
                    >
                      Suivant
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleMutuelleSubmit}
                      disabled={isMutuelleSubmitting}
                      className="bg-[#D4AF37] hover:bg-[#c39e2e] text-white font-bold px-6 py-2.5 rounded-xl shadow-lg transition-all duration-300 border border-[#D4AF37]/20 cursor-pointer flex items-center gap-2"
                    >
                      {isMutuelleSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Confirmation...
                        </>
                      ) : (
                        "Confirmer le rendez-vous"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center space-y-6 flex-1 overflow-y-auto">
                <div className="bg-[#D4AF37]/10 p-4 rounded-full text-[#D4AF37] animate-bounce">
                  <CheckCircle className="h-16 w-16" />
                </div>
                <div className="space-y-2 max-w-md">
                  <h3 className="text-2xl font-bold text-[#0B132B]">
                    Rendez-vous confirmé. À très vite !
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    Merci <span className="font-semibold text-slate-900">{prenom}</span>. Votre demande de devis pour l'assurance <span className="font-semibold text-[#D4AF37]">Santé / Mutuelle</span> a été transmise avec succès à nos conseillers. Un expert vous contactera très rapidement pour vous proposer les meilleures offres.
                  </p>
                </div>
                <div className="w-full max-w-xs pt-4">
                  <Button
                    onClick={() => setIsMutuelleOpen(false)}
                    className="w-full bg-[#0B132B] hover:bg-[#152244] text-white font-medium py-3 rounded-xl transition-all duration-300 cursor-pointer shadow-md"
                  >
                    Fermer la fenêtre
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

