import axios from "axios";
import Element from 'element-ui'
import {getToken} from "@/utils/auth";
import {logout} from "@/utils/login";

let request = axios.create()

//添加响应拦截器
request.interceptors.response.use(response => {
        return response
    },
    error => {
        Element.Message.error('请求失败' + error)
        let code = error.response.data.status
        if (code===401){//如果认证失败，则实行注销操作
            logout()
        }
        return Promise.reject(error)
    })

//请求拦截
request.interceptors.request.use(config => {
        console.log('请求拦截！')
        if (getToken()) {
            config.headers['Authorization'] = getToken()
        }
        return config
    },
    error => {
        return Promise.reject(error)
    })

export default request
