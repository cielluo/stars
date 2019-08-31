# React16

> 刚整理到16.2，慢慢写。

按照版本号升级的一般规则：
X.Y.Z的版本号格式，X更新的话就表示有重大更新，或者不兼容老版本；Y更新表示添加了新的功能；Z表示修订错误和bug。

由此在使用者方有一个预设：
* Z升级 __一定__ 是无痛
* Y升级 __很可能__ 是无痛
* X升级需要仔细处理，可能需要对业务进行全面回归

所以，16之后无论是在哪个Y版本的更新，都写到一起了。

---

# 糖

> 有一些以前也能（在不修改react源码且不引入额外依赖的情况下）实现
> 
> 但写起来比较麻烦或有副作用的功能
>
> 官方发糖

## Fragments

render方法接受新的返回值格式：
- 数组
- 字符串

```js
render() {
  return [
    <li key="A">First item</li>,
    '字符串也是可以的',
    <li key="B">Second item</li>,
  ];
}
```

以前是需要包裹一层标签的，否则会让整个页面无法渲染。

到这里为止，除开可以避免修改过程中突然无法渲染让人一脸懵逼的情况之外，这颗糖的甜度应该与**项目中组件的粒度**有关。

> 两个月后，由于反馈不太好
>
> 比如array的写法很奇怪，单独的字符串需要加引号反人类
>
> 官方又加了糖

```js
render() {
  return (
    <React.Fragment>
      字符串可以
      <h2>不用再</h2>
      加引号了
    </React.Fragment>
  );
}
```

为免用户连这个Fragment都懒得打（很真实，我就是

还有更简单的写法
```js
render() {
  return (
    <>
      Some text.
      <h2>A heading</h2>
      More text.
      <h2>Another heading</h2>
      Even more text.
    </>
  );
}
```

!> 依赖 `Babel > v7.0.0-beta.31`、`typescript > 2.6.2`

于是，在写法变得更合理（相较于arr）、与v16之前相似甚至更简单的情况下，减少了css层级可能出现的问题。

真甜~

## 容错处理 Error Boundary

> 就算出了错也要在不刷新的情况下支持继续使用
>
> 就算渲染错位，交互混乱，也不能崩溃

同时创造了新的生命周期函数`componentDidCatch`，官方给的最佳实践是这样的：
```js
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    logErrorToMyService(error, info);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
```

```js
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```

<iframe height="436" style="width: 100%;" scrolling="no" title="wqvxGa" src="//codepen.io/gaearon/embed/wqvxGa/?height=436&theme-id=light&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/gaearon/pen/wqvxGa/'>wqvxGa</a> by Dan Abramov
  (<a href='https://codepen.io/gaearon'>@gaearon</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

新生命周期函数两个参数的格式：
```js
// 这个代码块声明为ts竟然会失去高光(liang
// 来自@types/node，也就是报错信息本身
interface Error {
  stack?: string;
}

// react添加的额外信息
interface ErrorInfo {
  componentStack:string;
}
const demoErrorInfo:ErrorInfo = {
  componentStack: `
    in BuggyCounter (created by App)
    in Error…ed by App)
    in div (created by App)
    in App`;
};
```

第一反应：组件try/catch？

暂时没想到很有意义的使用场景。

容错处理应该是业务的必修课，成熟的业务都应该有较为完整的处理方案了。

用这个功能从头重做，性价比可能没那么高。


## 自定义dom属性

官方*自称*现在放开了对自定义dom属性的限制，会把所有写在虚拟dom上的属性传到真实的dom上。

做了试验发现 **结合ts**（`"react": "^16.8.6"`, `"typescript": "3.3.3"`） 使用时还是会报错：

```
ReactDOM.render(<div customattr="test"/>, document.getElementById('root'));
```
> Type '{ customattr: string; }' is not assignable to type 'DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>'.
>   Property 'customattr' does not exist on type 'DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>'.ts(2322)

但这样是可以的：
```
ReactDOM.render(<div custom-attr="test"/>, document.getElementById('root'));
```

真实惊了。

不过不再强制以 `data-` 开头，能增加一定可读性吧。


## 非功能优化

将非核心功能类移出react主包、减小包体积。

第三方库的自我修养，就不吹了【不是我没在吹的

---

# Features

> 让人学得动的框架不是好vue（？

## Portal ★

传送门本门，爱了

一句话总结：

在不改变事件冒泡队列、react tree结构的前提下，把某个组件的真实dom在别的dom下渲染。

```js
render() {
  // React does *not* create a new div. It renders the children into `domNode`.
  // `domNode` is any valid DOM node, regardless of its location in the DOM.
  return ReactDOM.createPortal(
    this.props.children,
    body,
  );
}
```

想给提出这个功能的人致以最真诚的敬意。

随便一想使用场景：

- 实现右键菜单时，父dom有`overflow: hidden`或`z-index`等属性，可以将菜单dom渲染到body下

- 弹窗类组件，可以不把所有弹窗都放在根组件下管理，而是写在使用的组件内


---

# TODOs

> 就是 我还没细想 的意思

1. [服务器端渲染优化](https://reactjs.org/docs/react-dom-server.html)
2. [Fiber](https://reactjs.org/blog/2017/09/26/react-v16.0.html#new-core-architecture)

---

# Ref
[React v16.0 - React Blog](https://reactjs.org/blog/2017/09/26/react-v16.0.html)
以及之后的文章。