

import axios from 'axios';

axios.defaults.timeout = 10000;
// axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
// axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function get(url, params) {
    return new Promise((resolve, reject) => {
        console.log(url,'------------url')
        let link='http://live-smart.com.cn'+url
        axios.get(link, {
                params: params
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(err => {
                reject(err)
            })
    })
}

export function post(url,data = {}){
	return new Promise((resolve,reject) => {
        let link='http://live-smart.com.cn'+url
		axios.post(link,data)
        .then(response => {
            resolve(response.data);
        },err => {
            reject(err)
        })
	})
}
