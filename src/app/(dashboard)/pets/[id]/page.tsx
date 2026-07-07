import Link from "next/link";
import { notFound } from "next/navigation";
import { Bell, FileText, PawPrint, Pencil, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteActionButton } from "@/components/ui/delete-action-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MedicalRecordForm } from "@/components/records/medical-record-form";
import { ReminderForm } from "@/components/reminders/reminder-form";
import { deleteMedicalRecord } from "@/server/actions/medical-records";
import { deleteReminder } from "@/server/actions/reminders";
import { deletePet, getPetById } from "@/server/actions/pets";
import { formatDate } from "@/lib/utils";

export default async function PetDetailPage({ params }: { params: { id: string } }) {
  const pet = await getPetById(params.id);

  if (!pet) notFound();

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-br from-primary/10 via-background to-accent/10 p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-background/80 p-3 text-primary shadow-sm">
              <PawPrint className="h-7 w-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/70 px-3 py-1 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" /> Pet profile
              </div>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight">{pet.name}</h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
                {pet.species.charAt(0) + pet.species.slice(1).toLowerCase()}
                {pet.breed ? ` · ${pet.breed}` : ""}
                {pet.birthdate ? ` · Born ${formatDate(pet.birthdate)}` : ""}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline">
              <Link href={`/pets/${pet.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </Link>
            </Button>
            <DeleteActionButton
              action={deletePet}
              args={[pet.id]}
              redirectTo="/pets"
              confirmMessage={`Delete ${pet.name}? This will also remove their associated records and reminders.`}
            />
          </div>
        </div>
      </section>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Care overview</h2>
            <p className="text-sm text-muted-foreground">Track records, reminders, and next steps in one place.</p>
          </div>
        </div>

        <Tabs defaultValue="records" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:w-fit">
            <TabsTrigger value="records">
              <FileText className="mr-2 h-4 w-4" /> Medical records
            </TabsTrigger>
            <TabsTrigger value="reminders">
              <Bell className="mr-2 h-4 w-4" /> Reminders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="records" className="mt-4 space-y-4">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-3">
                {pet.medicalRecords.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
                      <div className="rounded-full bg-primary/10 p-3 text-primary">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-medium">No medical records yet</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Add the first record to keep your pet’s health history organized.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  pet.medicalRecords.map((record) => (
                    <Card key={record.id} className="transition-colors hover:border-primary/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                          {record.recordType.charAt(0) + record.recordType.slice(1).toLowerCase()} · {formatDate(record.date)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm text-muted-foreground">
                        <div className="space-y-1">
                          {record.clinicName && <p>Clinic: {record.clinicName}</p>}
                          {record.notes && <p>{record.notes}</p>}
                          {record.fileUrl && (
                            <a
                              href={record.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block text-primary underline-offset-4 hover:underline"
                            >
                              View attached document
                            </a>
                          )}
                        </div>
                        <div className="flex justify-end">
                          <DeleteActionButton
                            action={deleteMedicalRecord}
                            args={[record.id, pet.id]}
                            label="Remove"
                            confirmMessage="Delete this medical record?"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="text-base">Add a record</CardTitle>
                </CardHeader>
                <CardContent>
                  <MedicalRecordForm petId={pet.id} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reminders" className="mt-4 space-y-4">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-3">
                {pet.reminders.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
                      <div className="rounded-full bg-accent/20 p-3 text-accent-foreground">
                        <Bell className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-medium">No reminders yet</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Create reminders for vaccines, checkups, or daily care.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  pet.reminders.map((reminder) => (
                    <Card key={reminder.id} className="transition-colors hover:border-primary/30">
                      <CardContent className="flex items-center justify-between gap-3 py-4">
                        <div>
                          <p className="font-medium">{reminder.taskName}</p>
                          <p className="text-sm text-muted-foreground">
                            Due {formatDate(reminder.dueDate)}
                            {reminder.isRecurring && " · Recurring"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={
                              reminder.status === "COMPLETED"
                                ? "rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                                : "rounded-full bg-accent/20 px-3 py-1 text-xs font-medium"
                            }
                          >
                            {reminder.status === "COMPLETED" ? "Completed" : "Pending"}
                          </span>
                          <DeleteActionButton
                            action={deleteReminder}
                            args={[reminder.id]}
                            label="Delete"
                            confirmMessage="Delete this reminder?"
                            variant="ghost"
                            size="sm"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="text-base">Add a reminder</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReminderForm petId={pet.id} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
