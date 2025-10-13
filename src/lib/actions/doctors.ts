"use server";

import { Gender } from "@prisma/client";
import { prisma } from "../prisma";
import { generateAvatar } from "../utils";
import { revalidatePath } from "next/cache";

interface DoctorData {
  name: string;
  email: string;
  phone: string;
  specialty: string;
  gender: Gender;
  isActive: boolean;
}

interface UpdateDoctorData extends Partial<DoctorData> {
  id: string;
}

export async function getDoctors() {
  try {
    const doctors = await prisma.doctor.findMany({
      include: {
        _count: { select: { appointments: true } },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return doctors.map((doctor) => ({
      ...doctor,
      appointmentsCount: doctor._count.appointments,
    }));
  } catch (error) {
    console.log("Error fetching doctors:", error);
    throw new Error("Failed to fetch doctors");
  }
}

export async function addDoctor(doctorData: DoctorData) {
  try {
    if (!doctorData.name || !doctorData.email) {
      throw new Error("Name and email are required");
    }

    const doctor = await prisma.doctor.create({
      data: {
        ...doctorData,
        imageUrl: generateAvatar(doctorData.name, doctorData.gender),
      },
    });
    revalidatePath("/admin");
    return doctor;
  } catch (error: any) {
    console.log("Error adding doctor:", error);
    if (error?.code === "P2002") {
      throw new Error("A doctor with this email already exists");
    }
    throw new Error("Failed to add doctor");
  }
}

export async function updateDoctor(doctorData: UpdateDoctorData) {
  try {
    if (!doctorData.id) {
      throw new Error("Doctor ID is required");
    }
    if (!doctorData.name || !doctorData.email) {
      throw new Error("Name and email are required");
    }

    const currentDoctor = await prisma.doctor.findUnique({
      where: {
        id: doctorData.id,
      },
    });

    if (!currentDoctor) {
      throw new Error("Doctor not found");
    }

    if (doctorData.email !== currentDoctor.email) {
      const doctorWithSameEmail = await prisma.doctor.findUnique({
        where: {
          email: doctorData.email,
        },
      });
      if (doctorWithSameEmail) {
        throw new Error("A doctor with this email already exists");
      }
    }

    const doctor = await prisma.doctor.update({
      where: {
        id: doctorData.id,
      },
      data: {
        name: doctorData.name,
        email: doctorData.email,
        phone: doctorData.phone,
        specialty: doctorData.specialty,
        gender: doctorData.gender,
        isActive: doctorData.isActive,
      },
    });
    revalidatePath("/admin");
    return doctor;
  } catch (error: any) {
    console.log("Error updating doctor:", error);
    throw new Error("Failed to update doctor");
  }
}
