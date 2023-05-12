import { cn } from "@src/shared/utils"
import React, { useEffect, useState } from "react"

import styles from "./ToolBar.module.scss"
import Button from "../../../components/button/Button"

export type ToolBtn = {
  value: string
  icon: React.ReactNode
}

type Props = {
  className?: string
  btns: ToolBtn[]
  defaultValue?: string
  value?: string
  onChange: (value: string) => void
}

export default function ToolBar(p: Props) {
  const [value, setValue] = useState<string>(p.defaultValue || p.btns[0]?.value || "")

  useEffect(() => {
    if (!p.value) return
    setValue(p.value)
  }, [p.value])

  const changeKey = (val: string) => () => {
    if (val === value) return
    setValue(val)
    p.onChange(val)
  }

  return (
    <aside className={cn(styles.toolBar, p.className)}>
      {p.btns.map((btn) => (
        <Button
          className={cn(btn.value === value && styles.active)}
          icon={btn.icon}
          onClick={changeKey(btn.value)}
          key={btn.value}
        />
      ))}
    </aside>
  )
}
