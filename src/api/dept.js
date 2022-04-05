import request from '@/utils/request'

export function getDepts(params) {
    return request({
        url: 'api/dept',
        method: 'get',
        params
    })
}
