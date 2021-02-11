import React, { useState } from "react"
import { Minus, Plus } from "../../../../../common/asset/icons"
import cn from "classnames"
import styles from "./Scaler.module.scss"

type Props = {
  className?: string
}

export default function Scaler(p: Props) {
  const [scale, setScale] = useState<number>(1)

  return (
    <div className={cn(styles.scaler, p.className)}>
      <Plus className={styles.plus} />
      <input
        className={styles.abc}
        type={"range"}
        data-testid={"testScaler"}
        value={scale}
        onChange={(evt) => setScale(parseFloat(evt.target.value))}
        min={"0"}
        max={"2"}
        step={"0.1"}
        style={{
          background: `linear-gradient(to right, #131644 0%, #131644 ${scale * 50}%,
          #d5d4d3 0%, #d5d4d3 100%)`,
        }}
      />
      <Minus className={styles.minus} />
    </div>
  )
}
