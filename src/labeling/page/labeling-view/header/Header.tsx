import cn from "classnames"
import React from "react"
import { useNavigate } from "react-router"

import styles from "./Header.module.scss"
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
      <Button
        icon={<span className={"i-outline:home text-28px"} />}
        onClick={() => navigate(routes.LABELING_HOME_PATH)}
        btnStyle={"ghost"}
      />
      <hr />
      <h1 className={"ellipsis"} title={title}>
        {title}
      </h1>
    </header>
  )
}
