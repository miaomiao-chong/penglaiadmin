import { login, getList, getInfo ,editUser} from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    //console.log("userinfo", userInfo);
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        //console.log("resoonse", response);
        const { data } = response
        //console.log(data);
        // //console.log("login response", response);
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    //console.log("getInfo--------");
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        //console.log(" getInfo().then(response", response);
        const { data } = response
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        //console.log("is_super_admin", data);
        const { is_super_admin, username } = data
        let roles = []
        //console.log("is_super_admin", is_super_admin);
        if (is_super_admin === true) {
          roles = ['superadmin']
        } else if (is_super_admin === false) {
          roles = ['commonadmin']
        }
        //console.log("roles----", roles);
        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        commit('SET_ROLES', roles)
        commit('SET_NAME', username)
        resolve(roles)
      }).catch(error => {
        //console.log("catch-----", error);
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {

      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resetRouter()

      // reset visited views and cached views
      // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      dispatch('tagsView/delAllViews', null, { root: true })


  },


  getList(ctx, query) {
    return new Promise((resolve, reject) => {
      getList(query).then(response => {
        //console.log(response);
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  edit(ctx, data) {
    return new Promise((resolve, reject) => {
      editUser(data).then(response => {
        //console.log(response);
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
