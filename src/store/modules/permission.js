import { asyncRouterMap, asyncTest1, constantRouterMap } from '@/router'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}

/**
 * 递归过滤异步路由表，返回符合路由的路由列表
 * @param routes asyncRouterMap
 * @param roles
 */
function hasChildRouterPathAsnyc(routes, path, callBack) {

  routes.forEach(route => {
    const tmp = { ...route }
    if (tmp.name == path) {
      console.log('有同样的')
      callBack()
    }else{
      if (tmp.children) {
        tmp.children = hasChildRouterPathAsnyc(tmp.children, path, callBack)
      }
    }
  })
}


const permission = {
  state: {
    activeRouterIndex: 'test1',
    routers: constantRouterMap,
    test1Router: [],
    test2Router: [],
    addRouters: []
  },
  mutations: {
    SET_Active_ROUTER_INDEX: (state, key) => {
      state.activeRouterIndex = key
    },
    SET_ROUTERS: (state, routers) => {
      state.routers = routers
    },
    SET_addRouters_ROUTERS: (state, routers) => {
      state.addRouters = routers
    },
    SET_test1_ROUTERS: (state, routers) => {
     // state.addRouters = routers
      state.test1Router = constantRouterMap.concat(routers)
    },
    SET_test2_ROUTERS: (state, routers) => {
     // state.addRouters = routers
      state.test2Router = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateActiveRouterIndex({ commit, state }, {key}) {
      const map = {
        'test1': state.test1Router,
        'test2': state.test2Router,
      }
      return new Promise(resolve => {
        commit('SET_Active_ROUTER_INDEX', key)
        commit('SET_ROUTERS', map[key])
        commit('SET_addRouters_ROUTERS', map[key])
        resolve()
      })
    },
    //
    setDefaultActiveIndex({ commit, state, dispatch }, data) {
      return new Promise(resolve => {
        let currentRoute = data.currentRoutePath
        hasChildRouterPathAsnyc(state.test1Router, currentRoute,()=>{
          console.log(1)
          commit('SET_Active_ROUTER_INDEX', 'test1')
          dispatch('setDefaultRouter', {router:state.test1Router})
        })
        hasChildRouterPathAsnyc(state.test2Router, currentRoute,()=>{
          console.log(2)
          commit('SET_Active_ROUTER_INDEX', 'test2')
          dispatch('setDefaultRouter', {router:state.test2Router})
        })
      })
    },

    // 挂载 filter路由 
    async setActiveCustomRouter({ dispatch }, data) {
      try{
        let data2 =  await dispatch('Customtest2Routes', data)
        let data3 =  await dispatch('Customtest1Routes', data)
        return new Promise(resolve => {
          let datas = [...data2,...data3]
          resolve(datas)
        }) 
      } catch (err){
        console.log(err)
        return new Promise(reject => {
          reject(err)
        }) 
      }
      
    },

    /* 挂载默认路由 */
    setDefaultRouter({ commit }, { router }) {
      return new Promise(resolve => {
        
        commit('SET_ROUTERS', router)
        commit('SET_addRouters_ROUTERS', router)
        resolve(router)
      })
    },

    /* 挂载test1 */
    Customtest2Routes({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data
        let accessedRouters
        if (roles.includes('admin')) {
          accessedRouters = asyncRouterMap
        } else {
          accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        }
        commit('SET_test1_ROUTERS', accessedRouters)
        resolve(accessedRouters)
      })
    },
    /* 挂载test2 */
    Customtest1Routes({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data
        let accessedRouters
        if (roles.includes('admin')) {
          accessedRouters = asyncTest1
        } else {
          accessedRouters = filterAsyncRouter(asyncTest1, roles)
        }
        commit('SET_test2_ROUTERS', accessedRouters)
        resolve(accessedRouters)
      })
    },

  }
}

export default permission
