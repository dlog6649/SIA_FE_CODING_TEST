import React from "react"
import cn from "classnames"
import styles from "./Card.module.scss"

// TODO: HTMLProps 상속
type Props = {
  className?: string
  onClick?: any
  thumbnailUrl?: string
  text: string
}

export default function Card(p: Props) {
  return (
    <figure className={cn(styles.card, p.className)} title={p.text} onClick={p.onClick} tabIndex={0}>
      <img className={styles.thumbnail} src={p.thumbnailUrl} alt={p.text} />
      <div className={styles.text}>{p.text}</div>
    </figure>
  )
}
