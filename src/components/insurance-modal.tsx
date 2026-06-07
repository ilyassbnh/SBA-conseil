"use client";

import React, { useState } from "react";
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
} from "lucide-react";

interface InsuranceModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultChoiceId?: string;
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

// Zod Schema Path B: Automobile / Moto (Enhanced with permit category and CRM range)
const autoMotoSchema = z.object({
  immatriculation: z
    .string({ message: "Le numéro d'immatriculation est requis." })
    .min(1, "Le numéro d'immatriculation est requis.")
    .regex(/^[A-Z]{2}-\d{3}-[A-Z]{2}$/i, "Format d'immatriculation invalide. Exemple: AA-123-AA"),
  nom: z.string({ message: "Le nom complet est requis." }).min(1, "Le nom complet est requis."),
  datePermis: z.string({ message: "La date d'obtention du permis est requise." }).min(1, "La date d'obtention du permis est requise."),
  categoriePermis: z.string({ message: "La catégorie du permis est requise." }).min(1, "La catégorie du permis est requise."),
  email: z.string({ message: "L'adresse e-mail est requise." }).email("Adresse e-mail invalide."),
  telephone: z.string({ message: "Le numéro de téléphone est requis." }).min(8, "Le numéro de téléphone doit être valide."),
  dejaAssure: z.enum(["Oui", "Non"], {
    message: "Veuillez indiquer si vous avez été assuré au cours des 3 dernières années.",
  }),
  moisAssurance: z.string().optional(),
  crm: z
    .string({ message: "Le coefficient CRM (Bonus-Malus) est requis." })
    .min(1, "Le coefficient CRM est requis.")
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0.50 && num <= 5.00;
    }, { message: "Le CRM doit être compris entre 0.50 et 5.00." }),
}).refine((data) => {
  if (data.dejaAssure === "Oui" && (!data.moisAssurance || data.moisAssurance.trim() === "")) {
    return false;
  }
  return true;
}, {
  message: "Le nombre de mois d'assurance est requis.",
  path: ["moisAssurance"],
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
    iconColor: "text-[#AA7C11]",
  },
  {
    id: "auto",
    title: "Automobile",
    description: "Des formules Tous Risques ou au Tiers personnalisées pour vos véhicules de prestige ou du quotidien.",
    icon: Car,
    iconColor: "text-[#AA7C11]",
  },
  {
    id: "moto",
    title: "Moto",
    description: "Garanties conducteur, dommages et vol adaptées pour tous les motards and cylindrées.",
    icon: MotoIcon,
    iconColor: "text-[#AA7C11]",
  },
];

// Formatting helper for registration plate AA-123-AA
const formatImmatriculation = (val: string): string => {
  const cleaned = val.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  let formatted = "";
  
  for (let i = 0; i < cleaned.length && i < 7; i++) {
    const char = cleaned[i];
    if (i < 2) {
      if (/[A-Z]/.test(char)) {
        formatted += char;
      }
    } else if (i < 5) {
      if (/[0-9]/.test(char)) {
        if (i === 2 && formatted.length === 2) {
          formatted += "-";
        }
        formatted += char;
      }
    } else {
      if (/[A-Z]/.test(char)) {
        if (i === 5 && formatted.length === 6) {
          formatted += "-";
        }
        formatted += char;
      }
    }
  }
  return formatted;
};

export function InsuranceModal({ isOpen, onOpenChange, defaultChoiceId }: InsuranceModalProps) {
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
      immatriculation: "",
      nom: "",
      datePermis: "",
      categoriePermis: "",
      email: "",
      telephone: "",
      dejaAssure: undefined,
      moisAssurance: "",
      crm: "",
    },
  });

  React.useEffect(() => {
    if (isOpen && defaultChoiceId) {
      const found = choices.find((c) => c.id === defaultChoiceId);
      if (found) {
        setSelectedChoice(found);
        setStep(2);
      }
    }
  }, [isOpen, defaultChoiceId]);

  const handleChoiceSelect = (choice: InsuranceChoice) => {
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
        immatriculation: data.immatriculation,
        nom: data.nom,
        datePermis: data.datePermis,
        categoriePermis: data.categoriePermis,
        email: data.email,
        telephone: data.telephone,
        assuranceType: selectedChoice.title,
        dejaAssure: data.dejaAssure,
        moisAssurance: data.dejaAssure === "Oui" ? data.moisAssurance : undefined,
        crm: data.crm,
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

  // Setup registration plate masking onChange handler
  const { onChange: onImmatriculationChange, ...immatriculationRest } = autoMotoForm.register("immatriculation");

  // Handle appointment confirmation
  const handleConfirmAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callDuration && !appointmentDate) {
      setError("Veuillez choisir soit un rappel immédiat, soit une date ultérieure.");
      return;
    }
    setError(null);

    // Console logging booking details
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

  // Mutex handlers for Scheduling
  const handleSelectDuration = (duration: "15min" | "30min") => {
    setCallDuration(duration);
    setAppointmentDate(""); // Clears date/time picker
    setError(null);
  };

  const handleSelectDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAppointmentDate(e.target.value);
    setCallDuration(null); // Clears immediate call duration
    setError(null);
  };

  const formattedDate = appointmentDate
    ? new Date(appointmentDate).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" })
    : "";

  const dejaAssureVal = autoMotoForm.watch("dejaAssure");

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? null : handleClose())}>
      <DialogContent className="sm:max-w-2xl bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl overflow-y-auto max-h-[90vh] shadow-2xl">
        {step === 1 && (
          <div className="space-y-6">
            <DialogHeader className="text-center sm:text-left">
              <DialogTitle className="text-2xl font-bold text-slate-900">
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
                    className="flex items-start gap-4 p-4.5 text-left rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-[#D4AF37]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#D4AF37]/5 hover:-translate-y-0.5 group cursor-pointer"
                  >
                    <div className="p-3.5 rounded-xl bg-[#D4AF37]/10 text-[#AA7C11] shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-slate-900 text-base group-hover:text-[#AA7C11] transition-colors">
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
            {/* Header section (conditional on state) */}
            <div className="flex items-center gap-3">
              {!isConfirmed && (
                <Button
                  variant="ghost"
                  onClick={isSubmitted ? () => setIsSubmitted(false) : handleBackToStep1}
                  className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl h-10 w-10 p-0"
                  type="button"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span className="sr-only">Retour</span>
                </Button>
              )}
              <DialogHeader className="flex-1">
                <DialogTitle className="text-2xl font-bold text-slate-900">
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

            {/* Content rendering based on states */}
            {!isSubmitted ? (
              /* LEAD FORMS VIEW */
              <>
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {error}
                  </div>
                )}

                {selectedChoice.id === "trottinette" ? (
                  /* PATH A: Trottinette */
                  <form onSubmit={trottinetteForm.handleSubmit(onTrottinetteSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nom-t" className="text-sm font-medium text-slate-700">
                          Nom complet *
                        </Label>
                        <Input
                          id="nom-t"
                          placeholder="Jean Dupont"
                          {...trottinetteForm.register("nom")}
                          className="rounded-xl border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
                        />
                        {trottinetteForm.formState.errors.nom && (
                          <p className="text-xs text-red-600 mt-1">{trottinetteForm.formState.errors.nom.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email-t" className="text-sm font-medium text-slate-700">
                          Adresse E-mail *
                        </Label>
                        <Input
                          id="email-t"
                          type="email"
                          placeholder="jean.dupont@exemple.com"
                          {...trottinetteForm.register("email")}
                          className="rounded-xl border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
                        />
                        {trottinetteForm.formState.errors.email && (
                          <p className="text-xs text-red-600 mt-1">{trottinetteForm.formState.errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="age-t" className="text-sm font-medium text-slate-700">
                          Âge *
                        </Label>
                        <Input
                          id="age-t"
                          type="number"
                          placeholder="28"
                          {...trottinetteForm.register("age")}
                          className="rounded-xl border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
                        />
                        {trottinetteForm.formState.errors.age && (
                          <p className="text-xs text-red-600 mt-1">{trottinetteForm.formState.errors.age.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="codePostal-t" className="text-sm font-medium text-slate-700">
                          Code postal *
                        </Label>
                        <Input
                          id="codePostal-t"
                          placeholder="75002"
                          maxLength={5}
                          {...trottinetteForm.register("codePostal")}
                          className="rounded-xl border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
                        />
                        {trottinetteForm.formState.errors.codePostal && (
                          <p className="text-xs text-red-600 mt-1">{trottinetteForm.formState.errors.codePostal.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telephone-t" className="text-sm font-medium text-slate-700">
                        Numéro de téléphone *
                      </Label>
                      <Input
                        id="telephone-t"
                        placeholder="+33 6 12 34 56 78"
                        {...trottinetteForm.register("telephone")}
                        className="rounded-xl border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
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
                        className="bg-[#D4AF37] hover:bg-[#c39e2e] text-slate-950 font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-[#D4AF37]/15 transition-all duration-300 border border-[#D4AF37]/20 cursor-pointer flex items-center gap-2"
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
                  /* PATH B: Automobile / Moto */
                  <form onSubmit={autoMotoForm.handleSubmit(onAutoMotoSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="immatriculation-am" className="text-sm font-medium text-slate-700">
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
                          className="rounded-xl border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 uppercase tracking-wider py-5"
                        />
                        {autoMotoForm.formState.errors.immatriculation && (
                          <p className="text-xs text-red-600 mt-1">{autoMotoForm.formState.errors.immatriculation.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="crm-am" className="text-sm font-medium text-slate-700">
                          CRM (Bonus/Malus) *
                        </Label>
                        <Input
                          id="crm-am"
                          type="number"
                          min="0.50"
                          max="5.00"
                          step="0.01"
                          placeholder="0.68"
                          {...autoMotoForm.register("crm")}
                          className="rounded-xl border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
                        />
                        {autoMotoForm.formState.errors.crm && (
                          <p className="text-xs text-red-600 mt-1">{autoMotoForm.formState.errors.crm.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nom-am" className="text-sm font-medium text-slate-700">
                          Nom complet *
                        </Label>
                        <Input
                          id="nom-am"
                          placeholder="Jean Dupont"
                          {...autoMotoForm.register("nom")}
                          className="rounded-xl border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
                        />
                        {autoMotoForm.formState.errors.nom && (
                          <p className="text-xs text-red-600 mt-1">{autoMotoForm.formState.errors.nom.message}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="datePermis-am" className="text-sm font-medium text-slate-700">
                            Date d'obtention *
                          </Label>
                          <Input
                            id="datePermis-am"
                            type="date"
                            {...autoMotoForm.register("datePermis")}
                            className="rounded-xl border-slate-200 bg-slate-50 text-slate-900 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
                          />
                          {autoMotoForm.formState.errors.datePermis && (
                            <p className="text-xs text-red-600 mt-1">{autoMotoForm.formState.errors.datePermis.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="categoriePermis-am" className="text-sm font-medium text-slate-700">
                            Catégorie permis *
                          </Label>
                          <select
                            id="categoriePermis-am"
                            {...autoMotoForm.register("categoriePermis")}
                            className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 outline-none"
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
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email-am" className="text-sm font-medium text-slate-700">
                          Adresse E-mail *
                        </Label>
                        <Input
                          id="email-am"
                          type="email"
                          placeholder="jean.dupont@exemple.com"
                          {...autoMotoForm.register("email")}
                          className="rounded-xl border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
                        />
                        {autoMotoForm.formState.errors.email && (
                          <p className="text-xs text-red-600 mt-1">{autoMotoForm.formState.errors.email.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="telephone-am" className="text-sm font-medium text-slate-700">
                          Numéro de téléphone *
                        </Label>
                        <Input
                          id="telephone-am"
                          placeholder="+33 6 12 34 56 78"
                          {...autoMotoForm.register("telephone")}
                          className="rounded-xl border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
                        />
                        {autoMotoForm.formState.errors.telephone && (
                          <p className="text-xs text-red-600 mt-1">{autoMotoForm.formState.errors.telephone.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">
                          Avez-vous été assuré au cours des 3 dernières années ? *
                        </Label>
                        <div className="flex gap-4 mt-1.5">
                          <label className="flex items-center gap-2 text-sm text-slate-900 cursor-pointer">
                            <input
                              type="radio"
                              value="Oui"
                              {...autoMotoForm.register("dejaAssure")}
                              className="h-4 w-4 border-slate-300 text-[#D4AF37] focus:ring-[#D4AF37]"
                            />
                            Oui
                          </label>
                          <label className="flex items-center gap-2 text-sm text-slate-900 cursor-pointer">
                            <input
                              type="radio"
                              value="Non"
                              {...autoMotoForm.register("dejaAssure")}
                              className="h-4 w-4 border-slate-300 text-[#D4AF37] focus:ring-[#D4AF37]"
                            />
                            Non
                          </label>
                        </div>
                        {autoMotoForm.formState.errors.dejaAssure && (
                          <p className="text-xs text-red-600 mt-1">{autoMotoForm.formState.errors.dejaAssure.message}</p>
                        )}
                      </div>

                      {dejaAssureVal === "Oui" && (
                        <div className="space-y-2">
                          <Label htmlFor="moisAssurance-am" className="text-sm font-medium text-slate-700">
                            Nombre de mois d'assurance *
                          </Label>
                          <Input
                            id="moisAssurance-am"
                            type="number"
                            placeholder="24"
                            {...autoMotoForm.register("moisAssurance")}
                            className="rounded-xl border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
                          />
                          {autoMotoForm.formState.errors.moisAssurance && (
                            <p className="text-xs text-red-600 mt-1">{autoMotoForm.formState.errors.moisAssurance.message}</p>
                          )}
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
                        className="bg-[#D4AF37] hover:bg-[#c39e2e] text-slate-950 font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-[#D4AF37]/15 transition-all duration-300 border border-[#D4AF37]/20 cursor-pointer flex items-center gap-2"
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
              /* RESTURCTURED SPLIT SCHEDULING APPOINTMENT VIEW */
              <form onSubmit={handleConfirmAppointment} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {error}
                  </div>
                )}

                {/* Path A: Appel Immédiat */}
                <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <Label className="text-sm font-semibold text-slate-900">Être rappelé rapidement (Appel immédiat)</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleSelectDuration("15min")}
                      className={`py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
                        callDuration === "15min"
                          ? "bg-[#D4AF37] text-slate-950 border border-[#D4AF37] shadow-md shadow-[#D4AF37]/10"
                          : "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      15 min
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectDuration("30min")}
                      className={`py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
                        callDuration === "30min"
                          ? "bg-[#D4AF37] text-slate-950 border border-[#D4AF37] shadow-md shadow-[#D4AF37]/10"
                          : "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      30 min
                    </button>
                  </div>
                </div>

                {/* Path B: Planifier plus tard */}
                <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <Label htmlFor="appointment-date" className="text-sm font-semibold text-slate-900">
                    Ou choisir une date ultérieure
                  </Label>
                  <input
                    id="appointment-date"
                    type="datetime-local"
                    value={appointmentDate}
                    onChange={handleSelectDate}
                    className="w-full bg-white border border-slate-300 text-slate-900 px-4 py-3.5 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none text-base"
                  />
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-200 gap-4 mt-6">
                  <Button
                    variant="ghost"
                    onClick={() => setIsSubmitted(false)}
                    className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl px-5"
                    type="button"
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Précédent
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#D4AF37] hover:bg-[#c39e2e] text-slate-950 font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-[#D4AF37]/15 transition-all duration-300 border border-[#D4AF37]/20 cursor-pointer"
                  >
                    Confirmer le rendez-vous
                  </Button>
                </div>
              </form>
            ) : (
              /* APPOINTMENT CONFIRMED SUCCESS VIEW */
              <div className="flex flex-col items-center justify-center py-6 text-center space-y-6">
                <div className="bg-[#D4AF37]/10 p-4 rounded-full text-[#AA7C11] animate-bounce">
                  <CheckCircle className="h-16 w-16" />
                </div>

                <div className="space-y-2 max-w-md">
                  <DialogTitle className="text-2xl font-bold text-slate-900">
                    Rendez-vous confirmé. À très vite !
                  </DialogTitle>
                  <DialogDescription className="text-slate-600 leading-relaxed text-sm">
                    Merci <span className="font-semibold text-slate-950">{submittedInfo?.nom}</span>. Votre demande de devis pour l'assurance <span className="font-semibold text-[#AA7C11]">{selectedChoice.title}</span> est pré-validée.
                  </DialogDescription>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl w-full max-w-md text-left border border-slate-200 space-y-3">
                  <p className="text-xs text-[#AA7C11] uppercase tracking-wider font-semibold">Détails de votre entretien</p>
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
                    className="w-full bg-slate-800 hover:bg-slate-950 text-white font-medium py-3 rounded-xl transition-all duration-300 cursor-pointer shadow-md"
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
