import HttpMethods from "@src/domains/shared/HttpMethods"

import type { Image } from "./types"

export const getImages = async (): Promise<Image[]> => {
  return HttpMethods.get("/photos")
}

export const getImage = async (id: number): Promise<Image> => {
  return HttpMethods.get(`/photos/${id}`)
}
