import Link from "next/link";
import { ArrowRight, CalendarClock, FileText, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Health history at a glance",
    description: "Store vet visits, medical records, and notes in one place.",
    icon: FileText,
  },
  {
    title: "Never miss a care task",
    description: "Create reminders for vaccines, checkups, and daily routines.",
    icon: CalendarClock,
  },
  {
    title: "Built for peace of mind",
    description: "Keep every important detail organized for your pet’s care journey.",
    icon: ShieldCheck,
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.14),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.15),_transparent_30%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <section className="overflow-hidden rounded-[2rem] border border-primary/10 bg-background/80 p-8 shadow-sm backdrop-blur sm:p-10 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" /> Pet care, beautifully organized
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                  Keep every pet detail in one calm, caring place.
                </h1>
                <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
                  PetCare helps you track medical records, reminders, and important milestones so your pet always gets the care they deserve.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-full">
                  <Link href="/register">
                    Get started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full">
                  <Link href="/login">Sign in</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-border/70 bg-gradient-to-br from-primary/10 via-background to-accent/10 p-6 shadow-sm">
              <div className="rounded-[1.25rem] border border-primary/10 bg-background/90 p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-3 text-primary">
                    <HeartHandshake className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold">Your pet care hub</p>
                    <p className="text-sm text-muted-foreground">All the essentials, always nearby.</p>
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  {[
                    "Vaccination and vet records",
                    "Upcoming care reminders",
                    "One-click access to pet profiles",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm text-foreground">
                      <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="border-border/70 shadow-sm">
                <CardHeader>
                  <div className="mb-2 inline-flex w-fit rounded-full bg-primary/10 p-2 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </section>
      </div>
    </main>
  );
}
