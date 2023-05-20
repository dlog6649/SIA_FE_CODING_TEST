import Button from "@src/components/button"
import Paths from "@src/shared/Paths"
import { cn } from "@src/shared/utils"
import React from "react"
import { useNavigate } from "react-router"

import styles from "./Header.module.scss"

type Props = {
  className?: string
  title?: string
}

export default function Header(p: Props) {
  const navigate = useNavigate()
  const title = p.title || ""

  return (
    <header className={cn(styles.header, p.className)}>
      <Button
        icon={<span className={"i-outline:home text-28px"} />}
        onClick={() => navigate(Paths.root)}
        buttonStyle={"ghost"}
      />
      <hr />
      <h1 className={"ellipsis"} title={title}>
        {title}
      </h1>
    </header>
  )
}
