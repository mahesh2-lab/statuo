/* eslint-disable react-refresh/only-export-components */
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-none border px-2 py-0.5 text-[10px] font-mono font-medium tracking-tight whitespace-nowrap uppercase transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default:
          "border-primary/20 bg-primary/10 text-primary [a]:hover:bg-primary/20",
        secondary:
          "border-white/10 bg-white/[0.04] text-zinc-300 [a]:hover:bg-white/10",
        outline:
          "border-border bg-transparent text-foreground [a]:hover:bg-muted",
        destructive:
          "border-destructive/30 bg-destructive/10 text-rose-400 [a]:hover:bg-destructive/20",
        success:
          "border-[#34d399]/30 bg-[#34d399]/10 text-[#34d399] [a]:hover:bg-[#34d399]/20",
        warning:
          "border-amber-500/30 bg-amber-500/10 text-amber-400 [a]:hover:bg-amber-500/20",
        info:
          "border-sky-500/30 bg-sky-500/10 text-sky-400 [a]:hover:bg-sky-500/20",
        ghost:
          "border-transparent bg-transparent text-muted-foreground hover:text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
