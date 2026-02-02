import nodemailer from 'nodemailer';

// Email configuration - uses environment variables
const getTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const FROM_EMAIL = process.env.SMTP_FROM || 'AFIU Appointments <noreply@afiu.org.pk>';

interface AppointmentUpdateEmailData {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  oldDoctorName: string;
  newDoctorName: string;
  oldDate: Date;
  newDate: Date;
  oldSlotStart: string;
  oldSlotEnd: string;
  newSlotStart: string;
  newSlotEnd: string;
  reason: string;
  changes: string[];
}

interface AppointmentCancellationEmailData {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorName: string;
  appointmentDate: Date;
  slotStartTime: string;
  slotEndTime: string;
  reason: string;
}

interface OTPEmailData {
  email: string;
  otp: string;
  purpose: 'booking' | 'contact';
}

// Format time for display
const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
};

// Format date for display
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export async function sendAppointmentUpdateEmail(data: AppointmentUpdateEmailData): Promise<boolean> {
  try {
    const transporter = getTransporter();
    
    const changesHtml = data.changes.map(change => `<li>${change}</li>`).join('');
    
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
    .info-box { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #2A7B9B; }
    .reason-box { background: #fef3c7; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #f59e0b; }
    h1 { margin: 0; font-size: 24px; }
    .changes-list { margin: 10px 0; padding-left: 20px; }
    .changes-list li { margin: 5px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Appointment Updated</h1>
      <p>Armed Forces Institute of Urology</p>
    </div>
    <div class="content">
      <p>Dear <strong>${data.patientName}</strong>,</p>
      <p>Your appointment has been updated by our administration. Please see the changes below:</p>
      
      <div class="reason-box">
        <strong>Reason for Update:</strong>
        <p>${data.reason}</p>
      </div>
      
      <div class="info-box">
        <strong>Changes Made:</strong>
        <ul class="changes-list">
          ${changesHtml}
        </ul>
      </div>
      
      <div class="info-box">
        <strong>Updated Appointment Details:</strong>
        <p><strong>Doctor:</strong> ${data.newDoctorName}</p>
        <p><strong>Date:</strong> ${formatDate(data.newDate)}</p>
        <p><strong>Time:</strong> ${formatTime(data.newSlotStart)} - ${formatTime(data.newSlotEnd)}</p>
      </div>
      
      <p>Please arrive at least 15 minutes before your scheduled time.</p>
      <p>If you have any questions, please contact us at +92 51 5562331.</p>
    </div>
    <div class="footer">
      <p>Armed Forces Institute of Urology (AFIU)</p>
      <p>This is an automated message. Please do not reply.</p>
    </div>
  </div>
</body>
</html>
    `;

    await transporter.sendMail({
      from: FROM_EMAIL,
      to: data.patientEmail,
      subject: 'AFIU - Your Appointment Has Been Updated',
      html,
    });

    return true;
  } catch (error) {
    console.error('Failed to send appointment update email:', error);
    return false;
  }
}

export async function sendAppointmentCancellationEmail(data: AppointmentCancellationEmailData): Promise<boolean> {
  try {
    const transporter = getTransporter();
    
    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #dc2626, #991b1b); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
    .footer { background: #051238; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; }
    .info-box { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #dc2626; }
    .reason-box { background: #fee2e2; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #dc2626; }
    h1 { margin: 0; font-size: 24px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Appointment Cancelled</h1>
      <p>Armed Forces Institute of Urology</p>
    </div>
    <div class="content">
      <p>Dear <strong>${data.patientName}</strong>,</p>
      <p>We regret to inform you that your appointment has been cancelled.</p>
      
      <div class="reason-box">
        <strong>Reason for Cancellation:</strong>
        <p>${data.reason}</p>
      </div>
      
      <div class="info-box">
        <strong>Cancelled Appointment Details:</strong>
        <p><strong>Doctor:</strong> ${data.doctorName}</p>
        <p><strong>Date:</strong> ${formatDate(data.appointmentDate)}</p>
        <p><strong>Time:</strong> ${formatTime(data.slotStartTime)} - ${formatTime(data.slotEndTime)}</p>
      </div>
      
      <p>We apologize for any inconvenience caused. Please book a new appointment at your earliest convenience.</p>
      <p>For urgent queries, please contact us at +92 51 5562331.</p>
    </div>
    <div class="footer">
      <p>Armed Forces Institute of Urology (AFIU)</p>
      <p>This is an automated message. Please do not reply.</p>
    </div>
  </div>
</body>
</html>
    `;

    await transporter.sendMail({
      from: FROM_EMAIL,
      to: data.patientEmail,
      subject: 'AFIU - Your Appointment Has Been Cancelled',
      html,
    });

    return true;
  } catch (error) {
    console.error('Failed to send appointment cancellation email:', error);
    return false;
  }
}

export async function sendOTPEmail(data: OTPEmailData): Promise<boolean> {
  try {
    const transporter = getTransporter();
    
    const purposeText = data.purpose === 'booking' 
      ? 'appointment booking' 
      : 'contact form submission';
    
    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #051238, #2A7B9B); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; text-align: center; }
    .footer { background: #051238; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; }
    .otp-box { background: white; padding: 30px; border-radius: 8px; margin: 20px 0; border: 2px dashed #2A7B9B; }
    .otp-code { font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #051238; font-family: monospace; }
    h1 { margin: 0; font-size: 24px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Email Verification</h1>
      <p>Armed Forces Institute of Urology</p>
    </div>
    <div class="content">
      <p>Your verification code for ${purposeText} is:</p>
      
      <div class="otp-box">
        <div class="otp-code">${data.otp}</div>
      </div>
      
      <p>This code will expire in <strong>10 minutes</strong>.</p>
      <p style="color: #666; font-size: 14px;">If you did not request this code, please ignore this email.</p>
    </div>
    <div class="footer">
      <p>Armed Forces Institute of Urology (AFIU)</p>
      <p>This is an automated message. Please do not reply.</p>
    </div>
  </div>
</body>
</html>
    `;

    await transporter.sendMail({
      from: FROM_EMAIL,
      to: data.email,
      subject: `AFIU - Your Verification Code: ${data.otp}`,
      html,
    });

    return true;
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    return false;
  }
}

// Generate a 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
