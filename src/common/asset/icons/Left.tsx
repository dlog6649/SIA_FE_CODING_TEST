import React from "react"

export function Left(props: React.HTMLProps<HTMLSpanElement>) {
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
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </span>
  )
}
