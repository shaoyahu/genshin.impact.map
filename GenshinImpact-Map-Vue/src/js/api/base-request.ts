import axios, { type AxiosInstance } from 'axios'
const baseURL = import.meta.env.VITE_API_BASE_URL

type Response<T> = {
  code: number
  msg: string
  data: T
}

export class BaseRequest {
  private axiosInst: AxiosInstance

  constructor() {
    this.axiosInst = axios.create({
      baseURL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 15 * 1000,
    })
  }

  sendRequest<T>(
    method: 'GET' | 'POST',
    path: string,
    params?: Record<string, string>,
    data?: Record<string, string>,
  ): Promise<Response<T>> {
    return new Promise((res, rej) => {
      this.axiosInst
        .request({
          method,
          url: path,
          params: params || null,
          data: data || null,
        })
        .then((r) => {
          res(r.data)
        })
        .catch(rej)
    })
  }
}

export const mainRequest = new BaseRequest()
