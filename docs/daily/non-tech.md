# 非技术问题

## npm/yarn 换源

### 本地设置项的get & set

```
npm config get registry

npm config set registry https://registry.npm.taobao.org
npm config set registry https://registry.npmjs.org/
```

### 换源下载某个包

```
npm --registry https://registry.npm.taobao.org install react
```

### 为项目配置 .npmrc

```
sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
registry=https://registry.npm.taobao.org
```

[npmrc官方文档](https://docs.npmjs.com/files/npmrc.html)


