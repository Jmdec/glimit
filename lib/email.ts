import nodemailer from 'nodemailer'

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

interface BookingEmailData {
  firstName: string
  lastName: string
  email: string
  phone: string
  serviceType: string
  date: string
  time: string
  guests: string
  message?: string
  status: string
}

// Send booking confirmation to client
export async function sendBookingConfirmationEmail(bookingData: BookingEmailData) {
  const { firstName, lastName, email, serviceType, date, time, guests, message } = bookingData

  const mailOptions = {
    from: `"G-Limit Photography" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Booking Confirmation - G-Limit Photography',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #d4a574 0%, #8b6f47 100%); color: white; padding: 30px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { padding: 10px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: bold; color: #8b6f47; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
            .status-badge { display: inline-block; padding: 5px 15px; background: #fef3c7; color: #92400e; border-radius: 20px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Confirmation</h1>
              <p>Thank you for choosing G-Limit Photography</p>
            </div>
            
            <div class="content">
              <p>Dear ${firstName} ${lastName},</p>
              
              <p>We have received your booking request. Here are the details:</p>
              
              <div class="booking-details">
                <div class="detail-row">
                  <span class="detail-label">Service:</span> ${serviceType}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date:</span> ${new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Time:</span> ${time}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Number of Guests:</span> ${guests}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Status:</span> <span class="status-badge">Pending</span>
                </div>
                ${message ? `<div class="detail-row"><span class="detail-label">Your Message:</span><br/>${message}</div>` : ''}
              </div>
              
              <p>We will review your booking and get back to you shortly. If you have any questions, please don't hesitate to contact us.</p>
              
              <p>Best regards,<br/>G-Limit Photography Team</p>
            </div>
            
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Booking confirmation email sent to:', email)
    return { success: true }
  } catch (error) {
    console.error('Error sending booking confirmation email:', error)
    return { success: false, error }
  }
}

// Send booking notification to admin
export async function sendAdminNotificationEmail(bookingData: BookingEmailData) {
  const { firstName, lastName, email, phone, serviceType, date, time, guests, message } = bookingData

  const mailOptions = {
    from: `"G-Limit Photography" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `New Booking Request - ${firstName} ${lastName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1f2937; color: white; padding: 30px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { padding: 10px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: bold; color: #1f2937; width: 150px; display: inline-block; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔔 New Booking Request</h1>
            </div>
            
            <div class="content">
              <p>A new booking request has been submitted:</p>
              
              <div class="booking-details">
                <div class="detail-row">
                  <span class="detail-label">Client Name:</span> ${firstName} ${lastName}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Email:</span> ${email}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Phone:</span> ${phone}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Service:</span> ${serviceType}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date:</span> ${new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Time:</span> ${time}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Guests:</span> ${guests}
                </div>
                ${message ? `<div class="detail-row"><span class="detail-label">Message:</span><br/>${message}</div>` : ''}
              </div>
              
              <p><strong>Please review and respond to this booking request.</strong></p>
            </div>
          </div>
        </body>
      </html>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Admin notification email sent')
    return { success: true }
  } catch (error) {
    console.error('Error sending admin notification email:', error)
    return { success: false, error }
  }
}

// Send booking approval email to client
export async function sendBookingApprovalEmail(bookingData: BookingEmailData) {
  const { firstName, lastName, email, serviceType, date, time, guests } = bookingData

  const mailOptions = {
    from: `"G-Limit Photography" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Booking Approved - G-Limit Photography',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { padding: 10px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: bold; color: #059669; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
            .status-badge { display: inline-block; padding: 5px 15px; background: #d1fae5; color: #065f46; border-radius: 20px; font-weight: bold; }
            .check-icon { font-size: 48px; color: #10b981; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="check-icon">✓</div>
              <h1>Booking Approved!</h1>
              <p>Your booking has been confirmed</p>
            </div>
            
            <div class="content">
              <p>Dear ${firstName} ${lastName},</p>
              
              <p>Great news! Your booking has been approved and confirmed.</p>
              
              <div class="booking-details">
                <div class="detail-row">
                  <span class="detail-label">Service:</span> ${serviceType}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date:</span> ${new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Time:</span> ${time}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Number of Guests:</span> ${guests}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Status:</span> <span class="status-badge">Confirmed</span>
                </div>
              </div>
              
              <p>We're looking forward to working with you! If you need to make any changes or have questions, please contact us.</p>
              
              <p>Best regards,<br/>G-Limit Photography Team</p>
            </div>
            
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Booking approval email sent to:', email)
    return { success: true }
  } catch (error) {
    console.error('Error sending booking approval email:', error)
    return { success: false, error }
  }
}

// Send booking status update email
export async function sendBookingStatusUpdateEmail(bookingData: BookingEmailData, oldStatus: string) {
  const { firstName, lastName, email, serviceType, date, time, status } = bookingData

  const statusColors: Record<string, { bg: string; text: string; gradient: string }> = {
    confirmed: { bg: '#d1fae5', text: '#065f46', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
    completed: { bg: '#dbeafe', text: '#1e40af', gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' },
    cancelled: { bg: '#fee2e2', text: '#991b1b', gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' },
    pending: { bg: '#fef3c7', text: '#92400e', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
  }

  const statusConfig = statusColors[status] || statusColors.pending

  const mailOptions = {
    from: `"G-Limit Photography" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `Booking Status Update - ${status.charAt(0).toUpperCase() + status.slice(1)}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: ${statusConfig.gradient}; color: white; padding: 30px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { padding: 10px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: bold; color: #1f2937; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
            .status-badge { display: inline-block; padding: 5px 15px; background: ${statusConfig.bg}; color: ${statusConfig.text}; border-radius: 20px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Status Update</h1>
              <p>Your booking status has been updated</p>
            </div>
            
            <div class="content">
              <p>Dear ${firstName} ${lastName},</p>
              
              <p>Your booking status has been updated from <strong>${oldStatus}</strong> to <strong>${status}</strong>.</p>
              
              <div class="booking-details">
                <div class="detail-row">
                  <span class="detail-label">Service:</span> ${serviceType}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date:</span> ${new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Time:</span> ${time}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Current Status:</span> <span class="status-badge">${status.charAt(0).toUpperCase() + status.slice(1)}</span>
                </div>
              </div>
              
              ${status === 'cancelled' ? '<p>We\'re sorry to see your booking has been cancelled. If you have any questions or concerns, please don\'t hesitate to contact us.</p>' : ''}
              ${status === 'completed' ? '<p>Thank you for choosing G-Limit Photography! We hope you enjoyed our service. We\'d love to hear your feedback.</p>' : ''}
              
              <p>If you have any questions, please contact us.</p>
              
              <p>Best regards,<br/>G-Limit Photography Team</p>
            </div>
            
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Booking status update email sent to:', email)
    return { success: true }
  } catch (error) {
    console.error('Error sending status update email:', error)
    return { success: false, error }
  }
}