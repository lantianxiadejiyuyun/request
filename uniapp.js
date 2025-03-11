// uniapp 请求库
import { baseUrl } from '@/api/baseUrl'

/**
 * 发起请求
 * @param config 参数
 */
const startRequest = (config) => {
    return new Promise((resolve, reject) => {
        uni.request({
            url: baseUrl + config.url,
            data: config.params,
            method: config.method,
            header: {
                'Content-Type': config.contentType,
                'Authorization': uni.getStorageSync('Authorization'),
                'Client': uni.getSystemInfoSync().osName
            },
            success: (response) => {
                if (response.data.code === 3) {
                    uni.showToast({
                        title: response.data.message,
                        icon: 'none'
                    })
                    uni.clearStorageSync()
                }
                resolve(response.data);
            },
            fail: function (err) {
                console.log("错误")
                reject(err)
                uni.showModal({
                    title: '提示',
                    content: '请重新连接到网络~',
                })
            },
            complete: function () {
                uni.hideLoading();
            }
        })
    })
}

const startUpload = (config) => {
    return new Promise((resolve, reject) => {
        uni.uploadFile({
            url: baseUrl + config.url,
            filePath: config.file,
            name: config.name,
            header: {
                'Content-Type': "application/x-www-form-urlencoded",
                'Authorization': uni.getStorageSync('Authorization')
            },
            onUploadProgress: function (progressEvent) {
                var percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                );
                uni.showLoading({
                    title: '文件上传中'
                })
            },
            success(response) {
                resolve(JSON.parse(response.data));
            },
            fail(err) {
                console.log("错误")
                reject(err)
                uni.showModal({
                    title: '提示',
                    content: '网络错误!',
                })
            }, 
            complete: function () {
                uni.hideLoading();
            }
        })
    })
}

const packageParam = (url, params, method, contentType) => {
    return {
        url: url,
        params: params,
        method: method,
        contentType: contentType
    };
}

const packageParamUpload = (url, file, name) => {
    return {
        url: url,
        name: name,
        file: file
    }
}

export function request_post(url, params) {
    let param = packageParam(url, params, 'POST', "application/x-www-form-urlencoded");
    return startRequest(param);
}

export function request_get(url, params) {
    let param = packageParam(url, params, "GET", "application/x-www-form-urlencoded");
    return startRequest(param);
}

export function request_json_post(url, params) {
    let param = packageParam(url, params, "POST", "application/json");
    return startRequest(param);
}

export function request_json_get(url, params) {
    let param = packageParam(url, params, "GET", "application/json");
    return startRequest(param);
}

export const uploadFile = (url, file, name) => {
    let param = packageParamUpload(url, file, name)
    return startUpload(param)
}