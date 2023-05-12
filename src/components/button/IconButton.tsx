import { cn } from "@src/shared/utils"
import React, { DetailedHTMLProps, ButtonHTMLAttributes } from "react"

interface Props extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  className?: string
}

export default function IconButton({ className, children, type = "button", ...props }: Props) {
  return (
    <button
      className={cn(":uno: flex items-center justify-center p-0 bg-transparent border-none cursor-pointer", className)}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}
