import React from "react"
import { useHistory } from "react-router-dom"

import * as routes from "../../../../routes"
import Button from "../../../../common/components/button/Button"

import styles from "./Header.module.scss"
import { ArrowLeft, ArrowRight, Home } from "../../../../common/asset/icons"
import cn from "classnames"

type Props = {
  className?: string
  title?: string
}

export default function Header(p: Props) {
  const history = useHistory()
  const title = p.title || ""

  return (
    <header className={cn(styles.header, p.className)}>
      <Button icon={<Home />} onClick={() => history.push(routes.LABELING_HOME_PATH)} btnStyle={"ghost"} />
      <hr />
      <Button icon={<ArrowLeft />} onClick={() => history.goBack()} btnStyle={"ghost"} />
      <Button icon={<ArrowRight />} onClick={() => history.goForward()} btnStyle={"ghost"} />
      <hr />
      <h1 title={title}>{title}</h1>
    </header>
  )
}
