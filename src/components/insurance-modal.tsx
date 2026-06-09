"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Car,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Loader2,
  Heart,
  Shield,
  Wrench,
  X,
} from "lucide-react";

interface InsuranceModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultChoiceId?: string;
  onShowToast?: (msg: string) => void;
  onSelectSante?: () => void;
}

type InsuranceChoice = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
};

// Zod Schema Path A: Trottinette
const trottinetteSchema = z.object({
  nom: z.string({ message: "Le nom complet est requis." }).min(1, "Le nom complet est requis."),
  email: z.string({ message: "L'adresse e-mail est requise." }).email("Adresse e-mail invalide."),
  age: z.string({ message: "L'âge est requis." }).min(1, "L'âge est requis."),
  codePostal: z.string({ message: "Le code postal est requis." }).regex(/^\d{5}$/, "Le code postal doit contenir 5 chiffres."),
  telephone: z.string({ message: "Le numéro de téléphone est requis." }).min(8, "Le numéro de téléphone doit être valide."),
});

type TrottinetteFormData = z.infer<typeof trottinetteSchema>;

// Zod Schema Path B: Automobile / Moto
const autoMotoSchema = z.object({
  nom: z.string({ message: "Le nom complet est requis." }).min(1, "Le nom complet est requis."),
  email: z.string({ message: "L'adresse e-mail est requise." }).email("Adresse e-mail invalide."),
  telephone: z.string({ message: "Le numéro de téléphone est requis." }).min(8, "Le numéro de téléphone doit être valide."),
  immatriculation: z
    .string({ message: "Le numéro d'immatriculation est requis." })
    .min(1, "Le numéro d'immatriculation est requis.")
    .regex(/^[A-Z]{2}-\d{3}-[A-Z]{2}$/i, "Format d'immatriculation invalide. Exemple: AA-123-AA"),
  datePermis: z.string({ message: "La date d'obtention du permis est requise." }).min(1, "La date d'obtention du permis est requise."),
  categoriePermis: z.string({ message: "La catégorie du permis est requise." }).min(1, "La catégorie du permis est requise."),
  dejaAssure: z.enum(["Oui", "Non"], {
    message: "Veuillez indiquer si vous avez été assuré au cours des 3 dernières années.",
  }),
  periodeAssurance: z.string().optional(),
  crm: z
    .string({ message: "Le coefficient CRM (Bonus-Malus) est requis." })
    .min(1, "Le coefficient CRM est requis.")
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0.5 && num <= 5.0;
    }, { message: "Le CRM doit être compris entre 0.50 et 5.00." }),
}).refine((data) => {
  if (data.dejaAssure === "Oui" && (!data.periodeAssurance || data.periodeAssurance.trim() === "")) {
    return false;
  }
  return true;
}, {
  message: "La période d'assurance est requise.",
  path: ["periodeAssurance"],
});

type AutoMotoFormData = z.infer<typeof autoMotoSchema>;

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

const choices: InsuranceChoice[] = [
  {
    id: "trottinette",
    title: "Trottinette Électrique",
    description: "Garanties responsabilité civile, vol et dommages pour vos trajets urbains quotidiens.",
    icon: ScooterIcon,
    iconColor: "text-[#D4AF37]",
  },
  {
    id: "auto",
    title: "Automobile",
    description: "Des formules Tous Risques ou au Tiers personnalisées pour vos véhicules de prestige ou du quotidien.",
    icon: Car,
    iconColor: "text-[#D4AF37]",
  },
  {
    id: "moto",
    title: "Moto",
    description: "Garanties conducteur, dommages et vol adaptées pour tous les motards and cylindrées.",
    icon: MotoIcon,
    iconColor: "text-[#D4AF37]",
  },
  {
    id: "sante",
    title: "Santé",
    description: "Des garanties sur-mesure pour votre santé.",
    icon: Heart,
    iconColor: "text-[#D4AF37]",
  },
  {
    id: "emprunteur",
    title: "Emprunteur",
    description: "Sécurisez votre crédit aux meilleures conditions.",
    icon: Shield,
    iconColor: "text-[#D4AF37]",
  },
  {
    id: "fad",
    title: "FAD Service Dépannage",
    description: "Assistance et dépannage rapide.",
    icon: Wrench,
    iconColor: "text-[#D4AF37]",
  },
];

const formatLicensePlate = (value: string) => {
  // Remove all existing dashes and non-alphanumeric characters, force uppercase
  const clean = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  
  // Track length of clean alphanumeric string
  const len = clean.length;

  if (len === 0) return '';
  if (len <= 2) {
    // If exactly 2 characters, append the dash immediately
    return len === 2 ? `${clean}-` : clean;
  }
  if (len <= 5) {
    // If exactly 5 characters (2 letters + 3 numbers), append the second dash immediately
    const part1 = clean.slice(0, 2);
    const part2 = clean.slice(2, len);
    return len === 5 ? `${part1}-${part2}-` : `${part1}-${part2}`;
  }
  
  // Fully formatted or full typing limit (AA-123-AA)
  const part1 = clean.slice(0, 2);
  const part2 = clean.slice(2, 5);
  const part3 = clean.slice(5, 7);
  return `${part1}-${part2}-${part3}`;
};

// Formatting helper for date DD/MM/YYYY
const formatDate = (val: string): string => {
  const cleaned = val.replace(/\D/g, "");
  let formatted = "";
  for (let i = 0; i < cleaned.length && i < 8; i++) {
    if (i === 2 || i === 4) {
      formatted += "/";
    }
    formatted += cleaned[i];
  }
  return formatted;
};

const HOURS = Array.from({ length: 11 }, (_, i) => String(i + 9).padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];

const monthsList = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

// Formatting helper for French telephone format (+33 followed by exactly 9 digits)
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

export function InsuranceModal({ isOpen, onOpenChange, defaultChoiceId, onShowToast, onSelectSante }: InsuranceModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedChoice, setSelectedChoice] = useState<InsuranceChoice | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedInfo, setSubmittedInfo] = useState<any | null>(null);

  // Scheduling States
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [scheduleMode, setScheduleMode] = useState<"immediate" | "future">("immediate");
  const [callPreference, setCallPreference] = useState<"15min" | "30min" | "custom" | null>(null);
  const [callDate, setCallDate] = useState("");
  const [callHour, setCallHour] = useState("");
  const [callMinute, setCallMinute] = useState("");

  // Month Selector States
  const [startMonth, setStartMonth] = useState<string>("");
  const [startYear, setStartYear] = useState<string>("");
  const [endMonth, setEndMonth] = useState<string>("");
  const [endYear, setEndYear] = useState<string>("");

  useEffect(() => {
    if (callHour === "19") {
      setCallMinute("00");
    }
  }, [callHour]);

  useEffect(() => {
    if (startMonth && startYear && endMonth && endYear) {
      const startVal = parseInt(startYear) * 12 + monthsList.indexOf(startMonth);
      const endVal = parseInt(endYear) * 12 + monthsList.indexOf(endMonth);
      if (endVal < startVal) {
        setEndMonth("");
        setEndYear("");
      }
    }
  }, [startMonth, startYear, endMonth, endYear]);

  // Path A Form
  const trottinetteForm = useForm<TrottinetteFormData>({
    resolver: zodResolver(trottinetteSchema),
    defaultValues: {
      nom: "",
      email: "",
      age: "",
      codePostal: "",
      telephone: "+33 ",
    },
  });

  // Path B Form
  const autoMotoForm = useForm<AutoMotoFormData>({
    resolver: zodResolver(autoMotoSchema),
    defaultValues: {
      nom: "",
      email: "",
      telephone: "+33 ",
      immatriculation: "",
      datePermis: "",
      categoriePermis: "",
      dejaAssure: undefined,
      periodeAssurance: "",
      crm: "1.00",
    },
  });

  React.useEffect(() => {
    if (isOpen && defaultChoiceId) {
      const found = choices.find((c) => c.id === defaultChoiceId);
      if (found) {
        if (found.id === "sante") {
          if (onSelectSante) {
            onSelectSante();
          }
          return;
        }
        if (found.id === "emprunteur" || found.id === "fad") {
          if (onShowToast) {
            onShowToast("Ce service n'est pas encore disponible en ligne. Veuillez nous contacter.");
          } else {
            alert("Ce service n'est pas encore disponible en ligne. Veuillez nous contacter.");
          }
          onOpenChange(false);
          return;
        }
        setSelectedChoice(found);
        setStep(2);
      }
    }
  }, [isOpen, defaultChoiceId, onOpenChange, onShowToast, onSelectSante]);

  const handleChoiceSelect = (choice: InsuranceChoice) => {
    if (choice.id === "sante") {
      if (onSelectSante) {
        onSelectSante();
      }
      return;
    }
    if (choice.id === "emprunteur" || choice.id === "fad") {
      if (onShowToast) {
        onShowToast("Ce service n'est pas encore disponible en ligne. Veuillez nous contacter.");
      } else {
        alert("Ce service n'est pas encore disponible en ligne. Veuillez nous contacter.");
      }
      return;
    }
    setSelectedChoice(choice);
    setStep(2);
    setError(null);
  };

  const handleBackToStep1 = () => {
    setStep(1);
    setError(null);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep(1);
      setSelectedChoice(null);
      setSubmittedInfo(null);
      setIsSubmitted(false);
      setIsConfirmed(false);
      setScheduleMode("immediate");
      setCallPreference(null);
      setCallDate("");
      setCallHour("");
      setCallMinute("");
      setStartMonth("");
      setStartYear("");
      setEndMonth("");
      setEndYear("");
      trottinetteForm.reset({ telephone: "+33 " });
      autoMotoForm.reset({ telephone: "+33 " });
      setError(null);
    }, 200);
  };

  // Submit Path A
  const onTrottinetteSubmit = async (data: TrottinetteFormData) => {
    if (!selectedChoice) return;
    setSubmittedInfo({
      nom: data.nom,
      email: data.email,
      age: data.age,
      codePostal: data.codePostal,
      telephone: data.telephone,
      assuranceType: selectedChoice.title,
    });
    setIsSubmitted(true);
  };

  // Submit Path B
  const onAutoMotoSubmit = async (data: AutoMotoFormData) => {
    if (!selectedChoice) return;
    setSubmittedInfo({
      nom: data.nom,
      email: data.email,
      telephone: data.telephone,
      immatriculation: data.immatriculation,
      datePermis: data.datePermis,
      categoriePermis: data.categoriePermis,
      assuranceType: selectedChoice.title,
      dejaAssure: data.dejaAssure,
      periodeAssurance: data.dejaAssure === "Oui" ? data.periodeAssurance : undefined,
      crm: data.crm,
    });
    setIsSubmitted(true);
  };

  const { onChange: onImmatriculationChange, ...immatriculationRest } = autoMotoForm.register("immatriculation");
  const { onChange: onDatePermisChange, ...datePermisRest } = autoMotoForm.register("datePermis");
  const { onChange: onTelephoneChangeA, ...telephoneRestA } = trottinetteForm.register("telephone");
  const { onChange: onTelephoneChangeB, ...telephoneRestB } = autoMotoForm.register("telephone");

  const dejaAssureVal = autoMotoForm.watch("dejaAssure");

  useEffect(() => {
    if (dejaAssureVal === "Non") {
      setStartMonth("");
      setStartYear("");
      setEndMonth("");
      setEndYear("");
      autoMotoForm.setValue("crm", "1.00");
    }
  }, [dejaAssureVal, autoMotoForm]);

  // Calculate selected months count
  let selectedMonthsCount = 0;
  if (startMonth && startYear && endMonth && endYear) {
    const startVal = parseInt(startYear) * 12 + monthsList.indexOf(startMonth);
    const endVal = parseInt(endYear) * 12 + monthsList.indexOf(endMonth);
    if (endVal >= startVal) {
      selectedMonthsCount = endVal - startVal + 1;
    }
  }

  useEffect(() => {
    if (dejaAssureVal === "Oui") {
      autoMotoForm.setValue("periodeAssurance", selectedMonthsCount > 0 ? `${selectedMonthsCount} mois` : "");
    } else {
      autoMotoForm.setValue("periodeAssurance", "");
    }
  }, [selectedMonthsCount, dejaAssureVal, autoMotoForm]);

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (scheduleMode === "immediate" && !callPreference) {
      setError("Veuillez choisir une durée pour le rappel immédiat.");
      return;
    }
    if (callPreference === "custom") {
      if (!callDate || !callHour || !callMinute) {
        setError("Veuillez sélectionner une date, une heure et les minutes pour le rappel.");
        if (onShowToast) {
          onShowToast("Veuillez sélectionner une date, une heure et les minutes pour le rappel.");
        }
        return;
      }
    }
    setError(null);
    setIsSubmitting(true);

    try {
      const finalCallTime = callHour && callMinute ? `${callHour}:${callMinute}` : "";
      const payload = {
        ...(selectedChoice?.id === "trottinette" ? trottinetteForm.getValues() : autoMotoForm.getValues()),
        assuranceType: selectedChoice?.title,
        vehicleType: selectedChoice?.title || "Général",
        callPreference,
        callDate,
        callTime: finalCallTime,
        adminEmail: "benhida.ilyass@gmail.com",
      };

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Échec de la confirmation.");
      }

      setIsConfirmed(true);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCrmBlur = (val: string, onChange: (val: string) => void) => {
    if (val === "") return;
    const parsed = parseFloat(val);
    if (isNaN(parsed) || parsed < 0.50) {
      onChange("0.50");
    } else if (parsed > 5.00) {
      onChange("5.00");
    } else {
      onChange(parsed.toFixed(2));
    }
  };

  const todayString = new Date().toISOString().split("T")[0];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? null : handleClose())}>
      <DialogContent
        showCloseButton={false}
        onClick={handleClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 !translate-x-0 !translate-y-0 !top-0 !left-0 !max-w-none rounded-none bg-transparent ring-0 border-none shadow-none p-0 overflow-hidden outline-none cursor-pointer"
      >
        <div 
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg bg-white rounded-xl shadow-xl flex flex-col h-auto max-h-[95vh] md:max-h-[85vh] border border-slate-200 text-slate-900 overflow-hidden relative cursor-default"
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors z-[60]"
            type="button"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Fermer</span>
          </button>

          {step === 1 && (
          <div className="space-y-6 p-6 sm:p-8 overflow-y-auto flex-1 flex flex-col">
            <DialogHeader className="text-center sm:text-left">
              <DialogTitle className="text-2xl font-bold text-[#0B132B]">
                Choisissez votre assurance
              </DialogTitle>
              <DialogDescription className="text-slate-500 mt-1">
                Sélectionnez l'une de nos offres d'assurance de véhicules pour obtenir votre devis personnalisé.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-4">
              {choices.map((choice) => {
                const IconComponent = choice.icon;
                return (
                  <button
                    key={choice.id}
                    onClick={() => handleChoiceSelect(choice)}
                    className="flex items-start gap-4 p-4.5 text-left rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-[#D4AF37]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#D4AF37]/5 hover:-translate-y-0.5 group cursor-pointer w-full"
                  >
                    <div className="p-3.5 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-[#0B132B] text-base group-hover:text-[#D4AF37] transition-colors">
                        {choice.title}
                      </h4>
                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                        {choice.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && selectedChoice && (
          <div className="flex flex-col flex-1 overflow-hidden h-full">
            <div className="flex items-center gap-3 p-6 pb-2 sm:p-8 sm:pb-2">
              {!isConfirmed && (
                <Button
                  variant="ghost"
                  onClick={isSubmitted ? () => setIsSubmitted(false) : handleBackToStep1}
                  className="text-slate-500 hover:text-[#0B132B] hover:bg-slate-100 rounded-xl h-10 w-10 p-0"
                  type="button"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span className="sr-only">Retour</span>
                </Button>
              )}
              <DialogHeader className="flex-1">
                <DialogTitle className="text-2xl font-bold text-[#0B132B]">
                  {isConfirmed
                    ? "Rendez-vous confirmed !"
                    : isSubmitted
                    ? "Dossier pré-validé. Réservez votre appel."
                    : `Formulaire Devis - ${selectedChoice.title}`}
                </DialogTitle>
                <DialogDescription className="text-slate-500">
                  {isConfirmed
                    ? "Votre entretien avec un conseiller SBA Conseil est planifié."
                    : isSubmitted
                    ? "Choisissez un créneau ci-dessous avec l'un de nos conseillers SBA pour finaliser votre devis."
                    : "Veuillez renseigner les informations ci-dessous pour votre devis."}
                </DialogDescription>
              </DialogHeader>
            </div>

            {!isSubmitted ? (
              <div className="flex-1 flex flex-col overflow-hidden">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {error}
                  </div>
                )}

                {selectedChoice.id === "trottinette" ? (
                  <form onSubmit={trottinetteForm.handleSubmit(onTrottinetteSubmit)} className="flex flex-col flex-1 overflow-hidden h-full">
                    <div className="flex-1 overflow-y-auto max-h-[calc(95vh-140px)] md:max-h-[calc(85vh-140px)] px-6 py-4 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nom-t" className="text-sm font-semibold text-[#0B132B]">
                            Nom complet *
                          </Label>
                          <Input
                            id="nom-t"
                            placeholder="Jean Dupont"
                            {...trottinetteForm.register("nom")}
                            className="w-full box-border h-12 text-base rounded-xl border-slate-200 bg-slate-50 text-[#0B132B] placeholder:text-slate-400 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
                          />
                          {trottinetteForm.formState.errors.nom && (
                            <p className="text-xs text-red-600 mt-1">{trottinetteForm.formState.errors.nom.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email-t" className="text-sm font-semibold text-[#0B132B]">
                            Adresse E-mail *
                          </Label>
                          <Input
                            id="email-t"
                            type="email"
                            placeholder="jean.dupont@exemple.com"
                            {...trottinetteForm.register("email")}
                            className="w-full box-border h-12 text-base rounded-xl border-slate-200 bg-slate-50 text-[#0B132B] placeholder:text-slate-400 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
                          />
                          {trottinetteForm.formState.errors.email && (
                            <p className="text-xs text-red-600 mt-1">{trottinetteForm.formState.errors.email.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="age-t" className="text-sm font-semibold text-[#0B132B]">
                            Âge *
                          </Label>
                          <Input
                            id="age-t"
                            type="number"
                            placeholder="28"
                            {...trottinetteForm.register("age")}
                            className="w-full box-border h-12 text-base rounded-xl border-slate-200 bg-slate-50 text-[#0B132B] placeholder:text-slate-400 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
                          />
                          {trottinetteForm.formState.errors.age && (
                            <p className="text-xs text-red-600 mt-1">{trottinetteForm.formState.errors.age.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="codePostal-t" className="text-sm font-semibold text-[#0B132B]">
                            Code postal *
                          </Label>
                          <Input
                            id="codePostal-t"
                            placeholder="75002"
                            maxLength={5}
                            {...trottinetteForm.register("codePostal")}
                            className="w-full box-border h-12 text-base rounded-xl border-slate-200 bg-slate-50 text-[#0B132B] placeholder:text-slate-400 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
                          />
                          {trottinetteForm.formState.errors.codePostal && (
                            <p className="text-xs text-red-600 mt-1">{trottinetteForm.formState.errors.codePostal.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="telephone-t" className="text-sm font-semibold text-[#0B132B]">
                          Numéro de téléphone *
                        </Label>
                        <Input
                          id="telephone-t"
                          placeholder="+33 6 12 34 56 78"
                          onChange={(e) => {
                            const formatted = formatTelephone(e.target.value);
                            e.target.value = formatted;
                            onTelephoneChangeA(e);
                          }}
                          {...telephoneRestA}
                          className="w-full box-border h-12 text-base rounded-xl border-slate-200 bg-slate-50 text-[#0B132B] placeholder:text-slate-400 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
                        />
                        {trottinetteForm.formState.errors.telephone && (
                          <p className="text-xs text-red-600 mt-1">{trottinetteForm.formState.errors.telephone.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-slate-100 p-4 bg-white flex justify-between items-center shrink-0">
                      <Button
                        variant="ghost"
                        onClick={handleBackToStep1}
                        className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl px-5"
                        type="button"
                      >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Précédent
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#D4AF37] hover:bg-[#c39e2e] text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-[#D4AF37]/15 transition-all duration-300 border border-[#D4AF37]/20 cursor-pointer flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Envoi...
                          </>
                        ) : (
                          <>
                            Continuer vers l'agenda
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={autoMotoForm.handleSubmit(onAutoMotoSubmit)} className="flex flex-col flex-1 overflow-hidden h-full">
                    <div className="flex-1 overflow-y-auto max-h-[calc(95vh-140px)] md:max-h-[calc(85vh-140px)] px-6 py-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="immatriculation-am" className="text-sm font-semibold text-[#0B132B]">
                          Numéro d'immatriculation *
                        </Label>
                        <Input
                          id="immatriculation-am"
                          placeholder="AA-123-AA"
                          maxLength={9}
                          {...immatriculationRest}
                          onChange={(e) => {
                            const input = e.target;
                            let raw = input.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
                            
                            // Track delete action
                            const isDeleting = (e.nativeEvent as any).inputType === 'deleteContentBackward';
                            
                            // Strip dashes to evaluate raw character alignment
                            let clean = raw.replace(/-/g, '');
                            
                            let formatted = '';
                            
                            // Segment 1: Enforce up to 2 letters only at the start
                            let seg1 = clean.slice(0, 2).replace(/[^A-Z]/g, '');
                            formatted += seg1;
                            
                            // Trigger first dash only if segment 1 is fully completed
                            if (seg1.length === 2) {
                              if (isDeleting && raw === `${seg1}-`) {
                                // Allow user to break back past the dash smoothly
                                autoMotoForm.setValue('immatriculation', seg1.slice(0, 1), { shouldValidate: true });
                                return;
                              }
                              formatted += '-';
                              
                              // Segment 2: Enforce up to 3 numbers in the middle
                              let remaining = clean.slice(seg1.length);
                              let seg2 = remaining.slice(0, 3).replace(/[^0-9]/g, '');
                              formatted += seg2;
                              
                              // Trigger second dash only if segment 2 is fully completed
                              if (seg2.length === 3) {
                                if (isDeleting && raw === `${seg1}-${seg2}-`) {
                                  autoMotoForm.setValue('immatriculation', `${seg1}-${seg2.slice(0, 2)}`, { shouldValidate: true });
                                  return;
                                }
                                formatted += '-';
                                
                                // Segment 3: Enforce up to 2 final letters
                                let finalRemaining = remaining.slice(seg2.length);
                                let seg3 = finalRemaining.slice(0, 2).replace(/[^A-Z]/g, '');
                                formatted += seg3;
                              }
                            } else {
                              // If the first two characters are not pure letters, reject any extra content completely
                              formatted = seg1;
                            }
                            
                            autoMotoForm.setValue('immatriculation', formatted, { shouldValidate: true });
                          }}
                          className="w-full box-border h-12 text-base rounded-xl border-slate-200 bg-slate-50 text-[#0B132B] placeholder:text-slate-400 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 uppercase tracking-wider"
                        />
                        {autoMotoForm.formState.errors.immatriculation && (
                          <p className="text-xs text-red-600 mt-1">{autoMotoForm.formState.errors.immatriculation.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="nom-am" className="text-sm font-semibold text-[#0B132B]">
                          Nom complet *
                        </Label>
                        <Input
                          id="nom-am"
                          placeholder="Jean Dupont"
                          {...autoMotoForm.register("nom")}
                          className="w-full box-border h-12 text-base rounded-xl border-slate-200 bg-slate-50 text-[#0B132B] placeholder:text-slate-400 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
                        />
                        {autoMotoForm.formState.errors.nom && (
                          <p className="text-xs text-red-600 mt-1">{autoMotoForm.formState.errors.nom.message}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="datePermis-am" className="text-sm font-semibold text-[#0B132B]">
                            Date d'obtention *
                          </Label>
                          <Input
                            id="datePermis-am"
                            type="date"
                            max={new Date().toISOString().split('T')[0]}
                            {...autoMotoForm.register("datePermis")}
                            className="w-full box-border h-12 text-base rounded-xl border-slate-200 bg-slate-50 text-[#0B132B] placeholder:text-slate-400 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
                          />
                          {autoMotoForm.formState.errors.datePermis && (
                            <p className="text-xs text-red-600 mt-1">{autoMotoForm.formState.errors.datePermis.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="categoriePermis-am" className="text-sm font-semibold text-[#0B132B]">
                            Catégorie permis *
                          </Label>
                          <select
                            id="categoriePermis-am"
                            {...autoMotoForm.register("categoriePermis")}
                            className="w-full box-border h-12 text-base rounded-xl border border-slate-200 bg-slate-50 px-3 text-[#0B132B] focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 outline-none transition-colors"
                          >
                            <option value="">Permis...</option>
                            {selectedChoice.id === "auto" ? (
                              <>
                                <option value="B">B</option>
                                <option value="B1">B1</option>
                                <option value="BE">BE</option>
                              </>
                            ) : (
                              <>
                                <option value="A">A</option>
                                <option value="AM">AM</option>
                                <option value="A1">A1</option>
                                <option value="A2">A2</option>
                              </>
                            )}
                          </select>
                          {autoMotoForm.formState.errors.categoriePermis && (
                            <p className="text-xs text-red-600 mt-1">{autoMotoForm.formState.errors.categoriePermis.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email-am" className="text-sm font-semibold text-[#0B132B]">
                          Adresse E-mail *
                        </Label>
                        <Input
                          id="email-am"
                          type="email"
                          placeholder="jean.dupont@exemple.com"
                          {...autoMotoForm.register("email")}
                          className="w-full box-border h-12 text-base rounded-xl border-slate-200 bg-slate-50 text-[#0B132B] placeholder:text-slate-400 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
                        />
                        {autoMotoForm.formState.errors.email && (
                          <p className="text-xs text-red-600 mt-1">{autoMotoForm.formState.errors.email.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="telephone-am" className="text-sm font-semibold text-[#0B132B]">
                          Numéro de téléphone *
                        </Label>
                        <Input
                          id="telephone-am"
                          placeholder="+33 6 12 34 56 78"
                          onChange={(e) => {
                            const formatted = formatTelephone(e.target.value);
                            e.target.value = formatted;
                            onTelephoneChangeB(e);
                          }}
                          {...telephoneRestB}
                          className="w-full box-border h-12 text-base rounded-xl border-slate-200 bg-slate-50 text-[#0B132B] placeholder:text-slate-400 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
                        />
                        {autoMotoForm.formState.errors.telephone && (
                          <p className="text-xs text-red-600 mt-1">{autoMotoForm.formState.errors.telephone.message}</p>
                        )}
                      </div>

                      <div className="space-y-4 pt-2 border-t border-slate-100">
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-[#0B132B]">
                            Avez-vous été assuré au cours des 3 dernières années ? *
                          </Label>
                          <div className="flex gap-6 mt-1.5">
                            <label className="flex items-center gap-2 text-sm font-medium text-[#0B132B] cursor-pointer">
                              <input
                                type="radio"
                                value="Oui"
                                {...autoMotoForm.register("dejaAssure")}
                                className="h-5 w-5 border-slate-300 text-[#D4AF37] focus:ring-[#D4AF37] accent-[#D4AF37]"
                              />
                              Oui
                            </label>
                            <label className="flex items-center gap-2 text-sm font-medium text-[#0B132B] cursor-pointer">
                              <input
                                type="radio"
                                value="Non"
                                {...autoMotoForm.register("dejaAssure")}
                                className="h-5 w-5 border-slate-300 text-[#D4AF37] focus:ring-[#D4AF37] accent-[#D4AF37]"
                              />
                              Non
                            </label>
                          </div>
                          {autoMotoForm.formState.errors.dejaAssure && (
                            <p className="text-xs text-red-600 mt-1">{autoMotoForm.formState.errors.dejaAssure.message}</p>
                          )}
                        </div>

                        {dejaAssureVal === "Oui" && (
                          <div className="space-y-4 border border-slate-200 rounded-2xl p-4 bg-slate-50/50 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="space-y-2">
                              <Label htmlFor="crm-am" className="text-sm font-semibold text-[#0B132B]">
                                CRM (Bonus/Malus) *
                              </Label>
                              <Input
                                id="crm-am"
                                type="text"
                                placeholder="1.00"
                                {...autoMotoForm.register("crm", {
                                  onChange: (e) => {
                                    let val = e.target.value.replace(/,/g, ".");
                                    const currentCrm = autoMotoForm.getValues("crm") || "";
                                    const nativeEvent = e.nativeEvent as any;
                                    const isDeletion =
                                      nativeEvent?.inputType === "deleteContentBackward" ||
                                      nativeEvent?.inputType === "deleteContentForward" ||
                                      nativeEvent?.inputType?.startsWith("delete") ||
                                      val.length < currentCrm.length;

                                    if (isDeletion) {
                                      autoMotoForm.setValue("crm", val);
                                      return;
                                    }
                                    if (/^[0-5]$/.test(val)) {
                                      val = val + ".";
                                    }
                                    const pattern = /^(?:0(?:\.(?:[5-9]\d?)?)?|[1-4](?:\.\d{0,2})?|5(?:\.(?:00?)?)?)?$/;
                                    if (val === "" || pattern.test(val)) {
                                      autoMotoForm.setValue("crm", val);
                                    }
                                  },
                                  onBlur: (e) => handleCrmBlur(e.target.value, (val) => autoMotoForm.setValue("crm", val)),
                                })}
                                className="w-full box-border h-12 text-base rounded-xl border-slate-200 bg-slate-50 text-[#0B132B] placeholder:text-slate-400 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
                              />
                              {autoMotoForm.formState.errors.crm && (
                                <p className="text-xs text-red-600 mt-1">{autoMotoForm.formState.errors.crm.message}</p>
                              )}
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-4 space-y-4">
                              <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-[#0B132B] tracking-wider uppercase">
                                  Période de début
                                </Label>
                                <div className="grid grid-cols-2 gap-3">
                                  <select
                                    value={startMonth}
                                    onChange={(e) => setStartMonth(e.target.value)}
                                    className="h-12 border border-slate-200 bg-white rounded-xl px-3 text-[#0B132B] focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 outline-none w-full"
                                  >
                                    <option value="">Mois</option>
                                    {monthsList.map((m) => (
                                      <option key={m} value={m}>{m}</option>
                                    ))}
                                  </select>
                                  <select
                                    value={startYear}
                                    onChange={(e) => setStartYear(e.target.value)}
                                    className="h-12 border border-slate-200 bg-white rounded-xl px-3 text-[#0B132B] focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 outline-none w-full"
                                  >
                                    <option value="">Année</option>
                                    {["2023", "2024", "2025", "2026"].map((y) => (
                                      <option key={y} value={y}>{y}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-[#0B132B] tracking-wider uppercase">
                                  Période de fin
                                </Label>
                                <div className="grid grid-cols-2 gap-3">
                                  <select
                                    value={endMonth}
                                    onChange={(e) => setEndMonth(e.target.value)}
                                    className="h-12 border border-slate-200 bg-white rounded-xl px-3 text-[#0B132B] focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 outline-none w-full"
                                  >
                                    <option value="">Mois</option>
                                    {monthsList.map((m, idx) => {
                                      const startYearNum = parseInt(startYear);
                                      const endYearNum = parseInt(endYear);
                                      const isMonthBeforeStart = 
                                        startYearNum && 
                                        endYearNum && 
                                        startYearNum === endYearNum && 
                                        startMonth && 
                                        idx < monthsList.indexOf(startMonth);

                                      return (
                                        <option 
                                          key={m} 
                                          value={m}
                                          disabled={!!isMonthBeforeStart}
                                        >
                                          {m}
                                        </option>
                                      );
                                    })}
                                  </select>
                                  <select
                                    value={endYear}
                                    onChange={(e) => setEndYear(e.target.value)}
                                    className="h-12 border border-slate-200 bg-white rounded-xl px-3 text-[#0B132B] focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 outline-none w-full"
                                  >
                                    <option value="">Année</option>
                                    {["2023", "2024", "2025", "2026"].map((y) => {
                                      const isYearBeforeStart = startYear && parseInt(y) < parseInt(startYear);
                                      return (
                                        <option 
                                          key={y} 
                                          value={y}
                                          disabled={!!isYearBeforeStart}
                                        >
                                          {y}
                                        </option>
                                      );
                                    })}
                                  </select>
                                </div>
                              </div>

                              <div className="flex justify-between items-center pt-2 text-sm font-semibold text-[#0B132B]">
                                <span>Total des périodes d'assurance : {selectedMonthsCount} mois</span>
                              </div>
                              {autoMotoForm.formState.errors.periodeAssurance && (
                                <p className="text-xs text-red-600 mt-1">{autoMotoForm.formState.errors.periodeAssurance.message}</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-slate-100 p-4 bg-white flex justify-between items-center shrink-0">
                      <Button
                        variant="ghost"
                        onClick={handleBackToStep1}
                        className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl px-5"
                        type="button"
                      >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Précédent
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#D4AF37] hover:bg-[#c39e2e] text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-[#D4AF37]/15 transition-all duration-300 border border-[#D4AF37]/20 cursor-pointer flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Envoi...
                          </>
                        ) : (
                          <>
                            Continuer vers l'agenda
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            ) : !isConfirmed ? (
              <form onSubmit={handleFinalSubmit} className="flex flex-col flex-1 overflow-hidden h-full">
                <div className="flex-1 overflow-y-auto max-h-[calc(95vh-140px)] md:max-h-[calc(85vh-140px)] px-6 py-4 space-y-4">
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Top Container (Appel immédiat) */}
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-4">
                    <p className="text-[#0B132B] font-semibold mb-4">Être rappelé rapidement (Appel immédiat)</p>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          setCallPreference("15min");
                          setError(null);
                        }}
                        className={`h-12 rounded-lg font-semibold text-sm transition-all duration-200 cursor-pointer border ${
                          callPreference === "15min"
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
                          setError(null);
                        }}
                        className={`h-12 rounded-lg font-semibold text-sm transition-all duration-200 cursor-pointer border ${
                          callPreference === "30min"
                            ? "bg-[#0B132B] text-white border-[#0B132B] shadow-md shadow-[#0B132B]/20"
                            : "bg-white text-[#0B132B] border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        30 min
                      </button>
                    </div>
                  </div>

                  {/* Bottom Container (Date ultérieure) */}
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <p className="text-[#0B132B] font-semibold mb-4">Ou choisir une date ultérieure</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="date"
                        min={todayString}
                        className="w-full h-12 px-4 border border-slate-300 rounded-lg text-[#0B132B] focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent bg-white"
                        value={callDate}
                        onChange={(e) => {
                          setCallDate(e.target.value);
                          setCallPreference('custom');
                        }}
                      />
                      <div className="flex gap-2">
                        <select
                          className="w-full h-12 px-4 border border-slate-300 rounded-lg text-[#0B132B] focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent bg-white"
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
                          className="w-full h-12 px-4 border border-slate-300 rounded-lg text-[#0B132B] focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent bg-white"
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

                {/* Footer Actions */}
                <div className="border-t border-slate-100 p-4 bg-white flex justify-between items-center shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="text-slate-500 hover:text-[#0B132B] font-semibold text-sm cursor-pointer"
                  >
                    ← Précédent
                  </button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#D4AF37] hover:bg-[#c39e2e] text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-[#D4AF37]/15 transition-all duration-300 border border-[#D4AF37]/20 cursor-pointer flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Confirmation...
                      </>
                    ) : (
                      "Confirmer le rendez-vous"
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center space-y-6 w-full max-w-full overflow-y-auto px-4 flex-1">
                <div className="bg-[#D4AF37]/10 p-4 rounded-full text-[#D4AF37] animate-bounce">
                  <CheckCircle className="h-16 w-16" />
                </div>

                <div className="space-y-2 max-w-md">
                  <DialogTitle className="text-2xl font-bold text-[#0B132B]">
                    Rendez-vous confirmed. À très vite !
                  </DialogTitle>
                  <DialogDescription className="text-slate-600 leading-relaxed text-sm">
                    Merci <span className="font-semibold text-slate-955">{submittedInfo?.nom}</span>. Votre demande de devis pour l'assurance <span className="font-semibold text-[#D4AF37]">{selectedChoice.title}</span> est pré-validée.
                  </DialogDescription>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl w-full max-w-md text-left border border-slate-200 space-y-3">
                  <p className="text-xs text-[#D4AF37] uppercase tracking-wider font-semibold">Détails de votre entretien</p>
                  <div className="text-sm space-y-1.5">
                    {callPreference === "15min" || callPreference === "30min" ? (
                      <>
                        <p className="text-slate-600"><span className="font-medium text-slate-500">Type de rappel :</span> Immédiat</p>
                        <p className="text-slate-600"><span className="font-medium text-slate-500">Délai :</span> {callPreference === "15min" ? "15 minutes" : "30 minutes"}</p>
                      </>
                    ) : (
                      <>
                        <p className="text-slate-600"><span className="font-medium text-slate-500">Type de rappel :</span> Planifié</p>
                        <p className="text-slate-600"><span className="font-medium text-slate-500">Date & Heure :</span> Le {callDate} à {callHour}:{callMinute}</p>
                      </>
                    )}
                    <p className="text-slate-600"><span className="font-medium text-slate-500">Téléphone de contact :</span> {submittedInfo?.telephone}</p>
                  </div>
                </div>

                <div className="w-full max-w-md pt-2">
                  <Button
                    onClick={handleClose}
                    className="w-full bg-[#0B132B] hover:bg-[#152244] text-white font-medium py-3 rounded-xl transition-all duration-300 cursor-pointer shadow-md"
                  >
                    Fermer la fenêtre
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
