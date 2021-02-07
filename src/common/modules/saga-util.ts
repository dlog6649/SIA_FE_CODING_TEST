import { put } from "redux-saga/effects";

export type API = {
  API: {
    [key: string]: {
      status: AsyncStatus;
      payload: any | Error | null;
    };
  };
};

export const Api: API = {
  API: {},
};

export enum AsyncStatus {
  Request = "Request",
  Success = "Success",
  Failure = "Failure",
}

export function taker(type: string, fn: any, sagaOption: any) {
  return sagaOption(type, function* (action: any) {
    yield put({ type: type + AsyncStatus.Request });
    try {
      const response = yield fn(action);
      yield put({
        type: type + AsyncStatus.Success,
        payload: response,
      });
    } catch (err) {
      yield put({
        type: type + AsyncStatus.Failure,
        payload: err,
      });
    }
  });
}

const getApi = (type: string, status: AsyncStatus) => {
  return type.substring(0, type.length - status.length);
};

export const handleAsyncAction = (state: any, action: any) => {
  const [reducerName, type] = action.type.split("/");
  if (type.includes(AsyncStatus.Request)) {
    const api = getApi(type, AsyncStatus.Request);
    state.API[api] = {
      status: AsyncStatus.Request,
      payload: state.API[api] ? state.API[api].payload : null,
    };
  } else if (type.includes(AsyncStatus.Success)) {
    const api = getApi(type, AsyncStatus.Success);
    state.API[api] = {
      status: AsyncStatus.Success,
      payload: action.payload,
    };
  } else if (type.includes(AsyncStatus.Failure)) {
    const api = getApi(type, AsyncStatus.Failure);
    state.API[api] = {
      status: AsyncStatus.Failure,
      payload: action.payload,
    };
  }
};
