"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { reminderSchema, type ReminderInput } from "@/lib/validations";
import { requireUser } from "@/server/session";
import type { ActionResult } from "@/server/actions/auth";

async function assertPetOwnership(petId: string, userId: string) {
  const pet = await prisma.pet.findFirst({ where: { id: petId, userId } });
  if (!pet) throw new Error("Pet not found or access denied");
  return pet;
}

export async function getUpcomingReminders(limit = 10) {
  const user = await requireUser();

  return prisma.reminder.findMany({
    where: {
      status: "PENDING",
      pet: { userId: user.id },
    },
    orderBy: { dueDate: "asc" },
    take: limit,
    include: { pet: { select: { id: true, name: true, species: true } } },
  });
}

export async function createReminder(
  input: ReminderInput
): Promise<ActionResult<{ id: string }>> {
  const user = await requireUser();
  const parsed = reminderSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { petId, taskName, dueDate, isRecurring } = parsed.data;

  try {
    await assertPetOwnership(petId, user.id);
  } catch {
    return { success: false, error: "Pet not found or access denied" };
  }

  const reminder = await prisma.reminder.create({
    data: {
      petId,
      taskName,
      dueDate: new Date(dueDate),
      isRecurring,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/pets/${petId}`);
  return { success: true, data: { id: reminder.id } };
}

export async function toggleReminderStatus(reminderId: string): Promise<ActionResult> {
  const user = await requireUser();

  const reminder = await prisma.reminder.findFirst({
    where: { id: reminderId, pet: { userId: user.id } },
  });

  if (!reminder) {
    return { success: false, error: "Reminder not found" };
  }

  await prisma.reminder.update({
    where: { id: reminderId },
    data: { status: reminder.status === "PENDING" ? "COMPLETED" : "PENDING" },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/pets/${reminder.petId}`);
  return { success: true };
}

export async function deleteReminder(reminderId: string): Promise<ActionResult> {
  const user = await requireUser();

  const reminder = await prisma.reminder.findFirst({
    where: { id: reminderId, pet: { userId: user.id } },
  });

  if (!reminder) {
    return { success: false, error: "Reminder not found" };
  }

  await prisma.reminder.delete({ where: { id: reminderId } });

  revalidatePath("/dashboard");
  revalidatePath(`/pets/${reminder.petId}`);
  return { success: true };
}
