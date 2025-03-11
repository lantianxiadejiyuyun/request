// 二次封装 axios 请求库
import axios from 'axios';
import { basepath } from '@/api/baseapi'
import { ElMessage } from 'element-plus'


const service = axios.create({
    baseURL: basepath + '/api',
    timeout: 60000
});

// 响应拦截
service.interceptors.response.use((response) => {
    try {
            return response;
    } catch (error) {
        ElMessage({
            message: '系统异常，请稍后重试',
            type: 'error',
        })
    }

    return response;
});

/**
 * 封装请求参数
 * @param {string} url 地址
 * @param {any} params 负载
 * @param {any} data 请求方式
 * @param {string} method 内容类型
 * @param {string} contentType 
 * @returns {object}
 */
function packageParam(url, params, data, method, contentType) {
    let param = {
        url: url,
        data: data,
        params: params,
        method: method,
        contentType: contentType
    };
    return param;
}

/**
 * 发起请求
 * @param {object} param 
 * @returns {Promise}
 */
function startRequest(param) {
    return new Promise((resolve, reject) => {
        service.request({
            url: param.url,
            data: param.data,
            params: param.params,
            method: param.method,
            headers: {
                'Content-Type': param.contentType
            }
        }).then(response => {
            resolve(response);
        }).catch(error => {
            reject(error);
        });
    });
}

export function request_post(url, data) {
    let param = packageParam(url, null, data, 'POST', "application/x-www-form-urlencoded");
    return startRequest(param);
}

export function request_get(url, params) {
    let param = packageParam(url, params, null, "GET", "application/x-www-form-urlencoded");
    return startRequest(param);
}

export function request_json_post(url, data) {
    let param = packageParam(url, null, data, "POST", "application/json");
    return startRequest(param);
}

export function request_json_get(url, params) {
    let param = packageParam(url, params, null, "GET", "application/json");
    return startRequest(param);
}

export function request_upload(url, data) {
    return new Promise((resolve, reject) => {
        service.request({
            url: url,
            data: data,
            method: 'POST'
        }).then(response => {
            resolve(response);
        }).catch(error => {
            reject(error);
        });
    });
}
