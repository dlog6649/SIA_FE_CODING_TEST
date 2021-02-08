import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useHistory, Link } from "react-router-dom"

import { RootState } from "../../../index"
import LabelingHeader from "./labeling-header/LabelingHeader"
import LabelingModeBar from "./labeling-mode-bar/LabelingModeBar"
import LabelListBox from "./label-list-box/LabelListBox"
import LabelingBoard from "./labeling-board/LabelingBoard"
import * as routes from "../../../routes"
import styles from "./LabelingDetail.module.scss"
import { RouteComponentProps } from "react-router"
import { AsyncSuffix } from "../../../common/modules/saga-util"
import { Image } from "../../modules/labeling"

/**
 * TODO: SVG 보드 TS로 변경
 * TODO: canvas로 변경
 */

type Props = {
  id: string
}

export default function LabelingDetail(p: RouteComponentProps<Props>) {
  const [image, setImage] = useState<Image | null>(null)
  const history = useHistory()
  // const imageListObject = useSelector((state: RootState) => state.labelingReducer.API.getImageList)

  // useEffect(() => {
  //   if (!imageListObject) return
  //   const { status, payload } = imageListObject
  //   switch (status) {
  //     case AsyncSuffix.Loading:
  //       break
  //     case AsyncSuffix.Success:
  //       const imageList = payload.slice(0, 12) as Image[]
  //       const image = imageList.find((scene) => scene.id === Number(p.match.params.id))
  //       setImage(image || null)
  //       break
  //     case AsyncSuffix.Failure:
  //       setImage(null)
  //       break
  //   }
  // }, [imageListObject])

  return (
    <div className={styles.labelingDetail}>
      <LabelingHeader className={styles.header} title={image ? image.title : ""} />
      <LabelingModeBar className={styles.modeBar} />
      <LabelListBox className={styles.listBox} />
      <LabelingBoard className={styles.board} imgUrl={image ? image.url : ""} />
    </div>
  )
}
