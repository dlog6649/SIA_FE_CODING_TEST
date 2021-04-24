import React from "react"

export function Right(props: React.HTMLProps<HTMLSpanElement>) {
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
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </span>
  )
}
