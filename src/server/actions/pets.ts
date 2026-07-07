"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { petSchema, type PetInput } from "@/lib/validations";
import { requireUser } from "@/server/session";
import type { ActionResult } from "@/server/actions/auth";

export async function getPets() {
  const user = await requireUser();
  return prisma.pet.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPetById(petId: string) {
  const user = await requireUser();
  const pet = await prisma.pet.findFirst({
    where: { id: petId, userId: user.id },
    include: {
      medicalRecords: { orderBy: { date: "desc" } },
      reminders: { orderBy: { dueDate: "asc" } },
    },
  });
  return pet;
}

export async function createPet(input: PetInput): Promise<ActionResult<{ id: string }>> {
  const user = await requireUser();
  const parsed = petSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { name, species, breed, birthdate, weightKg, microchipNumber } = parsed.data;

  const pet = await prisma.pet.create({
    data: {
      userId: user.id,
      name,
      species,
      breed: breed || null,
      birthdate: birthdate ? new Date(birthdate) : null,
      weightKg: weightKg ?? null,
      microchipNumber: microchipNumber || null,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/pets");
  return { success: true, data: { id: pet.id } };
}

export async function updatePet(petId: string, input: PetInput): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = petSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const existing = await prisma.pet.findFirst({ where: { id: petId, userId: user.id } });
  if (!existing) {
    return { success: false, error: "Pet not found" };
  }

  const { name, species, breed, birthdate, weightKg, microchipNumber } = parsed.data;

  await prisma.pet.update({
    where: { id: petId },
    data: {
      name,
      species,
      breed: breed || null,
      birthdate: birthdate ? new Date(birthdate) : null,
      weightKg: weightKg ?? null,
      microchipNumber: microchipNumber || null,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/pets/${petId}`);
  return { success: true };
}

export async function deletePet(petId: string): Promise<ActionResult> {
  const user = await requireUser();

  const existing = await prisma.pet.findFirst({ where: { id: petId, userId: user.id } });
  if (!existing) {
    return { success: false, error: "Pet not found" };
  }

  await prisma.pet.delete({ where: { id: petId } });

  revalidatePath("/dashboard");
  revalidatePath("/pets");
  return { success: true };
}
