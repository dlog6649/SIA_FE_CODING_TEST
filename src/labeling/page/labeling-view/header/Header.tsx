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
      <Button icon={<Home />} onClick={() => history.push(routes.labelingHome)} type={"ghost"} />
      <hr />
      <Button icon={<ArrowLeft />} onClick={() => history.goBack()} type={"ghost"} />
      <Button icon={<ArrowRight />} onClick={() => history.goForward()} type={"ghost"} />
      <hr />
      <h1 title={p.title}>{p.title}</h1>
    </header>
  )
}
