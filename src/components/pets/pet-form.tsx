"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { petSchema, type PetInput } from "@/lib/validations";
import { createPet, updatePet } from "@/server/actions/pets";

const SPECIES_OPTIONS = ["DOG", "CAT", "BIRD", "RABBIT", "REPTILE", "OTHER"] as const;

type PetFormProps = {
  petId?: string;
  defaultValues?: Partial<PetInput>;
};

export function PetForm({ petId, defaultValues }: PetFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PetInput>({
    resolver: zodResolver(petSchema),
    defaultValues: { species: "DOG", ...defaultValues },
  });

  async function onSubmit(data: PetInput) {
    setServerError(null);
    const result = petId ? await updatePet(petId, data) : await createPet(data);

    if (!result.success) {
      setServerError(result.error);
      return;
    }

    router.push(petId ? `/pets/${petId}` : `/pets/${result.data?.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register("name")} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="species">Species</Label>
        <Controller
          name="species"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="species">
                <SelectValue placeholder="Select species" />
              </SelectTrigger>
              <SelectContent>
                {SPECIES_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.charAt(0) + s.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="breed">Breed</Label>
        <Input id="breed" {...register("breed")} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="birthdate">Birthdate</Label>
          <Input id="birthdate" type="date" {...register("birthdate")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="weightKg">Weight (kg)</Label>
          <Input id="weightKg" type="number" step="0.1" {...register("weightKg")} />
          {errors.weightKg && (
            <p className="text-sm text-destructive">{errors.weightKg.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="microchipNumber">Microchip number</Label>
        <Input id="microchipNumber" {...register("microchipNumber")} />
      </div>

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : petId ? "Save changes" : "Add pet"}
      </Button>
    </form>
  );
}
