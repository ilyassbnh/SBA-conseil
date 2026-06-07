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
} from "lucide-react";

interface InsuranceModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultChoiceId?: string;
  onShowToast?: (msg: string) => void;
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
  datePermis: z.string({ message: "La date d'obtention du permis est requise." }).regex(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/, "Format invalide (JJ/MM/AAAA)"),
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
    description: "Garanties conducteur, dommages et vol adaptées pour tous les motards et cylindrées.",
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

// Formatting helper for registration plate AA-123-AA
const formatImmatriculation = (val: string): string => {
  const cleaned = val.replace(/[^A-Za-z0-9]/g, "").toUpperCase();

  const lettersPart = cleaned.slice(0, 2).replace(/[^A-Z]/g, "");
  const numbersPart = cleaned.slice(2, 5).replace(/[^0-9]/g, "");
  const secondLettersPart = cleaned.slice(5, 7).replace(/[^A-Z]/g, "");

  let formatted = lettersPart;
  if (numbersPart) formatted += `-${numbersPart}`;
  if (secondLettersPart) formatted += `-${secondLettersPart}`;

  return formatted;
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

const monthsList = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

export function InsuranceModal({ isOpen, onOpenChange, defaultChoiceId, onShowToast }: InsuranceModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedChoice, setSelectedChoice] = useState<InsuranceChoice | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedInfo, setSubmittedInfo] = useState<{ nom: string; email: string; telephone: string } | null>(null);

  // Scheduling States
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [callDuration, setCallDuration] = useState<"15min" | "30min" | null>(null);
  const [appointmentDate, setAppointmentDate] = useState("");

  // Month Selector States
  const [startMonth, setStartMonth] = useState<string>("");
  const [startYear, setStartYear] = useState<string>("");
  const [endMonth, setEndMonth] = useState<string>("");
  const [endYear, setEndYear] = useState<string>("");

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
      telephone: "",
    },
  });

  // Path B Form
  const autoMotoForm = useForm<AutoMotoFormData>({
    resolver: zodResolver(autoMotoSchema),
    defaultValues: {
      nom: "",
      email: "",
      telephone: "",
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
        if (found.id === "sante" || found.id === "emprunteur" || found.id === "fad") {
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
  }, [isOpen, defaultChoiceId, onOpenChange, onShowToast]);

  const handleChoiceSelect = (choice: InsuranceChoice) => {
    if (choice.id === "sante" || choice.id === "emprunteur" || choice.id === "fad") {
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
      setCallDuration(null);
      setAppointmentDate("");
      setStartMonth("");
      setStartYear("");
      setEndMonth("");
      setEndYear("");
      trottinetteForm.reset();
      autoMotoForm.reset();
      setError(null);
    }, 200);
  };

  // Submit Path A
  const onTrottinetteSubmit = async (data: TrottinetteFormData) => {
    if (!selectedChoice) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        nom: data.nom,
        email: data.email,
        age: data.age,
        codePostal: data.codePostal,
        telephone: data.telephone,
        assuranceType: selectedChoice.title,
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
        throw new Error(errData.message || "Échec de l'envoi de la demande. Veuillez réessayer.");
      }

      setSubmittedInfo({ nom: data.nom, email: data.email, telephone: data.telephone });
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Une erreur inattendue est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Path B
  const onAutoMotoSubmit = async (data: AutoMotoFormData) => {
    if (!selectedChoice) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
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
        throw new Error(errData.message || "Échec de l'envoi de la demande. Veuillez réessayer.");
      }

      setSubmittedInfo({ nom: data.nom, email: data.email, telephone: data.telephone });
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Une erreur inattendue est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const { onChange: onImmatriculationChange, ...immatriculationRest } = autoMotoForm.register("immatriculation");
  const { onChange: onDatePermisChange, ...datePermisRest } = autoMotoForm.register("datePermis");

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

  const handleConfirmAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callDuration && !appointmentDate) {
      setError("Veuillez choisir soit un rappel immédiat, soit une date ultérieure.");
      return;
    }
    setError(null);

    console.log("----------------------------------------");
    console.log("📅 RDV CONFIRMÉ (SBA CONSEIL) !");
    console.log(`Prospect :          ${submittedInfo?.nom}`);
    console.log(`Email :             ${submittedInfo?.email}`);
    console.log(`Téléphone :         ${submittedInfo?.telephone}`);
    console.log(`Type d'assurance :  ${selectedChoice?.title}`);

    if (callDuration) {
      console.log(`Type de rappel :    Appel immédiat`);
      console.log(`Durée de l'appel :  ${callDuration === "15min" ? "15 minutes" : "30 minutes"}`);
    } else {
      console.log(`Type de rappel :    Appel planifié`);
      console.log(`Date & Heure :      ${appointmentDate}`);
    }
    console.log("----------------------------------------");

    setIsConfirmed(true);
  };

  const handleSelectDuration = (duration: "15min" | "30min") => {
    setCallDuration(duration);
    setAppointmentDate(""); 
    setError(null);
  };

  const handleSelectDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAppointmentDate(e.target.value);
    setCallDuration(null); 
    setError(null);
  };

  const formattedDate = appointmentDate
    ? new Date(appointmentDate).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" })
    : "";

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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? null : handleClose())}>
      <DialogContent className="sm:max-w-2xl bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl overflow-y-auto max-h-[90vh] shadow-2xl text-slate-900">
        {step === 1 && (
          <div className="space-y-6">
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
          <div className="space-y-6">
            <div className="flex items-center gap-3">
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
                    ? "Rendez-vous confirmé !"
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
              <>
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {error}
                  </div>
                )}

                {selectedChoice.id === "trottinette" ? (
                  <form onSubmit={trottinetteForm.handleSubmit(onTrottinetteSubmit)} className="space-y-5 w-full max-w-full overflow-hidden px-2 sm:px-4">
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
                        {...trottinetteForm.register("telephone")}
                        className="w-full box-border h-12 text-base rounded-xl border-slate-200 bg-slate-50 text-[#0B132B] placeholder:text-slate-400 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
                      />
                      {trottinetteForm.formState.errors.telephone && (
                        <p className="text-xs text-red-600 mt-1">{trottinetteForm.formState.errors.telephone.message}</p>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-200 gap-4 mt-6">
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
                  <form onSubmit={autoMotoForm.handleSubmit(onAutoMotoSubmit)} className="space-y-5 w-full max-w-full overflow-hidden px-2 sm:px-4">
                    {/* 1. Numéro d'immatriculation */}
                    <div className="space-y-2">
                      <Label htmlFor="immatriculation-am" className="text-sm font-semibold text-[#0B132B]">
                        Numéro d'immatriculation *
                      </Label>
                      <Input
                        id="immatriculation-am"
                        placeholder="AA-123-AA"
                        maxLength={9}
                        onChange={(e) => {
                          const formatted = formatImmatriculation(e.target.value);
                          e.target.value = formatted;
                          onImmatriculationChange(e);
                        }}
                        {...immatriculationRest}
                        className="w-full box-border h-12 text-base rounded-xl border-slate-200 bg-slate-50 text-[#0B132B] placeholder:text-slate-400 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 uppercase tracking-wider"
                      />
                      {autoMotoForm.formState.errors.immatriculation && (
                        <p className="text-xs text-red-600 mt-1">{autoMotoForm.formState.errors.immatriculation.message}</p>
                      )}
                    </div>

                    {/* 2. Nom complet */}
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

                    {/* 3. Date d'obtention / Catégorie permis row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="datePermis-am" className="text-sm font-semibold text-[#0B132B]">
                          Date d'obtention *
                        </Label>
                        <Input
                          id="datePermis-am"
                          type="text"
                          placeholder="DD/MM/YYYY"
                          maxLength={10}
                          onChange={(e) => {
                            const formatted = formatDate(e.target.value);
                            e.target.value = formatted;
                            onDatePermisChange(e);
                          }}
                          {...datePermisRest}
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

                    {/* 4. Adresse E-mail */}
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

                    {/* 5. Numéro de téléphone */}
                    <div className="space-y-2">
                      <Label htmlFor="telephone-am" className="text-sm font-semibold text-[#0B132B]">
                        Numéro de téléphone *
                      </Label>
                      <Input
                        id="telephone-am"
                        placeholder="+33 6 12 34 56 78"
                        {...autoMotoForm.register("telephone")}
                        className="w-full box-border h-12 text-base rounded-xl border-slate-200 bg-slate-50 text-[#0B132B] placeholder:text-slate-400 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
                      />
                      {autoMotoForm.formState.errors.telephone && (
                        <p className="text-xs text-red-600 mt-1">{autoMotoForm.formState.errors.telephone.message}</p>
                      )}
                    </div>

                    {/* 6. Question: "Avez-vous été assuré au cours des 3 dernières années ?" */}
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
                          {/* 1. First element: The CRM Bonus/Malus input field */}
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

                          {/* 2. Second element: The insurance period selector (Start and End Date dropdowns) */}
                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-4 space-y-4">
                            {/* Row 1 - Période de début */}
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

                            {/* Row 2 - Période de fin */}
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

                    <div className="flex justify-between items-center pt-4 border-t border-slate-200 gap-4 mt-6">
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
              </>
            ) : !isConfirmed ? (
              <form onSubmit={handleConfirmAppointment} className="space-y-6 w-full max-w-full overflow-hidden px-2 sm:px-4">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <Label className="text-sm font-semibold text-[#0B132B]">
                    Être rappelé rapidement (Appel immédiat)
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleSelectDuration("15min")}
                      className={`py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer ${
                        callDuration === "15min"
                          ? "bg-[#D4AF37] text-white border border-[#D4AF37] shadow-md shadow-[#D4AF37]/20"
                          : "bg-white text-[#0B132B] border border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      15 min
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectDuration("30min")}
                      className={`py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer ${
                        callDuration === "30min"
                          ? "bg-[#D4AF37] text-white border border-[#D4AF37] shadow-md shadow-[#D4AF37]/20"
                          : "bg-white text-[#0B132B] border border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      30 min
                    </button>
                  </div>
                </div>

                <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <Label htmlFor="appointment-date" className="text-sm font-semibold text-[#0B132B]">
                    Ou choisir une date ultérieure
                  </Label>
                  <input
                    id="appointment-date"
                    type="datetime-local"
                    value={appointmentDate}
                    onChange={handleSelectDate}
                    className="w-full bg-white border border-slate-300 text-[#0B132B] px-4 py-3.5 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none text-base h-12"
                  />
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-200 gap-4 mt-6">
                  <Button
                    variant="ghost"
                    onClick={() => setIsSubmitted(false)}
                    className="text-slate-500 hover:text-[#0B132B] hover:bg-slate-100 rounded-xl px-5"
                    type="button"
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Précédent
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#D4AF37] hover:bg-[#c39e2e] text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-[#D4AF37]/15 transition-all duration-300 border border-[#D4AF37]/20 cursor-pointer"
                  >
                    Confirmer le rendez-vous
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center space-y-6 w-full max-w-full overflow-hidden px-2 sm:px-4">
                <div className="bg-[#D4AF37]/10 p-4 rounded-full text-[#D4AF37] animate-bounce">
                  <CheckCircle className="h-16 w-16" />
                </div>

                <div className="space-y-2 max-w-md">
                  <DialogTitle className="text-2xl font-bold text-[#0B132B]">
                    Rendez-vous confirmé. À très vite !
                  </DialogTitle>
                  <DialogDescription className="text-slate-600 leading-relaxed text-sm">
                    Merci <span className="font-semibold text-slate-955">{submittedInfo?.nom}</span>. Votre demande de devis pour l'assurance <span className="font-semibold text-[#D4AF37]">{selectedChoice.title}</span> est pré-validée.
                  </DialogDescription>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl w-full max-w-md text-left border border-slate-200 space-y-3">
                  <p className="text-xs text-[#D4AF37] uppercase tracking-wider font-semibold">Détails de votre entretien</p>
                  <div className="text-sm space-y-1.5">
                    {callDuration ? (
                      <>
                        <p className="text-slate-600"><span className="font-medium text-slate-500">Type de rappel :</span> Immédiat</p>
                        <p className="text-slate-600"><span className="font-medium text-slate-500">Délai :</span> {callDuration === "15min" ? "15 minutes" : "30 minutes"}</p>
                      </>
                    ) : (
                      <>
                        <p className="text-slate-600"><span className="font-medium text-slate-500">Type de rappel :</span> Planifié</p>
                        <p className="text-slate-600"><span className="font-medium text-slate-500">Date & Heure :</span> {formattedDate}</p>
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
      </DialogContent>
    </Dialog>
  );
}
