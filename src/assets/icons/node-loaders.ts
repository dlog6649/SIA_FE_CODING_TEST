import { promises as fs, Stats } from "fs"
import path from "path"

type Collection = (it: string) => Promise<string | undefined>

export const getCollections = (...collectionNames: string[]): Record<string, Collection> => {
  return collectionNames.reduce(
    (acc, cur) => ({
      ...acc,
      [cur]: loadFileSystemIcons(path.resolve(__dirname, cur)),
    }),
    {},
  )
}

function loadFileSystemIcons(dir: string): Collection {
  return async (name: string): Promise<string | undefined> => {
    const path = `${dir}/${name}.svg`
    let stat: Stats
    try {
      stat = await fs.lstat(path)
    } catch (err) {
      return
    }
    if (stat.isFile()) {
      let svg = await fs.readFile(path, "utf-8")
      const cleanupIdx = svg.indexOf("<svg")
      if (cleanupIdx > 0) svg = svg.slice(cleanupIdx)
      return svg
    }
  }
}
