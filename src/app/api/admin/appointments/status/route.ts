import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getPrisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prisma = getPrisma();
    const body = await request.json();
    const { appointmentId, status } = body;

    if (!appointmentId || !status) {
      return NextResponse.json(
        { error: 'appointmentId and status are required' },
        { status: 400 }
      );
    }

    const validStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'EXPIRED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(appointmentId, 10) },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    const previousStatus = appointment.status;

    // Update appointment
    const updateData: Record<string, unknown> = { status };
    
    if (status === 'COMPLETED') {
      updateData.completedAt = new Date();
    } else if (status === 'CANCELLED') {
      updateData.cancelledAt = new Date();
      updateData.cancelReason = 'Cancelled by admin';
    }

    await prisma.appointment.update({
      where: { id: parseInt(appointmentId, 10) },
      data: updateData,
    });

    // Create audit log
    await prisma.appointmentAuditLog.create({
      data: {
        appointmentId: parseInt(appointmentId, 10),
        action: `STATUS_CHANGED_TO_${status}`,
        previousStatus: previousStatus,
        newStatus: status,
        performedBy: 'Admin',
        details: JSON.stringify({ changedBy: 'admin' }),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Appointment status updated to ${status}`,
    });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment status' },
      { status: 500 }
    );
  }
}
