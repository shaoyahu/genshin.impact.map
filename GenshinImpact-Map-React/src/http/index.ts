import axios from "axios";
import { BASE_URL, TIMEOUT } from "../constant";

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: { "content-type": "application/json" },
});

instance.interceptors.response.use(
  (res) => {
    const { data } = res;
    const { code } = data;
    if (code === 0) {
      return data.data;
    } else {
      return Promise.reject(data.msg || "FETCH ERROR");
    }
  },
  (err) => Promise.reject(err)
);

export default instance;
