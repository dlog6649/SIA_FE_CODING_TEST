import { MINUTE } from "@src/constants/times"
import QueryKeys from "@src/domains/shared/QueryKeys"
import { useQuery } from "@tanstack/react-query"

import { getImage, getImages } from "./fetchers"

const keys = new QueryKeys("image")

export const useImagesQuery = () => {
  return useQuery(keys.list(), getImages, {
    staleTime: 3 * MINUTE,
    cacheTime: 5 * MINUTE,
  })
}

export const useImageQuery = (id: number) => {
  return useQuery(keys.detail({ id }), () => getImage(id), {
    staleTime: 3 * MINUTE,
    cacheTime: 5 * MINUTE,
    enabled: !Number.isNaN(id),
  })
}
