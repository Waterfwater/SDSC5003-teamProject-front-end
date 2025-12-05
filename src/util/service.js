import axios from "axios"
import { ElLoading } from 'element-plus'
import { ElMessage } from 'element-plus'
import store from "../store/index.js"
// 使用create创建axios实例
let loadingObj = null
const Service = axios.create({
    timeout:8000,
    baseURL:"http://localhost:8080",
    headers:{
        // "Content-type":"application/json;charset=utf-8",
        "Authorization":store.state.uInfo.userInfo.token
    }
})
// 请求拦截-增加loading,对请求做统一处理
Service.interceptors.request.use(config=>{
    loadingObj=ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
    })
    return config
})
// 响应拦截-对返回值做统一处理
Service.interceptors.response.use(response=>{
    loadingObj.close()
    if (response.status === 200 || response.status === 201) {
        return response.data;
    }
    //以上正确
    // 如果代码执行到这里，意味着响应状态码不是200也不是201，
    // 则创建一个错误，并使用`Promise.reject`方法返回。
    const error = new Error(`错误 ${response.status}: ${response.statusText}`);
    return Promise.reject(error);

},error=>{
    loadingObj.close()
    return Promise.reject(error);
})

// post请求
export const post=config=>{
    return Service({
        ...config,
        method:"post",
        data:config.data
    })
}
// get请求
export const get=config=>{
    return Service({
        ...config,
        method:"get",
        params:config.data
    })
}
// put请求
export const put=config=>{
    return Service({
        ...config,
        method:"put",
        data:config.data
    })
}// delete请求
export const del=config=>{
    return Service({
        ...config,
        method:"delete" 
    })
}