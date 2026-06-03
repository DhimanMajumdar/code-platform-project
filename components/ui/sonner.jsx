"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner";

const Toaster = ({
  ...props
}) => {
  const { theme = "system" } = useTheme()
 
  return (
    <Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background/80 group-[.toaster]:backdrop-blur-md group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl group-[.toaster]:p-4 group-[.toaster]:border",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "group-[.toaster]:border-emerald-500/30 group-[.toaster]:bg-emerald-500/5 dark:group-[.toaster]:bg-emerald-950/10",
          error: "group-[.toaster]:border-rose-500/30 group-[.toaster]:bg-rose-500/5 dark:group-[.toaster]:bg-rose-950/10",
          warning: "group-[.toaster]:border-amber-500/30 group-[.toaster]:bg-amber-500/5 dark:group-[.toaster]:bg-amber-950/10",
          info: "group-[.toaster]:border-blue-500/30 group-[.toaster]:bg-blue-500/5 dark:group-[.toaster]:bg-blue-950/10",
        },
      }}
      icons={{
        success: <CircleCheckIcon className="size-5 text-emerald-500" />,
        info: <InfoIcon className="size-5 text-blue-500" />,
        warning: <TriangleAlertIcon className="size-5 text-amber-500" />,
        error: <OctagonXIcon className="size-5 text-rose-500" />,
        loading: <Loader2Icon className="size-5 text-zinc-500 animate-spin" />,
      }}
      {...props} />
  );
}

export { Toaster }
