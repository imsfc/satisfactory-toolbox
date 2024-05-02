import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: '幸福工厂工具箱',
  description: '生产规划、游戏资料查询。专为提升《幸福工厂》游戏体验而设计。',
  srcDir: 'src',
  lastUpdated: false,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/assets/logo.png',

    nav: [{ text: '例子', link: '/markdown-examples' }],

    sidebar: [
      {
        text: '例子',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
        ],
      },
    ],

    outline: {
      label: '页面导航',
    },

    docFooter: {
      prev: false,
      next: false,
    },

    darkModeSwitchLabel: '主题',
    darkModeSwitchTitle: '切换到深色模式',
    lightModeSwitchTitle: '切换到浅色模式',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '回到顶部',
  },
})
