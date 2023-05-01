import HttpMethods from "@src/domains/shared/HttpMethods"

import type { Image } from "./types"

export const getImages = async (): Promise<Image[]> => {
  const photos: Image[] = await HttpMethods.get("/photos")
  return photos.slice(0, 20)
}

export const getImage = async (id: number): Promise<Image> => {
  return HttpMethods.get(`/photos/${id}`)
}
