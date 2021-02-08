import { AsyncState } from "../../../common/modules/saga-util"

export const GET_IMAGE_LIST = "labeling/getImageList"
export const GET_IMAGE = "labeling/getImage"

export type LabelingState = {
  api: {
    getImageList: AsyncState<Image[]>
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

export type GetImageListAction = {
  type: typeof GET_IMAGE_LIST
  payload: void
}

export type GetImageAction = {
  type: typeof GET_IMAGE
  payload: { id: string }
}
