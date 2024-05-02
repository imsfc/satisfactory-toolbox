import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: '幸福工厂工具箱',
  description: '生产规划、游戏资料查询。专为提升《幸福工厂》游戏体验而设计。',
  srcDir: 'src',
  cleanUrls: true,
  lastUpdated: false,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/assets/logo.png',

    nav: [
      {
        text: '游戏资料',
        link: '/game-info/',
        activeMatch: '/game-info/',
      },
    ],

    sidebar: {
      '/game-info/': {
        base: '/game-info',
        items: [
          {
            text: '游戏资源',
            items: [],
          },
          {
            text: '游戏进程',
            items: [],
          },
        ],
      },
    },

    outline: {
      label: '页面导航',
    },

    docFooter: {
      prev: false,
      next: false,
    },

    langMenuLabel: '多语言',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
  },
})
