// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  modules: [
    '@nuxtjs/color-mode'
  ],
  
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    storageKey: 'nuxt-color-mode'
  },
  
  css: ['~/assets/scss/main.scss'],
  
  app: {
    head: {
      meta: [
        { name: 'color-scheme', content: 'light dark' }
      ]
    }
  },
  
  vite: {
    vue: {
      template: {
        compilerOptions: {
          isCustomElement: (tag) => false
        }
      }
    },
    build: {
      cssCodeSplit: false
    }
  }
})
