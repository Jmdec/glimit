import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import nodemailer from "nodemailer"

// Email template for booking notifications
function generateEmailTemplate(
  bookingData: any,
  customMessage: string,
  emailType: "confirmation" | "update" | "cancellation" | "custom"
) {
  const { firstName, lastName, serviceType, date, time, guests, status } = bookingData

  let subject = ""
  let heading = ""
  let bodyText = ""

  switch (emailType) {
    case "confirmation":
      subject = `Booking Confirmation - ${serviceType}`
      heading = "Booking Confirmed! 🎉"
      bodyText = `Thank you for booking with us! We're excited to confirm your ${serviceType} appointment.`
      break
    case "update":
      subject = `Booking Update - ${serviceType}`
      heading = "Your Booking Has Been Updated"
      bodyText = `We wanted to let you know that your booking has been updated.`
      break
    case "cancellation":
      subject = `Booking Cancellation - ${serviceType}`
      heading = "Booking Cancellation Notice"
      bodyText = `We regret to inform you that your booking has been cancelled.`
      break
    case "custom":
      subject = `Message Regarding Your Booking - ${serviceType}`
      heading = "Update on Your Booking"
      bodyText = ""
      break
  }

  return {
    subject,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">${heading}</h1>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding: 40px;">
                      <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                        Hi ${firstName} ${lastName},
                      </p>
                      
                      ${bodyText ? `<p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">${bodyText}</p>` : ""}
                      
                      ${customMessage ? `
                        <div style="margin: 20px 0; padding: 20px; background-color: #f8f9fa; border-left: 4px solid #667eea; border-radius: 4px;">
                          <p style="margin: 0; color: #333333; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${customMessage}</p>
                        </div>
                      ` : ""}

                      <!-- Booking Details -->
                      <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                        <tr>
                          <td colspan="2" style="padding: 15px; background-color: #667eea; border-radius: 8px 8px 0 0;">
                            <h2 style="margin: 0; color: #ffffff; font-size: 18px; font-weight: bold;">Booking Details</h2>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 15px; border-bottom: 1px solid #e0e0e0; color: #666666; font-size: 14px; width: 40%;">
                            <strong>Service:</strong>
                          </td>
                          <td style="padding: 15px; border-bottom: 1px solid #e0e0e0; color: #333333; font-size: 14px;">
                            ${serviceType}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 15px; border-bottom: 1px solid #e0e0e0; color: #666666; font-size: 14px;">
                            <strong>Date:</strong>
                          </td>
                          <td style="padding: 15px; border-bottom: 1px solid #e0e0e0; color: #333333; font-size: 14px;">
                            ${date}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 15px; border-bottom: 1px solid #e0e0e0; color: #666666; font-size: 14px;">
                            <strong>Time:</strong>
                          </td>
                          <td style="padding: 15px; border-bottom: 1px solid #e0e0e0; color: #333333; font-size: 14px;">
                            ${time}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 15px; border-bottom: 1px solid #e0e0e0; color: #666666; font-size: 14px;">
                            <strong>Guests:</strong>
                          </td>
                          <td style="padding: 15px; border-bottom: 1px solid #e0e0e0; color: #333333; font-size: 14px;">
                            ${guests}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 15px; color: #666666; font-size: 14px;">
                            <strong>Status:</strong>
                          </td>
                          <td style="padding: 15px; color: #333333; font-size: 14px;">
                            <span style="display: inline-block; padding: 4px 12px; background-color: ${
                              status === "confirmed"
                                ? "#d4edda"
                                : status === "pending"
                                  ? "#fff3cd"
                                  : status === "cancelled"
                                    ? "#f8d7da"
                                    : "#d1ecf1"
                            }; color: ${
                              status === "confirmed"
                                ? "#155724"
                                : status === "pending"
                                  ? "#856404"
                                  : status === "cancelled"
                                    ? "#721c24"
                                    : "#0c5460"
                            }; border-radius: 4px; font-size: 13px; font-weight: 600; text-transform: capitalize;">
                              ${status}
                            </span>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 30px 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                        If you have any questions or need to make changes to your booking, please don't hesitate to contact us.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px 40px; background-color: #f8f9fa; border-top: 1px solid #e0e0e0;">
                      <p style="margin: 0 0 10px; color: #666666; font-size: 14px; text-align: center;">
                        Best regards,<br>
                        <strong>G-Limit Studio</strong>
                      </p>
                      <p style="margin: 0; color: #999999; font-size: 12px; text-align: center;">
                        This is an automated message. Please do not reply to this email.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { bookingId, customMessage, emailType = "custom" } = body

    // Verify admin authentication
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_token")?.value
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Fetch booking details from your Laravel API
    const bookingRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/bookings/${bookingId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!bookingRes.ok) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 })
    }

    const bookingData = await bookingRes.json()
    const booking = bookingData.booking || bookingData

    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Generate email content
    const { subject, html } = generateEmailTemplate(booking, customMessage, emailType)

    // Send email
    const info = await transporter.sendMail({
      from: `"Booking System" <${process.env.ADMIN_EMAIL}>`,
      to: booking.email,
      subject: subject,
      html: html,
    })

    console.log("Email sent: %s", info.messageId)

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      messageId: info.messageId,
    })
  } catch (error) {
    console.error("Email sending error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send email",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}