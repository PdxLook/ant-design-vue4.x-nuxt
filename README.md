ssr 会导致页面样式闪烁-解决方法：

1：直接把样式写入在style中
```
//plugins/antdv.js
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
```

2：把样式抽离写入在css文件中；然后引入css文件
```
//plugins/antdv.js

import { extractStyle } from 'ant-design-vue/lib/_util/static-style-extract';
import { defineNuxtPlugin } from '#app'
import fs from 'fs';

export default defineNuxtPlugin({
  name: 'antdv-ui',
  setup(nuxtApp) {
    if (process.server) {
      const css = extractStyle();
      nuxtApp.ssrContext?.head.hooks.hook('tags:resolve', (ctx) => {

        fs.writeFile('public/css/naive.css', css, (err) => {
          if (err) {
            console.error('Error writing CSS file:', err);
          }
        });
      })
    }
  }
})

nuxt.config.ts

app: {
  baseURL: "/",
  head: {
    link: [
      { rel: 'stylesheet', href: '/css/naive.css' },
    ],
  },
},

//不知道为什么，通过css引入时在我的电脑会卡住打不开；所以我是通过link引入的
//css: [
//  'public/css/naive.css'
//],
```
