"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UploadButton } from "@/lib/uploadthing";
import { medicalRecordSchema, type MedicalRecordInput } from "@/lib/validations";
import { createMedicalRecord } from "@/server/actions/medical-records";

const RECORD_TYPES = ["VACCINE", "VISIT", "EXAM"] as const;

export function MedicalRecordForm({ petId, onSuccess }: { petId: string; onSuccess?: () => void }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MedicalRecordInput>({
    resolver: zodResolver(medicalRecordSchema),
    defaultValues: { petId, recordType: "VISIT" },
  });

  async function onSubmit(data: MedicalRecordInput) {
    setServerError(null);
    const result = await createMedicalRecord({ ...data, fileUrl: uploadedFileUrl ?? data.fileUrl });

    if (!result.success) {
      setServerError(result.error);
      return;
    }

    reset({ petId, recordType: "VISIT" });
    setUploadedFileUrl(null);
    onSuccess?.();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register("petId")} value={petId} />

      <div className="space-y-2">
        <Label htmlFor="recordType">Record type</Label>
        <Controller
          name="recordType"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="recordType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RECORD_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t.charAt(0) + t.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input id="date" type="date" {...register("date")} />
        {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="clinicName">Clinic name</Label>
        <Input id="clinicName" {...register("clinicName")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <textarea
          id="notes"
          rows={3}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          {...register("notes")}
        />
      </div>

      <div className="space-y-2">
        <Label>Attach vaccine/visit document (PDF or image)</Label>
        <UploadButton
          endpoint="medicalDocument"
          onClientUploadComplete={(res) => {
            const url = res?.[0]?.url;
            if (url) {
              setUploadedFileUrl(url);
              setValue("fileUrl", url);
            }
          }}
          onUploadError={(error) => setServerError(error.message)}
        />
        {uploadedFileUrl && (
          <p className="text-xs text-muted-foreground">File attached ✓</p>
        )}
      </div>

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Add record"}
      </Button>
    </form>
  );
}
