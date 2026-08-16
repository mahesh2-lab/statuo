import React, { useId } from "react"
import { motion, type Transition } from "motion/react"
import { cn } from "@/lib/utils"

interface BorderBeamProps {
  /**
   * The percentage length of the traveling beam along the perimeter (0-100)
   * @default 20
   */
  size?: number
  /**
   * Duration of one full perimeter loop in seconds
   * @default 8
   */
  duration?: number
  /**
   * Animation start delay in seconds
   * @default 0
   */
  delay?: number
  /**
   * Leading color of the beam
   * @default "#00E887"
   */
  colorFrom?: string
  /**
   * Trailing color of the beam
   * @default "#38bdf8"
   */
  colorTo?: string
  /**
   * Custom transition override
   */
  transition?: Transition
  className?: string
  style?: React.CSSProperties
  /**
   * Reverse direction
   * @default false
   */
  reverse?: boolean
  initialOffset?: number
  /**
   * Exact stroke border width in pixels
   * @default 1.5
   */
  borderWidth?: number
}

export const BorderBeam: React.FC<BorderBeamProps> = ({
  className,
  size = 20,
  delay = 0,
  duration = 8,
  colorFrom = "#00E887",
  colorTo = "#38bdf8",
  transition,
  style,
  reverse = false,
  initialOffset = 0,
  borderWidth = 1.5,
}) => {
  const gradientId = useId()

  return (
    <svg
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full rounded-[inherit] overflow-visible z-20",
        className
      )}
      style={style}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colorFrom} stopOpacity="1" />
          <stop offset="60%" stopColor={colorTo} stopOpacity="0.9" />
          <stop offset="100%" stopColor={colorTo} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.rect
        x={borderWidth / 2}
        y={borderWidth / 2}
        width={`calc(100% - ${borderWidth}px)`}
        height={`calc(100% - ${borderWidth}px)`}
        rx="inherit"
        ry="inherit"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={borderWidth}
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray={`${size} ${100 - size}`}
        initial={{ strokeDashoffset: initialOffset }}
        animate={{
          strokeDashoffset: reverse
            ? [initialOffset, initialOffset + 100]
            : [initialOffset, initialOffset - 100],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration,
          delay: -delay,
          ...transition,
        }}
      />
    </svg>
  )
}
