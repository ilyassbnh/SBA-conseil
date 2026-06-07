import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      nom,
      email,
      telephone,
      assuranceType,
      age,
      codePostal,
      immatriculation,
      datePermis,
      categoriePermis,
      dejaAssure,
      moisAssurance,
      crm,
    } = body;

    // 1. Validation du type d'assurance
    if (!assuranceType || typeof assuranceType !== "string") {
      return NextResponse.json(
        { success: false, message: "Le type d'assurance sélectionné est obligatoire." },
        { status: 400 }
      );
    }

    // 2. Validation de base des champs communs
    if (!nom || typeof nom !== "string" || nom.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Le nom complet est obligatoire." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, message: "Une adresse e-mail valide est obligatoire." },
        { status: 400 }
      );
    }

    if (!telephone || typeof telephone !== "string" || telephone.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Un numéro de téléphone est obligatoire." },
        { status: 400 }
      );
    }

    // 3. Validation conditionnelle selon le type de véhicule
    if (assuranceType === "Trottinette Électrique") {
      if (!age || typeof age !== "string" || age.trim() === "") {
        return NextResponse.json(
          { success: false, message: "L'âge est obligatoire pour l'assurance Trottinette Électrique." },
          { status: 400 }
        );
      }

      if (!codePostal || typeof codePostal !== "string" || !/^\d{5}$/.test(codePostal)) {
        return NextResponse.json(
          { success: false, message: "Un code postal valide à 5 chiffres est obligatoire." },
          { status: 400 }
        );
      }
    } else if (assuranceType === "Automobile" || assuranceType === "Moto") {
      if (!immatriculation || typeof immatriculation !== "string" || !/^[A-Z]{2}-\d{3}-[A-Z]{2}$/i.test(immatriculation)) {
        return NextResponse.json(
          { success: false, message: "Le numéro d'immatriculation est obligatoire et doit respecter le format AA-123-AA." },
          { status: 400 }
        );
      }

      if (!datePermis || typeof datePermis !== "string" || datePermis.trim() === "") {
        return NextResponse.json(
          { success: false, message: "La date d'obtention du permis est obligatoire." },
          { status: 400 }
        );
      }

      // Valider la catégorie de permis
      if (!categoriePermis || typeof categoriePermis !== "string") {
        return NextResponse.json(
          { success: false, message: "La catégorie du permis est obligatoire." },
          { status: 400 }
        );
      }

      if (assuranceType === "Automobile" && !["B", "B1", "BE"].includes(categoriePermis)) {
        return NextResponse.json(
          { success: false, message: "La catégorie de permis est invalide pour une assurance Automobile." },
          { status: 400 }
        );
      }

      if (assuranceType === "Moto" && !["A", "AM", "A1", "A2"].includes(categoriePermis)) {
        return NextResponse.json(
          { success: false, message: "La catégorie de permis est invalide pour une assurance Moto." },
          { status: 400 }
        );
      }

      // Valider le CRM (Bonus/Malus) entre 0.50 et 5.00
      if (!crm || typeof crm !== "string") {
        return NextResponse.json(
          { success: false, message: "Le coefficient de réduction majoration (CRM) est obligatoire." },
          { status: 400 }
        );
      }

      const crmNum = parseFloat(crm);
      if (isNaN(crmNum) || crmNum < 0.50 || crmNum > 5.00) {
        return NextResponse.json(
          { success: false, message: "Le CRM doit être un nombre compris entre 0.50 et 5.00." },
          { status: 400 }
        );
      }

      if (!dejaAssure || !["Oui", "Non"].includes(dejaAssure)) {
        return NextResponse.json(
          { success: false, message: "L'indication d'historique d'assurance (dejaAssure) est obligatoire." },
          { status: 400 }
        );
      }

      if (dejaAssure === "Oui") {
        if (!moisAssurance || typeof moisAssurance !== "string" || moisAssurance.trim() === "") {
          return NextResponse.json(
            { success: false, message: "Le nombre de mois d'assurance est obligatoire si vous avez été déjà assuré." },
            { status: 400 }
          );
        }
      }
    } else {
      return NextResponse.json(
        { success: false, message: "Type d'assurance inconnu." },
        { status: 400 }
      );
    }

    // Affichage des informations dans le terminal du serveur
    console.log("----------------------------------------");
    console.log("🎉 NOUVEAU PROSPECT REÇU (SBA CONSEIL) !");
    console.log(`Type d'assurance :  ${assuranceType}`);
    console.log(`Nom complet :       ${nom}`);
    console.log(`Adresse E-mail :    ${email}`);
    console.log(`Téléphone :         ${telephone}`);
    
    if (assuranceType === "Trottinette Électrique") {
      console.log("--- INFORMATIONS COMPLÉMENTAIRES ---");
      console.log(`Âge :               ${age}`);
      console.log(`Code Postal :       ${codePostal}`);
    } else {
      console.log("--- CARACTÉRISTIQUES VÉHICULE ---");
      console.log(`Immatriculation :   ${immatriculation}`);
      console.log(`Date Permis :       ${datePermis}`);
      console.log(`Catégorie Permis :  ${categoriePermis}`);
      console.log(`CRM (Bonus/Malus) : ${crm}`);
      console.log(`Déjà assuré :       ${dejaAssure}`);
      if (dejaAssure === "Oui") {
        console.log(`Mois d'assurance :  ${moisAssurance}`);
      }
    }
    console.log("----------------------------------------");

    return NextResponse.json(
      {
        success: true,
        message: "Votre demande de devis a été transmise avec succès. Notre équipe vous contactera rapidement.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erreur de l'API lors de la soumission du devis :", error);
    return NextResponse.json(
      {
        success: false,
        message: "Une erreur est survenue lors du traitement de votre demande. Veuillez réessayer.",
      },
      { status: 500 }
    );
  }
}
