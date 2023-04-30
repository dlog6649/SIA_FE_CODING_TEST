import type { AxiosRequestConfig } from "axios"
import Axios from "axios"

const getBaseUrl = () => "https://jsonplaceholder.typicode.com"

const HttpMethods = {
  async get<Req, Res>(path: string, config?: AxiosRequestConfig): Promise<Res> {
    try {
      const res = await Axios.get(getBaseUrl() + path, config)
      return res.data
    } catch (e) {
      throw e
    }
  },
  async post<Req, Res>(path: string, data?: Req, config?: AxiosRequestConfig): Promise<Res> {
    try {
      const res = await Axios.post(getBaseUrl() + path, data, config)
      return res.data
    } catch (e) {
      throw e
    }
  },
  async put<Req, Res>(path: string, data?: Req, config?: AxiosRequestConfig): Promise<Res> {
    try {
      const res = await Axios.put(getBaseUrl() + path, data, config)
      return res.data
    } catch (e) {
      throw e
    }
  },
  async delete<Req, Res>(path: string, config?: AxiosRequestConfig): Promise<Res> {
    try {
      const res = await Axios.delete(getBaseUrl() + path, config)
      return res.data
    } catch (e) {
      throw e
    }
  },
}

export default HttpMethods
