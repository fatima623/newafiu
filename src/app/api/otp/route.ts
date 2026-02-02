import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { sendOTPEmail, generateOTP } from '@/lib/emailService';

// Store OTPs temporarily in database
// In production, you might want to use Redis for better performance

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, otp, purpose } = body;

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const validPurposes = ['booking', 'contact'];
    const selectedPurpose = validPurposes.includes(purpose) ? purpose : 'booking';

    const prisma = getPrisma();

    // Action: send - Generate and send OTP
    if (action === 'send') {
      // Check if there's a recent OTP sent (within last 60 seconds) to prevent spam
      const recentOTP = await prisma.emailOTP.findFirst({
        where: {
          email: normalizedEmail,
          purpose: selectedPurpose,
          createdAt: {
            gte: new Date(Date.now() - 60 * 1000), // 60 seconds ago
          },
        },
      });

      if (recentOTP) {
        const waitTime = Math.ceil((60 * 1000 - (Date.now() - recentOTP.createdAt.getTime())) / 1000);
        return NextResponse.json(
          { error: `Please wait ${waitTime} seconds before requesting a new code` },
          { status: 429 }
        );
      }

      // Generate new OTP
      const newOTP = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Delete any existing OTPs for this email/purpose
      await prisma.emailOTP.deleteMany({
        where: {
          email: normalizedEmail,
          purpose: selectedPurpose,
        },
      });

      // Store new OTP
      await prisma.emailOTP.create({
        data: {
          email: normalizedEmail,
          otp: newOTP,
          purpose: selectedPurpose,
          expiresAt,
          verified: false,
        },
      });

      // Send OTP email
      const sent = await sendOTPEmail({
        email: normalizedEmail,
        otp: newOTP,
        purpose: selectedPurpose as 'booking' | 'contact',
      });

      if (!sent) {
        return NextResponse.json(
          { error: 'Failed to send verification code. Please try again.' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Verification code sent to your email',
      });
    }

    // Action: verify - Verify OTP
    if (action === 'verify') {
      if (!otp || otp.length !== 6) {
        return NextResponse.json(
          { error: 'Please enter a valid 6-digit code' },
          { status: 400 }
        );
      }

      const otpRecord = await prisma.emailOTP.findFirst({
        where: {
          email: normalizedEmail,
          purpose: selectedPurpose,
          otp: otp,
          verified: false,
          expiresAt: {
            gte: new Date(),
          },
        },
      });

      if (!otpRecord) {
        // Check if there's an expired OTP
        const expiredOTP = await prisma.emailOTP.findFirst({
          where: {
            email: normalizedEmail,
            purpose: selectedPurpose,
            otp: otp,
          },
        });

        if (expiredOTP && expiredOTP.expiresAt < new Date()) {
          return NextResponse.json(
            { error: 'Verification code has expired. Please request a new one.' },
            { status: 400 }
          );
        }

        return NextResponse.json(
          { error: 'Invalid verification code' },
          { status: 400 }
        );
      }

      // Mark OTP as verified
      await prisma.emailOTP.update({
        where: { id: otpRecord.id },
        data: { verified: true },
      });

      return NextResponse.json({
        success: true,
        verified: true,
        message: 'Email verified successfully',
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Use "send" or "verify"' },
      { status: 400 }
    );
  } catch (error) {
    console.error('OTP error:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
