import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useHistory, Link } from "react-router-dom"

import { RootState } from "../../../index"
import Header from "./header/Header"
import ToolBar from "./tool-bar/ToolBar"
import ListBox from "./list-box/ListBox"
import LabelingBoard from "./labeling-board/LabelingBoard"
import * as routes from "../../../routes"
import styles from "./LabelingView.module.scss"
import { RouteComponentProps } from "react-router"
import { AsyncSuffix } from "../../../common/modules/util"
import { getImage, Image } from "../../modules/labeling"

/**
 * TODO: SVG 보드 TS로 변경
 * TODO: canvas로 변경
 */

type Props = {
  id: string
}

export default function LabelingView(p: RouteComponentProps<Props>) {
  const { loading, data, error } = useSelector((state: RootState) => state.labelingReducer.api.getImage)
  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getImage(p.match.params.id))
  }, [])

  return (
    <div className={styles.labelingView}>
      <Header className={styles.headerPositioner} title={data?.title || ""} />
      <ToolBar className={styles.toolBarPositioner} />
      <ListBox className={styles.listBoxPositioner} />
      <LabelingBoard imgUrl={data?.url || ""} />
    </div>
  )
}
