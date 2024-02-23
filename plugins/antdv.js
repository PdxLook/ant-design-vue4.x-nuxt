import { extractStyle } from 'ant-design-vue/lib/_util/static-style-extract';
import { defineNuxtPlugin } from '#app'


export default defineNuxtPlugin({
  name: 'antdv-ui',
  setup(nuxtApp) {
    if (process.server) {
      const css = extractStyle();
      nuxtApp.ssrContext?.head.hooks.hook('tags:resolve', (ctx) => {
        //  insert Style after meta
        const lastMetaIndex = ctx.tags.map(x => x.tag).lastIndexOf('meta')
        const styleTags = [
          {
            tag: 'style',
            props: { 'cssr-id': 'antdv' },
            innerHTML: css
          }
        ]
        ctx.tags.splice(lastMetaIndex + 1, 0, ...styleTags)
      })
    }
  }
})

