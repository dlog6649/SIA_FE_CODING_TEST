import Card from "@src/components/card/Card"
import { useImagesQuery } from "@src/domains/image/queries"
import type { Image } from "@src/domains/image/types"
import Paths from "@src/shared/Paths"
import React from "react"
import { Link } from "react-router-dom"

export default function ThumbnailCards() {
  const { data: images } = useImagesQuery()

  return (
    <div className={"flex flex-wrap"}>
      {!images?.length ? (
        <h2>{"No Data"}</h2>
      ) : (
        images.map((img: Image) => (
          <Link key={img.id} className={"m-1.5rem decoration-none"} to={Paths.buildLabelingBoardNav(img.id)}>
            <Card thumbnailUrl={img.thumbnailUrl} text={img.title} />
          </Link>
        ))
      )}
    </div>
  )
}
