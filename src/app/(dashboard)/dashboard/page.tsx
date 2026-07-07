import Link from "next/link";
import { HeartHandshake, PawPrint, Plus, Sparkles } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReminderList } from "@/components/reminders/reminder-list";
import { getPets } from "@/server/actions/pets";
import { getUpcomingReminders } from "@/server/actions/reminders";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const [pets, reminders] = await Promise.all([getPets(), getUpcomingReminders()]);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-br from-primary/10 via-background to-accent/10 p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/70 px-3 py-1 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" /> Pet care made simple
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Welcome back</h1>
              <p className="mt-2 text-base text-muted-foreground sm:text-lg">
                {pets.length === 0
                  ? "Add your first pet and start organizing their health, records, and routine in one place."
                  : `You’re keeping track of ${pets.length} pet${pets.length === 1 ? "" : "s"}, and there are ${reminders.length} upcoming care task${reminders.length === 1 ? "" : "s"} to stay on top of.`}
              </p>
            </div>
          </div>
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/pets/new">
              <Plus className="mr-2 h-4 w-4" /> Add pet
            </Link>
          </Button>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.65fr_0.95fr]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Your pets</h2>
              <p className="text-sm text-muted-foreground">Open a profile to review records and reminders.</p>
            </div>
          </div>

          {pets.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                <div className="rounded-full bg-primary/10 p-3 text-primary">
                  <PawPrint className="h-8 w-8" />
                </div>
                <div>
                  <p className="font-medium">No pets registered yet</p>
                  <p className="mt-1 text-sm text-muted-foreground">Start by adding your first pet to build a care hub.</p>
                </div>
                <Button asChild size="sm">
                  <Link href="/pets/new">Add your first pet</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {pets.map((pet) => (
                <Link key={pet.id} href={`/pets/${pet.id}`} className="group block">
                  <Card className="h-full border-border/80 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <CardTitle className="text-lg">{pet.name}</CardTitle>
                          <CardDescription>
                            {pet.species.charAt(0) + pet.species.slice(1).toLowerCase()}
                            {pet.breed ? ` · ${pet.breed}` : ""}
                          </CardDescription>
                        </div>
                        <div className="rounded-full bg-primary/10 p-2 text-primary">
                          <HeartHandshake className="h-4 w-4" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-muted-foreground">
                      <p>{pet.birthdate ? `Born ${formatDate(pet.birthdate)}` : "Birthdate not set"}</p>
                      <p className="text-primary transition-colors group-hover:text-primary/80">View profile →</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div>
          <Card className="h-full border-border/80 bg-card/80 shadow-sm">
            <CardHeader>
              <CardTitle>Upcoming tasks</CardTitle>
              <CardDescription>Quick view of due and upcoming reminders</CardDescription>
            </CardHeader>
            <CardContent>
              <ReminderList reminders={reminders} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
