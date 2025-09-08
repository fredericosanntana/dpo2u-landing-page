import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        
        // DPO2U Brand variants
        brand: "border-transparent bg-gradient-to-r from-brand-sapphire-500 to-brand-emerald-500 text-white shadow-md hover:shadow-lg",
        premium: "border-brand-sapphire-200/30 bg-gradient-to-r from-brand-sapphire-500/10 to-brand-emerald-500/10 text-brand-sapphire-700 backdrop-blur-sm",
        success: "border-transparent bg-brand-green-500 text-white shadow-sm",
        info: "border-transparent bg-brand-blue-500 text-white shadow-sm",
        warning: "border-transparent bg-brand-emerald-500 text-white shadow-sm",
        
        // Status badges
        'status-active': "border-green-200 bg-green-50 text-green-700 shadow-sm",
        'status-pending': "border-brand-emerald-200 bg-brand-emerald-50 text-brand-emerald-700 shadow-sm",
        'status-completed': "border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm",
        
        // Glassmorphism variant for hero sections
        glassmorphism: "border-white/20 bg-white/10 text-white backdrop-blur-md shadow-lg hover:bg-white/20 transition-all duration-300"
      },
      size: {
        default: "px-3 py-1 text-xs",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-4 py-1.5 text-sm",
        xl: "px-6 py-2 text-base font-medium"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }