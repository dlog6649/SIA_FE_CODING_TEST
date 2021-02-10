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

export default function Card(props: Props) {
  return (
    <figure className={cn(styles.card, props.className)} title={props.text} onClick={props.onClick}>
      <img className={styles.thumbnail} src={props.thumbnailUrl} />
      <div className={styles.text}>{props.text}</div>
    </figure>
  )
}
