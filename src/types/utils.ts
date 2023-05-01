export type Flatten<T> = T extends Array<infer Item> ? Item : T

export type ToArray<T> = T extends any ? T[] : never

export type ToArrayNonDist<T> = [T] extends [any] ? T[] : never

export type ExtractKey<T, K extends keyof T> = keyof Pick<T, K>

export type ExcludeKey<T, K extends keyof T> = keyof Omit<T, K>

export type ExtractSelf<T, U extends T> = T extends U ? T : never

export type ExcludeSelf<T, U extends T> = T extends U ? never : T
