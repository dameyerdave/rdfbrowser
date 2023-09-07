import {boot} from 'quasar/wrappers'
import axios, {AxiosInstance} from 'axios'
import {Notify, LoadingBar} from 'quasar'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $anzo: AxiosInstance
  }
}

const anzo = axios.create()

anzo.interceptors.request.use(
  config => {
    config.headers.Authorization = 'Basic admin:Passw0rd1'
    config.headers.Accept = 'text/csv'
    LoadingBar.start()
    return config
  },
  error => {
    console.error('AXIOS request error:', error.response)
    Notify.create({
      message: 'Error',
      caption: 'Request error',
      icon: 'warning',
      color: 'warning',
    })
    return Promise.reject(error)
  }
)

anzo.interceptors.response.use(
  response => {
    LoadingBar.stop()
    return response
  },
  async error => {
    LoadingBar.stop()
    // console.debug('href', window.location.href)
    // if ([401, 403].includes(error.response.status) && window.location.href !== '/login') {
    //   const router = useRouter()
    //   const userStore = useUserStore()
    //   userStore.sessionLogout()
    //   if (router) {
    //     router.push('/login')
    //   } else {
    //     window.location.href = '/login'
    //   }
    // } else if (error.response) {
    //   if (!error.response.data.hidden) {
    //     Notify.create({
    //       message: `${error.response.config.url}: ${error.response.status}: ${error.response.statusText}`,
    //       multiLine: true,
    //       caption: `${
    //         error.response.data.detail || error.response.data.non_field_errors || 'error.no_details_available'
    //       }`,
    //       icon: 'warning',
    //       color: 'negative',
    //       // timeout: 0,
    //       // closeBtn: true,
    //     })
    //   }
    // } else {
    // Notify.create({
    //   message: 'Response error',
    //   multiLine: true,
    //   caption: `${error}`,
    //   icon: 'warning',
    //   color: 'negative',
    // })
    // }
    console.error('AXIOS response error:', error)
    return Promise.reject(error)
  }
)

export default boot(({app}) => {
  app.config.globalProperties.$anzo = anzo
})

export {anzo}
