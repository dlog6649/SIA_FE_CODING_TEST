import React from "react"
import { Minus, Plus } from "../../../../../common/asset/icons"
import cn from "classnames"
import styles from "./ZoomSlider.module.scss"

type Props = {
  className?: string
  value: number
  onChange?: (evt: React.ChangeEvent<HTMLInputElement>) => void
}

export default function ZoomSlider(p: Props) {
  return (
    <div className={cn(styles.zoomSlider, p.className)}>
      <Plus className={styles.plus} />
      <input
        className={styles.abc}
        type={"range"}
        data-testid={"testScaler"}
        value={p.value}
        onChange={p.onChange}
        min={"0"}
        max={"2"}
        step={"0.1"}
        style={{
          background: `linear-gradient(to right, #131644 0%, #131644 ${p.value * 50}%,
          #d5d4d3 0%, #d5d4d3 100%)`,
        }}
      />
      <Minus className={styles.minus} />
    </div>
  )
}
