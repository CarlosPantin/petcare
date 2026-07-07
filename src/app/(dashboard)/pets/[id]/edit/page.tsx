import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PetForm } from "@/components/pets/pet-form";
import { getPetById } from "@/server/actions/pets";

export default async function EditPetPage({ params }: { params: { id: string } }) {
  const pet = await getPetById(params.id);

  if (!pet) notFound();

  return (
    <div className="mx-auto max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Edit {pet.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <PetForm
            petId={pet.id}
            defaultValues={{
              name: pet.name,
              species: pet.species,
              breed: pet.breed ?? "",
              birthdate: pet.birthdate ? pet.birthdate.toISOString().slice(0, 10) : "",
              weightKg: pet.weightKg ?? undefined,
              microchipNumber: pet.microchipNumber ?? "",
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
