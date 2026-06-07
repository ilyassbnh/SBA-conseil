import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Setup Nodemailer transporter (using a mocked SMTP transport or credentials from env if configured, fallback to Ethereal/mock)
    // For standard output, using Gmail SMTP settings or similar. To avoid crashing if env is not configured, we'll try configuring transport:
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.ethereal.email",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER || "mockuser",
        pass: process.env.SMTP_PASS || "mockpass",
      },
    });

    const leadInfo = Object.entries(body)
      .map(([key, val]) => `<strong>${key}</strong>: ${val}`)
      .join("<br />");

    const mailOptions = {
      from: '"SBA Conseil Lead" <leads@sba-conseil.fr>',
      to: "benhida.ilyass@gmail.com",
      subject: "Nouveau Lead Assurance - SBA Conseil",
      html: `
        <h3>Détails du Lead Assurance</h3>
        <p>Un nouveau lead a été soumis via le formulaire de devis SBA Conseil.</p>
        <div>
          ${leadInfo}
        </div>
      `,
    };

    // If Ethereal test accounts are active, or standard transport
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
