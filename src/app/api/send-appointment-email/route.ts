import { resend } from "@/lib/resend";
import { NextResponse } from "next/server";
import AppointmentConfirmationEmail from "@/components/emails/AppointmentConfirmationEmail";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      price,
      duration,
      userEmail,
      doctorName,
      appointmentType,
      appointmentDate,
      appointmentTime,
    } = body;

    if (!userEmail || !doctorName || !appointmentDate || !appointmentTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "DentWise <rubinbaidhya@rubinbaidhya.com.np>",
      to: [userEmail],
      subject: "Appointment Confirmation 🦷 - DentWise",
      react: AppointmentConfirmationEmail({
        doctorName,
        appointmentDate,
        appointmentTime,
        appointmentType,
        duration,
        price,
      }),
    });

    if (error) {
      console.error("Failed to send email:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
