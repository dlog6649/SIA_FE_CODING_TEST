import React, { useEffect } from "react"
import styles from "./ContextMenu.module.scss"
import cn from "classnames"

enum Menu {
  Edit = "Edit class",
  Cut = "Cut",
  Copy = "Copy",
  Paste = "Paste",
  Delete = "Delete",
}

const menuList = [
  {
    key: Menu.Edit,
    value: Menu.Edit,
  },
]

type Props = {
  className?: string
}

export default function ContextMenu(p: Props) {
  // TODO:  label-contextmenu, edit,cut... 클래스명 제거
  return (
    <div className={cn(styles.labelContextmenu, p.className)}>
      <div className={styles.item + " edit"}>
        <span className={styles.itemName}>Edit Class</span>
        <span className={styles.itemShortcut}>(TBD)</span>
      </div>
      <div className={styles.item + " cut"}>
        <span className={styles.itemName}>Cut</span>
        <span className={styles.itemShortcut}>Ctrl + X</span>
      </div>
      <div className={styles.item + " copy"}>
        <span className={styles.itemName}>Copy</span>
        <span className={styles.itemShortcut}>Ctrl + C</span>
      </div>
      <div className={styles.item + " paste"}>
        <span className={styles.itemName}>Paste</span>
        <span className={styles.itemShortcut}>Ctrl + V</span>
      </div>
      <div className={styles.item + " delete"}>
        <span className={styles.itemName}>Delete</span>
        <span className={styles.itemShortcut}>Del</span>
      </div>
    </div>
    // <div className={styles.labelContextmenu + " label-contextmenu"}>
    //   <div id={"edit"} className={styles.item + " edit"}>
    //     <span className={styles.itemName}>Edit Class</span>
    //     <span className={styles.itemShortcut}>(TBD)</span>
    //   </div>
    //   <div id={"cut"} className={styles.item + " cut"}>
    //     <span className={styles.itemName}>Cut</span>
    //     <span className={styles.itemShortcut}>Ctrl + X</span>
    //   </div>
    //   <div id={"copy"} className={styles.item + " copy"}>
    //     <span className={styles.itemName}>Copy</span>
    //     <span className={styles.itemShortcut}>Ctrl + C</span>
    //   </div>
    //   <div id={"paste"} className={styles.item + " paste"}>
    //     <span className={styles.itemName}>Paste</span>
    //     <span className={styles.itemShortcut}>Ctrl + V</span>
    //   </div>
    //   <div id={"delete"} className={styles.item + " delete"}>
    //     <span className={styles.itemName}>Delete</span>
    //     <span className={styles.itemShortcut}>Del</span>
    //   </div>
    // </div>
  )
}
