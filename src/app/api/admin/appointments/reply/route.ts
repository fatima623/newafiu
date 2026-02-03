import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { appointmentId, patientEmail, patientName, subject, message } = body;

    // Validate required fields
    if (!patientEmail || !patientName || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (message.trim().length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters' },
        { status: 400 }
      );
    }

    // Check if in dev mode
    const isDevMode = process.env.DEV_MODE === 'true';

    if (isDevMode) {
      // Log the email in console for development
      console.log('\n========================================');
      console.log('📧 DEV MODE - REPLY EMAIL');
      console.log('========================================');
      console.log(`To: ${patientEmail}`);
      console.log(`Subject: ${subject}`);
      console.log(`Message:\n${message}`);
      console.log('========================================\n');

      return NextResponse.json({
        success: true,
        message: 'Email sent successfully (DEV MODE - logged to console)',
      });
    }

    // Production mode: Send actual email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #051238, #2A7B9B); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
    .footer { background: #051238; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; }
    .message-box { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #2A7B9B; }
    h1 { margin: 0; font-size: 24px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>AFIU - Message from Administration</h1>
      <p>Armed Forces Institute of Urology</p>
    </div>
    <div class="content">
      <p>Dear <strong>${patientName}</strong>,</p>
      
      <div class="message-box">
        ${message.replace(/\n/g, '<br>')}
      </div>
      
      <p>If you have any questions, please contact us at +92 51 5562331.</p>
    </div>
    <div class="footer">
      <p>Armed Forces Institute of Urology (AFIU)</p>
      <p>This is an official message from AFIU Administration.</p>
    </div>
  </div>
</body>
</html>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'AFIU <noreply@afiu.org.pk>',
      to: patientEmail,
      subject: subject,
      html,
    });

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
    });
  } catch (error) {
    console.error('Reply email error:', error);
    return NextResponse.json(
      { error: 'Failed to send email. Please try again.' },
      { status: 500 }
    );
  }
}
