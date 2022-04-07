import request from '@/utils/request'

/**
 * 菜单API
 */

export function getChild(id) {
    return request({
        url: 'api/menus/child?id=' + id,
        method: 'get'
    })
}

export default {getChild}
