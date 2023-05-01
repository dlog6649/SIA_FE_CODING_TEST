import Card from "@src/components/card/Card"
import { useImagesQuery } from "@src/domains/image/queries"
import type { Image } from "@src/domains/image/types"
import * as routes from "@src/routes"
import React from "react"
import { Link } from "react-router-dom"

import styles from "./LabelingHome.module.scss"

export default function LabelingHome() {
  const { isFetching, isError, data } = useImagesQuery()

  return (
    <main className={styles.labelingHome}>
      <h1 className={styles.title}>{"Labeling Home"}</h1>
      <div className={styles.cardItemBox}>
        {isFetching ? (
          <h2>{"Loading..."}</h2>
        ) : isError ? (
          <h2>{"Error occurred when fetching images"}</h2>
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
