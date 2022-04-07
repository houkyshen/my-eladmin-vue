import request from '@/utils/request'

export function getDepts(params) {
    return request({
        url: 'api/dept',
        method: 'get',
        params
    })
}

export function getDeptSuperior(ids) {
    const data = ids.length || ids.length === 0 ? ids : Array.of(ids)
    return request({
        url: 'api/dept/superior',
        method: 'post',
        data
    })
}
