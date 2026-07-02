"use client"

import { toast as sonnerToast } from "sonner"

// ─── Types ────────────────────────────────────────────────────────────────────

interface ToastOptions {
  title?: string
  description?: string
  /** 'destructive' maps to sonner's error(), everything else uses success(). */
  variant?: "destructive" | "default"
  /** Duration in milliseconds. */
  duration?: number
}

// ─── toast() helper ───────────────────────────────────────────────────────────

function toast({ title, description, variant, duration }: ToastOptions) {
  const message = title ?? ""
  const opts = {
    description,
    duration,
  }

  if (variant === "destructive") {
    return sonnerToast.error(message, opts)
  }

  return sonnerToast.success(message, opts)
}

// ─── useToast() hook ──────────────────────────────────────────────────────────
// Returns { toast } so existing destructuring `const { toast } = useToast()`
// continues to work unchanged across all consumers.

function useToast() {
  return { toast }
}

export { useToast, toast }
export type { ToastOptions }
