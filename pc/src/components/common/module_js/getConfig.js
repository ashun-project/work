import Vue from 'vue';
export function getConfigList () {
    return new Promise((resolve, reject) => {
        Vue.prototype.$http.post('/api/v2/sysDict/querySystemConfig').then(response => {
            if (response.data.code !== 0) return;
            let data = response.data.data;
            resolve(data);
        })
    })

}