import { put } from "redux-saga/effects"

export const initAsyncState: AsyncState<any> = {
  loading: false,
  data: null,
  error: null,
}

export type AsyncState<T> = {
  loading: boolean
  data: T | null
  error: Error | null
}

export enum AsyncSuffix {
  Loading = "Loading",
  Success = "Success",
  Failure = "Failure",
}

export function taker(sagaOption: any, type: string, fn: (action: any) => Promise<any>) {
  return sagaOption(type, function* (action: any) {
    yield put({ type: `${type}/${AsyncSuffix.Loading}` })
    try {
      const response = yield fn(action)
      yield put({
        type: `${type}/${AsyncSuffix.Success}`,
        payload: response.data || response,
      })
    } catch (err) {
      yield put({
        type: `${type}/${AsyncSuffix.Failure}`,
        payload: err,
      })
    }
  })
}

export function handleAsyncAction(state: any, action: any) {
  const [reducerName, type, suffix] = action.type.split("/")
  switch (suffix) {
    case AsyncSuffix.Loading:
      state.api[type] = {
        loading: true,
        data: state.api[type]?.data || null,
        error: null,
      }
      break
    case AsyncSuffix.Success:
      state.api[type] = {
        loading: false,
        data: action.payload,
        error: null,
      }
      break
    case AsyncSuffix.Failure:
      state.api[type] = {
        loading: true,
        data: state.api[type]?.data || null,
        error: action.payload,
      }
  }
}
