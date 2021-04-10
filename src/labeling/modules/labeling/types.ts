import { AsyncState } from "../../../common/modules/util"

export type LabelingState = {
  api: {
    getImages: AsyncState<Image[]>
    getImage: AsyncState<Image>
  }
}

export type Image = {
  albumId: number
  id: number
  title: string
  url: string
  thumbnailUrl: string
}
