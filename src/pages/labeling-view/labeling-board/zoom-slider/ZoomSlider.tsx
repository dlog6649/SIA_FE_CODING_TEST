import cn from "classnames"
import React from "react"

import styles from "./ZoomSlider.module.scss"

type Props = {
  className?: string
  value: number
  onChange?: (evt: React.ChangeEvent<HTMLInputElement>) => void
}

export default function ZoomSlider(p: Props) {
  return (
    <div className={cn(styles.zoomSlider, p.className)}>
      <span className={"i-outline:plus absolute left-1rem top-1rem"} />
      <input
        type={"range"}
        data-testid={"testScaler"}
        value={p.value}
        onChange={p.onChange}
        min={"0.1"}
        max={"2"}
        step={"0.1"}
        style={{
          background: `linear-gradient(to right, #131644 0%, #131644 ${p.value * 50 - 2.5}%,
          #d5d4d3 0%, #d5d4d3 100%)`,
        }}
      />
      <span className={"i-outline:minus absolute left-1rem bottom-1rem"} />
    </div>
  )
}
