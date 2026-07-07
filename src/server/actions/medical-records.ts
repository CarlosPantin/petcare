"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { medicalRecordSchema, type MedicalRecordInput } from "@/lib/validations";
import { requireUser } from "@/server/session";
import type { ActionResult } from "@/server/actions/auth";

async function assertPetOwnership(petId: string, userId: string) {
  const pet = await prisma.pet.findFirst({ where: { id: petId, userId } });
  if (!pet) throw new Error("Pet not found or access denied");
  return pet;
}

export async function createMedicalRecord(
  input: MedicalRecordInput
): Promise<ActionResult<{ id: string }>> {
  const user = await requireUser();
  const parsed = medicalRecordSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { petId, recordType, date, notes, clinicName, fileUrl } = parsed.data;

  try {
    await assertPetOwnership(petId, user.id);
  } catch {
    return { success: false, error: "Pet not found or access denied" };
  }

  const record = await prisma.medicalRecord.create({
    data: {
      petId,
      recordType,
      date: new Date(date),
      notes: notes || null,
      clinicName: clinicName || null,
      fileUrl: fileUrl || null,
    },
  });

  revalidatePath(`/pets/${petId}`);
  return { success: true, data: { id: record.id } };
}

export async function updateMedicalRecord(
  recordId: string,
  input: MedicalRecordInput
): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = medicalRecordSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { petId, recordType, date, notes, clinicName, fileUrl } = parsed.data;

  try {
    await assertPetOwnership(petId, user.id);
  } catch {
    return { success: false, error: "Pet not found or access denied" };
  }

  await prisma.medicalRecord.update({
    where: { id: recordId },
    data: {
      recordType,
      date: new Date(date),
      notes: notes || null,
      clinicName: clinicName || null,
      fileUrl: fileUrl || null,
    },
  });

  revalidatePath(`/pets/${petId}`);
  return { success: true };
}

export async function deleteMedicalRecord(recordId: string, petId: string): Promise<ActionResult> {
  const user = await requireUser();

  try {
    await assertPetOwnership(petId, user.id);
  } catch {
    return { success: false, error: "Pet not found or access denied" };
  }

  await prisma.medicalRecord.delete({ where: { id: recordId } });

  revalidatePath(`/pets/${petId}`);
  return { success: true };
}
