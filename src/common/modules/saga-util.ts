import { put } from "redux-saga/effects"

export const initAsyncState: AsyncState<any> = {
  isLoading: false,
  data: null,
  error: null,
}

export type AsyncState<D> = {
  isLoading: boolean
  data: D | null
  error: Error | null
}

export enum AsyncSuffix {
  Loading = "Loading",
  Success = "Success",
  Failure = "Failure",
}

export function taker(type: string, fn: (action: any) => Promise<any>, sagaOption: any) {
  return sagaOption(type, function* (action: any) {
    yield put({ type: type + AsyncSuffix.Loading })
    try {
      const response = yield fn(action)
      yield put({
        type: type + AsyncSuffix.Success,
        payload: response.data ? response.data : response,
      })
    } catch (err) {
      yield put({
        type: type + AsyncSuffix.Failure,
        payload: err,
      })
    }
  })
}

export const handleAsyncAction = (state: any, action: any) => {
  // ex) action.type: someReducer/getSomeDataLoading
  const [reducerName, type] = action.type.split("/")
  if (type.includes(AsyncSuffix.Loading)) {
    const api = getApiString(type, AsyncSuffix.Loading)
    state.api[api] = {
      isLoading: true,
      data: getData(state, api),
      error: null,
    }
  } else if (type.includes(AsyncSuffix.Success)) {
    const api = getApiString(type, AsyncSuffix.Success)
    console.log(type, api, action)
    state.api[api] = {
      isLoading: false,
      data: action.payload,
      error: null,
    }
  } else if (type.includes(AsyncSuffix.Failure)) {
    const api = getApiString(type, AsyncSuffix.Failure)
    state.api[api] = {
      isLoading: false,
      data: getData(state, api),
      error: action.payload,
    }
  }
}
const getApiString = (type: string, suffix: AsyncSuffix) => type.substring(0, type.length - suffix.length)
const getData = (state: any, api: string) => state.api[api]?.data || null
