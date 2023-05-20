import { cn } from "@src/shared/utils"
import React from "react"

import styles from "./Card.module.scss"

interface Props {
  className?: string
  onClick?: any
  thumbnailUrl?: string
  text: string
}

export default function Card({ className, onClick, thumbnailUrl, text }: Props) {
  return (
    <figure className={cn(styles.card, className)} title={text} onClick={onClick}>
      <img className={styles.thumbnail} src={thumbnailUrl} alt={text} />
      <div className={cn(styles.text, "ellipsis")}>{text}</div>
    </figure>
  )
}
