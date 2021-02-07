import { API } from "../../../common/modules/saga-util";

export const GET_IMAGE_LIST = "labeling/getImageList";

export type LabelingState = API;

export type Image = {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
};

export type GetImageListAction = {
  type: typeof GET_IMAGE_LIST;
  payload: void;
};
