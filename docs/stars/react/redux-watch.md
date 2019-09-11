# Watch redux without redux-watch

## store_manager

即使是结合react使用redux，也会有在非react组件的类中查看、更改store状态的需求。
因此react项目中除了通过connect来为组件连接store以外，一般也会写一个可以直接访问的管理器类，像这样：

```js
class StoreManager {
  private store:Store<ReduxState>;
  constructor() {
    this.store = create_store();
  }
  public get_store() : Store<ReduxState> {
    return this.store;
  }
  public get_state() {
    return this.store.getState();
  }
  public subscribe(listener:() => void) {
    this.store.subscribe(listener);
  }
  public dispatch(action:any) {
    return this.store.dispatch(action);
  }
}
```

其中较常用到的是 `get_state` 和 `dispatch` 方法，即获取当前store的全部状态和发送action。
关于这个 `subscribe` 函数，至少在我现在做的项目中存在两年了没有人用过……

试验后发现（对不起，没有读redux源码），利用 `subscribe` 方法注册的监听器，会在redux所有状态发生任意改变时被回调。
也就是说， 这个函数到这里，只是实现了发布订阅这个模式，但 **毫无实际意义**。

之前同事想要在组件外监听redux变化的时候，提到了一个库叫redux-watch，昨天我也遇到了这种需求（并且不想引入saga），就把这个库翻出来看了看。

## redux-watch

点击这里可以查看原始仓库： [jprichardson/redux-watch](https://github.com/jprichardson/redux-watch)

不过看不看都无所谓，源码3年没更新（也没什么必要更新），一共23行，都还没有它自己的单测长：

```js
'use strict'
var getValue = require('object-path').get

function defaultCompare (a, b) {
  return a === b
}

function watch (getState, objectPath, compare) {
  compare = compare || defaultCompare
  var currentValue = getValue(getState(), objectPath)
  return function w (fn) {
    return function () {
      var newValue = getValue(getState(), objectPath)
      if (!compare(currentValue, newValue)) {
        var oldValue = currentValue
        currentValue = newValue
        fn(newValue, oldValue, objectPath)
      }
    }
  }
}

module.exports = watch
```

而用法如下：

```js
// ... other imports/requires
import watch from 'redux-watch'

// assuming you have an admin reducer / state slice
console.log(store.getState().admin.name) // 'JP'

// store is THE redux store
let w = watch(store.getState, 'admin.name')
store.subscribe(w((newVal, oldVal, objectPath) => {
  console.log('%s changed from %s to %s', objectPath, oldVal, newVal)
  // admin.name changed from JP to JOE
}))

// somewhere else, admin reducer handles ADMIN_UPDATE
store.dispatch({ type: 'ADMIN_UPDATE', payload: { name: 'JOE' }})
```

由于只有20来行，且最近更新在两年前，我并不想通过npm引入这个库，而是想动手实现一下。
一开始被 **闭包包闭包** 的操作 和 **生成闭包再调用闭包返回另一个闭包作为回调** 的用法吓到了，觉得好高大上。
反复看了几次，发现这么写有几个前提：

1. watch是第三方功能，无法直接访问store读取状态，因此需要将store.getState作为参数传入
2. 同样因为watch是第三方功能，无法直接向store订阅变化，因此需要在使用时反复通过闭包记录更改状态

总之，这个功能变得这么复杂，主要是因为它本身和redux store高度耦合却要强行割裂。
自行在项目的 `store_manager` 中实现，应该是个不错的选择。

本着 `绝不多加一条依赖` 的信念，第一个问题是object-path.

## object-path

简单来说，这个库主要实现了 `用路径访问对象` 的方法。

```js
const get_value = require('object-path').get
const obj = {
  first_level: {
    second_level: {
      target_value: 233;
    }
  }
}
get_value(obj, 'first_level.second_level.target_value') // 233
```

源码没有看（我错了），但是基于 `获取redux状态` 这个目标，简单实现了一下没什么容错的版本：

```js
// 其实是ts 我永远喜欢ts
const get_path_object = (obj:{[key:string]:any}, object_path:string) : any => {
  const path_list = object_path.split('.');
  const path = path_list.shift();
  const remain_path = path_list.join('.');
  return path && obj[path] ? get_path_object(obj[path], remain_path) : obj;
};
```

查找路径不存在时，返回最后被匹配到的内容。

问题还是存在的，比如明明在写ts却没有办法做类型推断，很不ts。

## watch without redux-watch

喜闻乐见的重写

基于前面说到的两点 `导致功能复杂化` 的前提，把方法定义在了 `store_manager` 类中，并且简化了流程（aka. 减少了闭包的个数）。
实现如下：

```js
class store_manager {

  ...

  public watch(path:string, cb:(old_value:any, new_value:any) => void) {
    let current_value = get_path_object(this.get_state(), path);
    this.subscribe(() => {
      const new_value = get_path_object(this.get_state(), path);
      const old_value = current_value;
      if (new_value !== old_value) {
        current_value = new_value;
        cb(old_value, new_value);
      }
    });
  }
}
```

## conclusion

1. 多学习开源大佬们写单测的精神，20+行的源码都有121行的单测，真实到感人
2. 今天还是没有好好学习用saga呢
3. 这可能会变成一篇博客，只把实现代码留在这里，不过等我重新搭好博客再说叭
4. 补充一下实现过程遇到的坑（虽然可能只会坑到我）：

!> 先调用回调再把new_value赋给current_value，而回调中存在dispacth操作的话，会反复调用到内存溢出