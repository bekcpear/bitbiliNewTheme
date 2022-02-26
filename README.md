## bitbiliNewTheme

一个适用于 [Pelican 静态网站生成器](https://github.com/getpelican/pelican) 的双色主题。

其是我博客的主题，访问 [我的博客](https://bitbili.net) 以查看 Demo

* 暗色/亮色模式
* 离线阅读
* 简约风格
* noscript 友好
* 等

**本主题使用了 Docutils 的 HTML5 读取器，而 Pelican 默认使用的是 HTML4 读取器，为了兼容，使用本主题请同时添加换用 HTML5 读取器的插件 [rst_with_html5](https://github.com/bekcpear/pelican-rst_with_html5)**

### TODO

0. ~~代码块的复制功能~~
1. 动态搜索功能（用额外的后端解析静态 html 文件，再单独提供搜索服务，毕竟静态搜索下载过大的没必要数据）
2. 简单快捷键集成，包括 vim 的一些常用移动操作在内
3. 显示源码时，当鼠标悬停于源码显示区域时禁用 body 滚动（不再该区域内则不禁用）
4. 分享功能
5. 额外的更合适国内的评论系统（不考虑依托在 Github 上的相关插件）
6. 所有页面间的平滑切换（暂定）
7. 额外的个性化设置，包括自定义颜色、背景图片、透明等
8. footer 弄好看一点
9. 文章太长时，自动隐藏部份未在阅读区域的内容，以提升渲染性能
10. docutils 升到 0.18 后，需要修改 `fn-backref` 这个 class 名为 `backrefs` ，
    同时替换 `.footnote-reference` 为用 `[role="doc-noteref"]` 进行 css 选择。

### 当前发现的问题

0. ~~iOS 下 Safari 浏览器无法保持 `pre` 块内代码不换行，原因应该和其内的 `span` 标签有关，但绝对是 iOS Safari 的问题~~使用多层块绕过了这个问题。
1. 还是 iOS Safari，滑动目录的时候，很容易把目录直接滑关掉。

### 许可

GPL v2
