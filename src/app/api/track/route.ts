import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      event = "clicked_start_quote",
      url = "Inconnue",
      referrer = "Direct / Chat Link",
      userAgent = "Inconnu",
      screen = "Inconnu",
      language = "Inconnu",
      timestamp = new Date().toISOString(),
      buttonLabel = "Bouton Obtenir un devis",
    } = body;

    // Server-side network & Vercel geolocation headers
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "Localhost / Inconnue";
    const country = request.headers.get("x-vercel-ip-country") || "France (ou local)";
    const city = request.headers.get("x-vercel-ip-city") || "Inconnue (ou local)";
    const region = request.headers.get("x-vercel-ip-country-region") || "";
    const latitude = request.headers.get("x-vercel-ip-latitude") || "";
    const longitude = request.headers.get("x-vercel-ip-longitude") || "";
    const serverUserAgent = request.headers.get("user-agent") || userAgent;

    const locationSummary = city !== "Inconnue (ou local)" ? `${city}, ${country}` : country;

    // Send Looker Lead email notification if email credentials are configured
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const subject = `👀 [Looker Lead] Clic "Obtenir un devis" - ${locationSummary}`;

        const html = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <div style="background: #0B132B; padding: 22px 24px; text-align: center; border-bottom: 2px solid #D4AF37;">
              <h2 style="color: #D4AF37; margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1.5px;">SBA CONSEIL</h2>
              <p style="color: #ffffff; margin: 6px 0 0; font-size: 13px; font-weight: 500;">🔔 Notification Looker Lead</p>
            </div>

            <div style="padding: 24px; color: #1f2937;">
              <div style="background: #FEF9C3; border: 1px solid #FDE047; border-radius: 8px; padding: 14px 16px; margin-bottom: 20px;">
                <p style="margin: 0; color: #854D0E; font-size: 14px; font-weight: 600;">
                  ⚡ Un prospect vient de cliquer sur "Obtenir un devis" !
                </p>
                <p style="margin: 4px 0 0; color: #A16207; font-size: 12px;">
                  Ce visiteur a ouvert le formulaire pour démarrer une demande de devis.
                </p>
              </div>

              <!-- Vercel IP & Geolocation Box -->
              <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
                <h4 style="margin: 0 0 12px; color: #0B132B; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">
                  📍 Informations Réseau & Géolocalisation (Vercel IP)
                </h4>
                <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 5px 0; color: #6b7280; width: 140px;"><strong>Ville / Région :</strong></td>
                    <td style="padding: 5px 0; color: #111827; font-weight: 500;">${city} ${region ? `(${region})` : ""}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #6b7280;"><strong>Pays :</strong></td>
                    <td style="padding: 5px 0; color: #111827; font-weight: 500;">${country}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #6b7280;"><strong>Adresse IP :</strong></td>
                    <td style="padding: 5px 0; color: #111827; font-family: monospace; font-weight: 600;">${ip}</td>
                  </tr>
                  ${
                    latitude && longitude
                      ? `<tr>
                    <td style="padding: 5px 0; color: #6b7280;"><strong>Coordonnées :</strong></td>
                    <td style="padding: 5px 0; color: #111827; font-family: monospace;">${latitude}, ${longitude}</td>
                  </tr>`
                      : ""
                  }
                </table>
              </div>

              <!-- Client Navigation & Device Box -->
              <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px;">
                <h4 style="margin: 0 0 12px; color: #0B132B; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">
                  💻 Métadonnées Visiteur & Appareil
                </h4>
                <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 5px 0; color: #6b7280; width: 140px;"><strong>Bouton :</strong></td>
                    <td style="padding: 5px 0; color: #D4AF37; font-weight: bold;">${buttonLabel}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #6b7280;"><strong>Source / Referrer :</strong></td>
                    <td style="padding: 5px 0; color: #111827;">${referrer}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #6b7280;"><strong>Page URL :</strong></td>
                    <td style="padding: 5px 0; color: #111827; word-break: break-all;">${url}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #6b7280;"><strong>Résolution Écran :</strong></td>
                    <td style="padding: 5px 0; color: #111827;">${screen}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #6b7280;"><strong>Langue :</strong></td>
                    <td style="padding: 5px 0; color: #111827;">${language}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #6b7280;"><strong>Navigateur :</strong></td>
                    <td style="padding: 5px 0; color: #4b5563; font-size: 11px; font-family: monospace; word-break: break-all;">${serverUserAgent}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #6b7280;"><strong>Date & Heure :</strong></td>
                    <td style="padding: 5px 0; color: #111827;">${timestamp}</td>
                  </tr>
                </table>
              </div>

              <p style="font-size: 11px; color: #9ca3af; margin: 20px 0 0; text-align: center;">
                Ce courriel Looker Lead est déclenché silencieusement lors de l'interaction initiale avec les boutons Devis de SBA Conseil.
              </p>
            </div>
          </div>
        `;

        await transporter.sendMail({
          from: '"SBA Conseil Telemetry" <leads@sba-conseil.fr>',
          to: "benhida.ilyass@gmail.com",
          subject,
          html,
        });
      } catch (mailErr) {
        console.error("Erreur lors de l'envoi de l'email Looker Lead:", mailErr);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Erreur track route:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
