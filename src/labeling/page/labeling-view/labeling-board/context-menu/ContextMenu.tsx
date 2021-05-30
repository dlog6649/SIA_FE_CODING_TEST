import React from "react"
import styles from "./ContextMenu.module.scss"
import cn from "classnames"
import { Coordinate } from "../types"

export type MenuItem = {
  name: string
  shortCut: string
  onClick: any
  visible: boolean
  disabled: boolean
}

type Props = {
  className?: string
  coordinate: Coordinate
  hideContextMenu: () => void
  contextMenuRef: React.RefObject<HTMLDivElement>
  menuItems: MenuItem[]
}

export default function ContextMenu(p: Props) {
  const onMenuItemClick = (disabled: boolean, onClick?: any) => () => {
    if (disabled) return
    if (typeof onClick === "function") onClick()
    p.hideContextMenu()
  }

  return (
    <div
      className={cn(styles.labelContextmenu, p.className)}
      style={{ top: p.coordinate.y, left: p.coordinate.x }}
      onClick={(evt) => evt.stopPropagation()}
      onContextMenu={(evt) => evt.preventDefault()}
      ref={p.contextMenuRef}
    >
      {p.menuItems.map(
        (it) =>
          it.visible && (
            <div
              className={cn(styles.item, it.disabled && styles.disabled)}
              onClick={onMenuItemClick(it.disabled, it.onClick)}
              key={it.name}
            >
              <span className={styles.name}>{it.name}</span>
              <span className={styles.shortcut}>{it.shortCut}</span>
            </div>
          ),
      )}
    </div>
  )
}
