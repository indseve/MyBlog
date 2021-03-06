module.exports = {
    title: '后积先定界',
    description: '数无形时少直觉，形少数时难入微',

    //#region markdown
    markdown: {
      lineNumbers: true
    },
    //#endregion

    //#region 插件
    plugins:{
      //#region 图片居中
      'container': {
                      type: 'centerImage',
                      before: image => `<div class="center"><image src="${image}" />`,
                      after: '</div>',
                    },
      
      //#endregion
      
      //#region 题注
      'container': {
                    type: 'cap',
                    before: `<p class="caotion">`,
                    after: '</p>',
                  },
      //#endregion

      //#region 图片+题注
      'container': {
                      type: 'img',
                      before: `<div class="center">`,
                      after:  info => `<p class="caotion">${info}</p></div>`,
                    },
      //#endregion
    },
    //#endregion

    theme: 'vuepress-theme-reco',

    //#region 主题配置
    themeConfig: {
      type: 'blog',
      author: 'indesve',

      //#region 导航栏
      nav: [
        { text: '时间轴', link: '/timeline/', icon: 'reco-date' }
      ],
      //#endregion

      //#region   博客配置
      blogConfig: {
        category: {
          location: 2,     // 在导航栏菜单中所占的位置，默认2
          text: '分类' // 默认文案 “分类”
        },
        tag: {
          location: 3,     // 在导航栏菜单中所占的位置，默认3
          text: '标签'      // 默认文案 “标签”
        },
        socialLinks: [     // 信息栏展示社交信息
          { icon: 'reco-github', link: 'https://github.com/indseve' }
        ]
      },
      //#endregion

      noFoundPageByTencent: false,
      authorAvatar: '/avatar.jpg'
    }
    //#endregion
  }