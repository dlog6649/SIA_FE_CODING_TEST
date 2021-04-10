import React from "react"
import styles from "./ContextMenu.module.scss"
import cn from "classnames"
import { Coordinate } from "../LabelingBoard"

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
  menuItemList: MenuItem[]
}

export default function ContextMenu(p: Props) {
  const onMenuItemClick = (disabled: boolean, onClick?: any) => () => {
    if (disabled) return
    console.log(onClick)
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
      {p.menuItemList.map(
        (menuItem) =>
          menuItem.visible && (
            <div
              className={cn(styles.item, menuItem.disabled && styles.disabled)}
              onClick={onMenuItemClick(menuItem.disabled, menuItem.onClick)}
              key={menuItem.name}
            >
              <span className={styles.name}>{menuItem.name}</span>
              <span className={styles.shortcut}>{menuItem.shortCut}</span>
            </div>
          ),
      )}
    </div>
  )
}
