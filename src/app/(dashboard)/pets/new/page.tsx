import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PetForm } from "@/components/pets/pet-form";

export default function NewPetPage() {
  return (
    <div className="mx-auto max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Add a new pet</CardTitle>
        </CardHeader>
        <CardContent>
          <PetForm />
        </CardContent>
      </Card>
    </div>
  );
}
