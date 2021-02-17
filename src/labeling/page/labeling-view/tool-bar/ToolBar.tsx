import styles from "./ToolBar.module.scss"
import React, { useState } from "react"
import cn from "classnames"
import Button from "../../../../common/components/button/Button"

export type ToolBtn = {
  key: string
  icon: React.ReactNode
}

type Props = {
  className?: string
  btnList: ToolBtn[]
  defaultKey?: string
  onChange: (key: string) => void
}

export default function ToolBar(p: Props) {
  const [key, setKey] = useState<string>(p.defaultKey || p.btnList[0].key)

  const changeKey = (_key: string) => () => {
    if (_key === key) return
    setKey(_key)
    p.onChange(_key)
  }

  return (
    <aside className={cn(styles.toolBar, p.className)}>
      {p.btnList.map((btn) => (
        <Button
          className={btn.key === key ? styles.active : ""}
          icon={btn.icon}
          onClick={changeKey(btn.key)}
          key={btn.key}
        />
      ))}
    </aside>
  )
}
