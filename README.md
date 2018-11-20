
## 安装
npm install ...

## 本地开发和调试
npm run serve

## 发布
npm run build

## 技术选型
- 框架 - Vue+VueRouter+vuex+有赞UI
- 模块化 - webpack,CommonJS规范,es6Module
- 构建工具 - webpack

## 目录结构

```
├── README.md                   项目说明文档 
├── node_modules                乱七八糟的各种依赖包
├── dist                        打包后的文件
├── package.json                node依赖配置文件
├── public                      
    |──index.html               html入口页面
    |──favicon.ico              站标  自己去替换
├── src                         源码目录
    ├──assets                   静态资源 目前存放了阿里图标
    ├──components               公共组件存放目录
    ├──util                     分装的工具类
    ├──views                    各个页面组件
        |──home.vue             首页
        |──details.vue          详情页面
        |──itemlist.vue         成员列表页面
        |──search.vue           搜索页面
        |──tpl.vue              审批页面
        |──warn.vue             报警设置页面
        |──wsd.vue              温度曲线页面
        |──...                  迭代自己增加
    ├──main.js                  系统入口页面
    ├──router.js                路由配置
    ├──store.js                 将来使用vuex...
```
