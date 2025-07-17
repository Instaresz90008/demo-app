
"use client"

import * as React from "react"
import { ToastProvider, ToastViewport } from "@radix-ui/react-toast"
import { cn } from "@/lib/utils"

export function Toaster({ className = "", ...props }: React.ComponentPropsWithoutRef<typeof ToastViewport>) {
  return (
    <ToastProvider>
      <ToastViewport
        className={cn(
          "fixed z-[100] top-0 right-0 flex max-h-screen w-full flex-col p-4 sm:max-w-[420px]",
          className
        )}
        {...props}
      />
    </ToastProvider>
  )
}
