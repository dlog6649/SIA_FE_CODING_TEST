import React, { useEffect } from "react"
import { useHistory } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import styles from "./LabelingHome.module.scss"
import * as routes from "../../../routes"
import { getImageList, Image } from "../../modules/labeling"
import { RootState } from "../../../index"
import Card from "../../../common/components/card/Card"

export default function LabelingHome() {
  const { loading, data, error } = useSelector((state: RootState) => state.labelingReducer.api.getImageList)
  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getImageList())
  }, [])

  const linkToLabelingDetail = (id: number) => () => {
    history.push(routes.buildLabelingViewPath(id))
  }

  return (
    <main className={styles.labelingHome}>
      <h1 className={styles.title}>{"Labeling Home"}</h1>
      <div className={styles.cardItemBox}>
        {loading ? (
          <h2>{"Loading..."}</h2>
        ) : error ? (
          <h2>{error.toString()}</h2>
        ) : !data?.length ? (
          <h2>{"No Data"}</h2>
        ) : (
          data.map((img: Image) => (
            <Card
              thumbnailUrl={img.thumbnailUrl}
              text={img.title}
              onClick={linkToLabelingDetail(img.id)}
              key={img.id}
            />
          ))
        )}
      </div>
    </main>
  )
}
