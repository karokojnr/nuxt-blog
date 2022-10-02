const bodyParser = require('body-parser')
export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'karoko|jnr| blog',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', ref: 'https://fonts.googleapis.com/css?family=Open+Sans' }

    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~assets/styles/main.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~plugins/date-filter.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  // components: true,
  components: [
    {
      path: '~/components', // will get any components nested in let's say /components/test too
      pathPrefix: false,
    },
  ],
  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
  ],
  axios: {
    baseURL: process.env.BASE_URL || 'https://karokojnr-default-rtdb.firebaseio.com',
    credentials: false
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },
  env: {
    baseUrl: process.env.BASE_URL || 'https://karokojnr-default-rtdb.firebaseio.com',
    firebaseApiKey: 'AIzaSyAGCkHwtLAzPvvTkFBByuEeyjURjFF8gv4'
  },
  transition: {
    name: 'fade',
    mode: 'out-in'
  },
  serverMiddleware: [
    bodyParser.json(),
    '~/api'
  ],
  // Build as Static
  //-----------------------------------------------------------
  generate: {
    routes: function () {
      return axios
        .get("https://nuxt-blog.firebaseio.com/posts.json")
        .then(res => {
          const routes = [];
          for (const key in res.data) {
            routes.push({
              route: "/posts/" + key,
              payload: { postData: res.data[key] }
            });
          }
          return routes;
        });
    }
  }
  //-----------------------------------------------------------
  // router: {
  //   middleware: 'log'
  // }


}
