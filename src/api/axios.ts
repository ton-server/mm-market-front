import Axios from 'axios';

export const axios = Axios.create();

// 设置接口超时时间
axios.defaults.timeout = 60000;


axios.defaults.baseURL = import.meta.env.VITE_API_DOMAIN;

//http request 拦截器
axios.interceptors.request.use(
    config => {
        // 配置请求头

        return Promise.resolve(config);
    },
    error => Promise.reject(error),
);

//http response 拦截器
axios.interceptors.response.use(
    response => {
        // 修改返回值

        return Promise.resolve(response);
    },
    error => Promise.reject(error),
);

// 封装 GET POST 请求并导出
export function request<T>(url = '', params = {}, method = 'GET'): Promise<T> {
    return new Promise((resolve, reject) => {
        let req = {}
        if (method === 'GET') {
            req = { method, url, params };
        } else {
            req = { method, url, data: params };
        }
        axios(req)
            .then(({ data }) => resolve(data))
            .catch(error => reject(error))
    })
}

export default axios;