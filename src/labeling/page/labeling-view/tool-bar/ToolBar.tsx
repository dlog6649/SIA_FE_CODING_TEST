import styles from "./ToolBar.module.scss"
import React, { useEffect, useState } from "react"
import cn from "classnames"
import Button from "../../../../common/components/button/Button"

export type ToolBtn = {
  value: string
  icon: React.ReactNode
}

type Props = {
  className?: string
  btnList: ToolBtn[]
  defaultValue?: string
  value?: string
  onChange: (value: string) => void
}

export default function ToolBar(p: Props) {
  const [value, setValue] = useState<string>(p.defaultValue || p.btnList[0].value)

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
      {p.btnList.map((btn) => (
        <Button
          className={btn.value === value ? styles.active : ""}
          icon={btn.icon}
          onClick={changeKey(btn.value)}
          key={btn.value}
        />
      ))}
    </aside>
  )
}
