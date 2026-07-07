"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { DeleteActionButton } from "@/components/ui/delete-action-button";
import { formatDate, cn } from "@/lib/utils";
import { deleteReminder, toggleReminderStatus } from "@/server/actions/reminders";

type ReminderWithPet = {
  id: string;
  taskName: string;
  dueDate: Date;
  status: "PENDING" | "COMPLETED";
  isRecurring: boolean;
  pet: { id: string; name: string };
};

export function ReminderList({ reminders }: { reminders: ReminderWithPet[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (reminders.length === 0) {
    return <p className="text-sm text-muted-foreground">No upcoming tasks. You&apos;re all caught up!</p>;
  }

  function handleToggle(id: string) {
    startTransition(async () => {
      await toggleReminderStatus(id);
      router.refresh();
    });
  }

  const now = new Date();
  const soon = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 3);

  return (
    <ul className="divide-y">
      {reminders.map((reminder) => {
        const isDueSoon = new Date(reminder.dueDate) <= soon;
        return (
          <li key={reminder.id} className="flex items-center gap-3 py-3">
            <Checkbox
              checked={reminder.status === "COMPLETED"}
              disabled={isPending}
              onCheckedChange={() => handleToggle(reminder.id)}
            />
            <div className="flex-1">
              <p className="text-sm font-medium">{reminder.taskName}</p>
              <p className="text-xs text-muted-foreground">
                {reminder.pet.name} · Due {formatDate(reminder.dueDate)}
                {reminder.isRecurring && " · Recurring"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isDueSoon && reminder.status === "PENDING" && (
                <span className={cn("rounded-full px-2 py-1 text-xs font-medium", "bg-accent/20 text-accent-foreground")}>
                  Due soon
                </span>
              )}
              <DeleteActionButton
                action={deleteReminder}
                args={[reminder.id]}
                label="Delete"
                confirmMessage="Delete this reminder?"
                variant="ghost"
                size="sm"
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
