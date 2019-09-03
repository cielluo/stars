
# TypeScript Mapped Types

场景：想把enum作为对象的key的类型
```js
enum AppRoute {
  Client = 'client',
  Admin = 'admin',
}

const subtitle:{[key:AppRoute]:string} = {
  [AppRoute.Client]: '用户',
  [AppRoute.Admin]: '管理员',
};
```

ts报错

!> An index signature parameter type cannot be a union type. Consider using a mapped object type instead.ts(1337)

Mark:
https://mariusschulz.com/blog/mapped-types-in-typescript