"use client";

import { useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type ActionResult = {
  success: boolean;
  error?: string | null;
};

type DeleteAction = (...args: string[]) => Promise<ActionResult>;

type DeleteActionButtonProps = {
  action: DeleteAction;
  args?: string[];
  label?: string;
  redirectTo?: string;
  confirmMessage?: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children?: ReactNode;
};

export function DeleteActionButton({
  action,
  args = [],
  label = "Delete",
  redirectTo,
  confirmMessage = "Are you sure you want to delete this item?",
  className,
  variant = "destructive",
  size = "sm",
  children,
}: DeleteActionButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!window.confirm(confirmMessage)) {
      return;
    }

    startTransition(async () => {
      const result = await action(...args);

      if (result.success) {
        if (redirectTo) {
          router.push(redirectTo);
        } else {
          router.refresh();
        }
      } else {
        window.alert(result.error ?? "Unable to delete this item.");
      }
    });
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      disabled={isPending}
      onClick={handleDelete}
      className={className}
    >
      {children ?? (
        <>
          <Trash2 className="mr-2 h-4 w-4" /> {label}
        </>
      )}
    </Button>
  );
}
