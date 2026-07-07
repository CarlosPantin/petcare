import { z } from "zod";

export const speciesEnum = z.enum(["DOG", "CAT", "BIRD", "RABBIT", "REPTILE", "OTHER"]);
export const recordTypeEnum = z.enum(["VACCINE", "VISIT", "EXAM"]);
export const reminderStatusEnum = z.enum(["PENDING", "COMPLETED"]);

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const petSchema = z.object({
  name: z.string().min(1, "Pet name is required").max(100),
  species: speciesEnum,
  breed: z.string().max(100).optional().or(z.literal("")),
  birthdate: z.string().optional().or(z.literal("")),
  weightKg: z.coerce.number().positive("Weight must be positive").optional(),
  microchipNumber: z.string().max(50).optional().or(z.literal("")),
});
export type PetInput = z.infer<typeof petSchema>;

export const medicalRecordSchema = z.object({
  petId: z.string().min(1),
  recordType: recordTypeEnum,
  date: z.string().min(1, "Date is required"),
  notes: z.string().max(2000).optional().or(z.literal("")),
  clinicName: z.string().max(200).optional().or(z.literal("")),
  fileUrl: z.string().url().optional().or(z.literal("")),
});
export type MedicalRecordInput = z.infer<typeof medicalRecordSchema>;

export const reminderSchema = z.object({
  petId: z.string().min(1),
  taskName: z.string().min(1, "Task name is required").max(200),
  dueDate: z.string().min(1, "Due date is required"),
  isRecurring: z.boolean().default(false),
});
export type ReminderInput = z.infer<typeof reminderSchema>;
