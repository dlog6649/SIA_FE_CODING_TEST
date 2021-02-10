import React from "react"
import { useHistory } from "react-router-dom"

import * as routes from "../../../../routes"
import Button from "../../../../common/components/button/Button"

import styles from "./Header.module.scss"
import { ArrowLeft, ArrowRight, Home } from "../../../../common/asset/icons"
import cn from "classnames"

type Props = {
  className?: string
  title: string
}

export default function Header(p: Props) {
  const history = useHistory()

  return (
    <header className={cn(styles.header, p.className)}>
      <Button className={"home-btn"} type={"ghost"} onClick={() => history.push(routes.labeling)}>
        <Home />
      </Button>
      <div className={styles.history}>
        <Button className={styles.historyBtn}>
          <ArrowLeft />
        </Button>
        <Button className={styles.historyBtn}>
          <ArrowRight />
        </Button>
      </div>
      <h1>{p.title}</h1>
    </header>
  )
}
