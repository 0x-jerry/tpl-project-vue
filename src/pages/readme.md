# 文件路由

此文件夹用于文件路由系统，使用方式，请参考 [vite-plugin-pages](https://github.com/hannoeru/vite-plugin-pages) 文档。

## 一些最佳实践

以文件夹为路由路径，每个文件夹包含以下几个部分：

1. `index.vue` 文件，用于编写页面相关代码
2. `components` 文件夹，用于编写与此页面相关的组件，通常属于此页面独享的组件，没有共用性
3. `store.ts` 页面共享状态，仅用于此页面的相关状态，不需要跨页共享的相关状态。
4. `*.ts` 其他相关业务逻辑，通常不具有共用性
