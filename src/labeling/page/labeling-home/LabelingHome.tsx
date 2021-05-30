import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import styles from "./LabelingHome.module.scss"
import * as routes from "../../../routes"
import { getImages, Image } from "../../modules/labeling"
import Card from "../../../common/components/card/Card"
import { useRootState } from "../../../common/hooks/useRootState"

export default function LabelingHome() {
  const { loading, data, error } = useRootState((state) => state.labelingReducer.api.getImages)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getImages())
    // dispatch(getImages())
  }, [])

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
            <Link className={styles.imgCard} to={routes.buildLabelingViewPath(img.id)} key={img.id}>
              <Card thumbnailUrl={img.thumbnailUrl} text={img.title} />
            </Link>
          ))
        )}
      </div>
    </main>
  )
}
