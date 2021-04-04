import React, { useState } from "react"

import cn from "classnames"
import styles from "./ListBox.module.scss"
import { Left, Right } from "../../../../common/asset/icons"
import Button from "../../../../common/components/button/Button"
import { Label } from "../labeling-board/Label"

type Props = {
  className?: string
  labelList?: Label[]
  onItemClick?: (id: string) => (evt: React.MouseEvent<HTMLLIElement, MouseEvent>) => void
}

export default function ListBox(p: Props) {
  const [isOpen, setOpen] = useState<boolean>(false)

  return (
    <aside className={cn(styles.listBox, p.className)}>
      <Button
        className={cn(styles.toggle, isOpen && styles.open)}
        icon={isOpen ? <Left /> : <Right />}
        onClick={() => setOpen(!isOpen)}
        type={"ghost"}
      />
      {isOpen && (
        <>
          <section>
            <h4>{"Labels"}</h4>
          </section>
          <ul>
            {p.labelList?.map((label) => (
              <li
                className={cn(label.selected && styles.active)}
                onClick={p.onItemClick && p.onItemClick(label.id)}
                key={label.id}
              >
                <div className={styles.name}>{label.name}</div>
                <div className={styles.coordinate}>{`(${label.x}, ${label.y})`}</div>
              </li>
            ))}
          </ul>
        </>
      )}
    </aside>
  )
}
