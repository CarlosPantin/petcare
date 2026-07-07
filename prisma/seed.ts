import { PrismaClient, Species, RecordType, ReminderStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@petcare.app" },
    update: {},
    create: {
      email: "demo@petcare.app",
      name: "Demo User",
      hashedPassword,
    },
  });

  const pet = await prisma.pet.create({
    data: {
      userId: user.id,
      name: "Buddy",
      species: Species.DOG,
      breed: "Golden Retriever",
      birthdate: new Date("2021-04-12"),
      weightKg: 28.5,
      microchipNumber: "985121000000000",
    },
  });

  await prisma.medicalRecord.create({
    data: {
      petId: pet.id,
      recordType: RecordType.VACCINE,
      date: new Date("2025-03-01"),
      notes: "Rabies vaccine administered, no adverse reaction.",
      clinicName: "Sunny Hills Veterinary Clinic",
    },
  });

  await prisma.reminder.create({
    data: {
      petId: pet.id,
      taskName: "Annual checkup",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      isRecurring: true,
      status: ReminderStatus.PENDING,
    },
  });

  console.log("Seed complete. Demo login: demo@petcare.app / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
