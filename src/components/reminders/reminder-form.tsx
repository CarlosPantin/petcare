"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { reminderSchema, type ReminderInput } from "@/lib/validations";
import { createReminder } from "@/server/actions/reminders";

export function ReminderForm({ petId, onSuccess }: { petId: string; onSuccess?: () => void }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReminderInput>({
    resolver: zodResolver(reminderSchema),
    defaultValues: { petId, isRecurring: false },
  });

  async function onSubmit(data: ReminderInput) {
    setServerError(null);
    const result = await createReminder(data);

    if (!result.success) {
      setServerError(result.error);
      return;
    }

    reset({ petId, isRecurring: false });
    onSuccess?.();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register("petId")} value={petId} />

      <div className="space-y-2">
        <Label htmlFor="taskName">Task</Label>
        <Input id="taskName" placeholder="e.g. Annual checkup" {...register("taskName")} />
        {errors.taskName && <p className="text-sm text-destructive">{errors.taskName.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">Due date</Label>
        <Input id="dueDate" type="date" {...register("dueDate")} />
        {errors.dueDate && <p className="text-sm text-destructive">{errors.dueDate.message}</p>}
      </div>

      <div className="flex items-center gap-2">
        <Controller
          name="isRecurring"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="isRecurring"
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(!!checked)}
            />
          )}
        />
        <Label htmlFor="isRecurring" className="font-normal">
          This task repeats
        </Label>
      </div>

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Add reminder"}
      </Button>
    </form>
  );
}
