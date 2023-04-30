import cn from "classnames"
import React from "react"
import { useNavigate } from "react-router"

import styles from "./Header.module.scss"
import { Home } from "../../../../common/asset/icons"
import Button from "../../../../common/components/button/Button"
import * as routes from "../../../../routes"

type Props = {
  className?: string
  title?: string
}

export default function Header(p: Props) {
  const navigate = useNavigate()
  const title = p.title || ""

  return (
    <header className={cn(styles.header, p.className)}>
      <Button icon={<Home />} onClick={() => navigate(routes.LABELING_HOME_PATH)} btnStyle={"ghost"} />
      <hr />
      <h1 title={title}>{title}</h1>
    </header>
  )
}
