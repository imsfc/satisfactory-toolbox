import { defineConfig } from 'vitepress'
import { imagetools } from 'vite-imagetools'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: '幸福工厂工具箱',
  description: '生产规划、游戏资料查询。专为提升《幸福工厂》游戏体验而设计。',
  head: [
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '64x64',
        href: '/favicon-64x64.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '180x180',
        href: '/favicon-180x180.png',
      },
    ],
  ],
  srcDir: 'src',
  cleanUrls: true,
  lastUpdated: false,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.webp',

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
            items: [
              {
                text: '建筑',
                link: '/buildings',
              },
              {
                text: '物品',
                link: '/items',
              },
            ],
          },
          {
            text: '游戏进程',
            items: [
              {
                text: '项目组装阶段',
                link: '/project-assembly-phases',
              },
            ],
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
  vite: {
    plugins: [imagetools()],
  },
})
