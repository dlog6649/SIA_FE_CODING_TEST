import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useHistory, Link } from "react-router-dom"

import { RootState } from "../../../index"
import LabelingHeader from "./labeling-header/LabelingHeader"
import LabelingModeBar from "./labeling-mode-bar/LabelingModeBar"
import LabelListBox from "./label-list-box/LabelListBox"
import LabelingBoard from "./labeling-board/LabelingBoard"
import * as routes from "../../../routes"
import styles from "./LabelingDetail.module.scss"
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

export default function LabelingDetail(p: RouteComponentProps<Props>) {
  const { loading, data, error } = useSelector((state: RootState) => state.labelingReducer.api.getImage)
  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getImage(p.match.params.id))
  }, [])

  return (
    <div className={styles.labelingDetail}>
      <LabelingHeader className={styles.header} title={data?.title || ""} />
      <LabelingModeBar className={styles.modeBar} />
      <LabelListBox className={styles.listBox} />
      <LabelingBoard className={styles.board} imgUrl={data?.url || ""} />
    </div>
  )
}
