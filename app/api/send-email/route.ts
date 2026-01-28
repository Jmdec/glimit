import { labels } from "@/lib/constants"
import { formatDisplayTime, formatFullDate } from "@/lib/utils"
import { NextRequest } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: NextRequest) {
  const { firstName, lastName, email, message, phone, serviceType, date, time, guests } = await req.json()

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_SECURE || "587"),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const mailOptionsOthers = {
    from: `"G-Limit Studio Team" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `Booking Details`,
    html: `
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>Booking Details</title>
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <style>
        @media only screen and (max-width:600px) {
          .container{width:100% !important;padding:12px !important;}
          .hero{padding:18px !important;}
        }
      </style>
    </head>
    <body style="margin:0;padding:0;background-color:#f7f5f0;font-family:Helvetica,Arial,sans-serif;color:#333333;">

      <div style="display:none;max-height:0;overflow:hidden;color:#fff;opacity:0;">
        Your booking is confirmed 
      </div>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f5f0;">
        <tr>
          <td align="center" style="padding:24px;">
            
            <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:10px;border:2px solid #CDA434;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

              <!-- Header -->
              <tr>
                <td style="padding:20px 24px;border-bottom:1px solid #E8D8A8;background-color:#faf7ef;">
                  <table width="100%">
                    <tr>
                      <td align="left">
                        <img src="{company_logo_url}" alt="logo" width="140" style="display:block;">
                      </td>
                      <td align="right" style="font-size:14px;color:#CDA434;font-weight:600;text-transform:uppercase;">
                        Booking Request
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Hero -->
              <tr>
                <td class="hero" style="padding:28px 24px;">
                  <h1 style="margin:0;font-size:24px;color:#111827;font-weight:600;">Hi ${firstName},</h1>
                  <p style="margin-top:8px;font-size:15px;color:#6b7280;"> 
                    We've received your booking inquiry. Below are the details you submitted. 
                  </p>
                </td>
              </tr>

              <!-- Details Card -->
              <tr>
                <td style="padding:0 24px 24px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E8D8A8;border-radius:8px;">
                    <tr><td style="padding:16px;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="font-size:14px;color:#6b7280;padding-top:8px;">Name</td>
                        </tr>
                        <tr>
                          <td style="font-size:16px;color:#111827;padding-top:8px;">${firstName} ${lastName}</td>
                        </tr>
                        <tr>
                          <td style="font-size:14px;color:#6b7280;padding-top:8px;">Email</td>
                        </tr>
                        <tr>
                          <td style="font-size:16px;color:#111827;padding-top:8px;">${email}</td>
                        </tr>
                        <tr>
                          <td style="font-size:14px;color:#6b7280;padding-top:8px;">Phone</td>
                        </tr>
                        <tr>
                          <td style="font-size:16px;color:#111827;padding-top:8px;">${phone || "Not provided"}</td>
                        </tr>
                        <tr>
                          <td style="font-size:14px;color:#6b7280;padding-top:8px;">Date & Time</td>
                        </tr>
                        <tr>
                          <td style="font-size:16px;color:#111827;padding-top:8px;">${formatFullDate(date)} at ${formatDisplayTime(time)}</td>
                        </tr>
                        <tr>
                          <td style="font-size:14px;color:#6b7280;padding-top:8px;">Service</td>
                        </tr>
                        <tr>
                          <td style="font-size:16px;color:#111827;padding-top:8px;">
                           ${labels[serviceType as keyof typeof labels] || serviceType}
                          </td>
                        </tr>
                        <tr>
                          <td style="font-size:14px;color:#6b7280;padding-top:8px;">Guest</td>
                        </tr>
                        <tr>
                          <td style="font-size:16px;color:#111827;padding-top:8px;">${guests}</td>
                        </tr>
                        ${
                          message &&
                          `<tr>
                          <td style="font-size:14px;color:#6b7280;padding-top:8px;">Additional Details</td>
                        </tr>
                        <tr>
                          <td style="font-size:16px;color:#111827;padding-top:8px;">${message}</td>
                        </tr>`
                        }
                      </table>
                    </td></tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding:24px;background-color:#faf7ef;border-top:1px solid #E8D8A8;">
                  <p style="margin:0;font-size:13px;color:#6b7280;line-height:20px;">
                    <strong style="color:#111827;">G-Limit</strong><br>
                    {{company_address}}<br>
                    Need help? Email us at 
                    <a href="mailto:{{support_email}}" style="color:#CDA434;text-decoration:none;">{{support_email}}</a>.
                  </p>
                </td>
              </tr>

            </table>

            <p style="font-size:12px;color:#9ca3af;margin-top:10px;">
              © ${new Date().getFullYear()} G-Limit — All Rights Reserved
            </p>

          </td>
        </tr>
      </table>

    </body>
    </html>
    `,
  }

  try {
    await transporter.sendMail(mailOptionsOthers)
    return Response.json({ success: true, message: "Emails sent successfully!" })
  } catch (error: any) {
    console.error("Email error:", error)

    return Response.json({ success: false, error: error?.message || "Unknown error" }, { status: 500 })
  }
}
