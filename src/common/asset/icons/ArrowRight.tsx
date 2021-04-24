import React from "react"

export function ArrowRight(props: React.HTMLProps<HTMLSpanElement>) {
  return (
    <span role={"img"} {...props}>
      <svg
        width={"1em"}
        height={"1em"}
        focusable={false}
        aria-hidden={true}
        fill={"none"}
        viewBox={"0 0 24 24"}
        stroke={"currentColor"}
        strokeWidth={"2"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
      >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </span>
  )
}
