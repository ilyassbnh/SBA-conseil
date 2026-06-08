import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { callPreference, callDate, callTime, vehicleType, ...leadData } = body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const leadInfo = Object.entries(leadData)
      .map(([key, val]) => `<strong>${key}</strong>: ${val}`)
      .join("<br />");

    let availabilitySection = "";
    if (callPreference === "15min") {
      availabilitySection = "Le client souhaite être rappelé dans 15 minutes.";
    } else if (callPreference === "30min") {
      availabilitySection = "Le client souhaite être rappelé dans 30 minutes.";
    } else if (callPreference === "custom") {
      availabilitySection = `Le client a planifié un rappel pour le : ${callDate} à ${callTime}.`;
    } else {
      availabilitySection = "Aucune préférence de rappel indiquée.";
    }

    const mailOptions = {
      from: '"SBA Conseil Lead" <leads@sba-conseil.fr>',
      to: "benhida.ilyass@gmail.com",
      subject: `Nouveau Lead Assurance [${vehicleType || "Général"}] - SBA Conseil`,
      html: `
        <h3>Détails du Lead Assurance</h3>
        <p>Un nouveau lead a été soumis via le formulaire de devis SBA Conseil.</p>
        <div>
          ${leadInfo}
        </div>
        <hr style="border: 0; border-top: 1px solid #ccc; margin: 20px 0;" />
        <h3>Disponibilité pour le rappel</h3>
        <p>${availabilitySection}</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (sendErr) {
      console.error("Nodemailer send failed, logging fallback payload:", sendErr);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Error processing lead submit email route:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
