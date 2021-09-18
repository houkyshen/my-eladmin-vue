import store from '@/store'

export default {
  inserted(el, binding) {
    //binding是标签内传入的属性，即v-permission="['xx权限']"
    const { value } = binding
    //当前用户拥有的角色/权限
    const roles = store.state.roles
    console.log(value)
    console.log(roles)
    if (value && value instanceof Array) {
      //让所有的标签都绑定admin权限，这样admin就能访问所有功能了
      value.push('admin')
      if (value.length > 0) {
        const permissionRoles = value
        const hasPermission = roles.some(role => {
          return permissionRoles.includes(role)
        })
        if (!hasPermission) {
          el.parentNode && el.parentNode.removeChild(el)
        }
      }
    } else {
      throw new Error(`使用方式： v-permission="['admin','editor']"`)
    }
  }
}
