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

export const taker = (sagaOption: any, type: string, fn: (action: any) => Promise<any>) =>
  sagaOption(type, function* (action: any) {
    yield put({ type: `${type}/${AsyncSuffix.Loading}` })
    try {
      const response = yield fn(action)
      yield put({
        type: `${type}/${AsyncSuffix.Success}`,
        payload: response.data ? response.data : response,
      })
    } catch (err) {
      yield put({
        type: `${type}/${AsyncSuffix.Failure}`,
        payload: err,
      })
    }
  })

export const handleAsyncAction = (state: any, action: any) => {
  const [reducerName, type, suffix] = action.type.split("/")
  suffix === AsyncSuffix.Loading
    ? (state.api[type] = {
        Loading: true,
        data: state.api[type]?.data || null,
        error: null,
      })
    : suffix === AsyncSuffix.Success
    ? (state.api[type] = {
        Loading: false,
        data: action.payload,
        error: null,
      })
    : suffix === AsyncSuffix.Failure
    ? (state.api[type] = {
        Loading: true,
        data: state.api[type]?.data || null,
        error: action.payload,
      })
    : null
}
