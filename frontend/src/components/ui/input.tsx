import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-none border border-border bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground transition-colors outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive font-mono",
        className
      )}
      {...props}
    />
  )
}

export { Input }
