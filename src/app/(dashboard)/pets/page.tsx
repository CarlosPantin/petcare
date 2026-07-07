import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DeleteActionButton } from "@/components/ui/delete-action-button";
import { deletePet, getPets } from "@/server/actions/pets";

export default async function PetsPage() {
  const pets = await getPets();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Pets</h1>
        <Button asChild>
          <Link href="/pets/new">
            <Plus className="h-4 w-4" /> Add pet
          </Link>
        </Button>
      </div>

      {pets.length === 0 ? (
        <p className="text-muted-foreground">No pets yet. Add your first one to get started.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet) => (
            <Card key={pet.id} className="h-full transition-colors hover:border-primary">
              <CardHeader>
                <CardTitle>{pet.name}</CardTitle>
                <CardDescription>
                  {pet.species.charAt(0) + pet.species.slice(1).toLowerCase()}
                  {pet.breed ? ` · ${pet.breed}` : ""}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between gap-2">
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link href={`/pets/${pet.id}`}>View</Link>
                </Button>
                <DeleteActionButton
                  action={deletePet}
                  args={[pet.id]}
                  label="Delete"
                  confirmMessage={`Delete ${pet.name}? This will also remove their associated records and reminders.`}
                  variant="ghost"
                  size="sm"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
