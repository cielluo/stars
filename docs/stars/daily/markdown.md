# Markdown语法 ☆


## 引用

> 不留空行就会
> 被拼到一起

> 留了空行又会
>
> 被分开

```markdown
> 不留空行就会
> 被拼到一起

> 留了空行又会
>
> 被分开
```

markdown真的很严格。

## 列表

### 无序

* 写到这里又觉得markdown好随便 \* \+ \- 甚至可以混用
+ 不过同一项内
不留空行还是会被拼到一起
  打空格对齐也没用

- 项与项之间留了空行也不会会被分开

```markdown
* 写到这里又觉得markdown好随便 \* \+ \- 甚至可以混用
+ 不过同一项内
不留空行还是会被拼到一起
  打空格对齐也没用

- 项与项之间留了空行也不会会被分开
```

### 有序

2. 我大概是
3. 只关心
3. 起始的数值
3. 你根本想不到这里有几个3

```markdown
2. 我大概是
3. 只关心
3. 起始的数值
3. 你根本想不到这里有几个3
```
<!-- 
## 代码块

```markdown
```这里要写上代码块里用的语言，运气好的话会触发高亮特效
为了把代码块放在代码块里
头都秃了
```去掉这几个字就好啦
``` -->

## 链接

[gayhub](https://github.com "gayhub")

[没有browser-tip的gayhub](https://github.com)

[换了一种写法的gayhub][github]

[github]: https://github.com "github"

[不空行就会乱码][github]
[github]: https://github.com "github"

```markdown
[gayhub](https://github.com "gayhub")

[没有browser-tip的gayhub](https://github.com)

[换了一种写法的gayhub][github]

[github]: https://github.com "github"

[不空行就会乱码][github]
[github]: https://github.com "github"
```

<!-- 
## 强调

*italic*

_italic_

**strong**

__strong__

***strong&italic***

`像块代码`

```markdown
*italic*

_italic_

**strong**

__strong__

***strong&italic***

`像块代码`
``` -->
<!-- 
## 线

三个以上相同的 * - _
***
还能加空格
-- -
_ _ _

但是这样会变成标题
---

```markdown
三个以上相同的 * - _
***
还能加空格
-- -
_ _ _

但是在文字下面不空行连打三个连字符会变成标题
---
``` -->
<!-- 
## 真实的标题开始啦！

# 标题1
## 标题2
### 标题3
#### 标题4
##### 标题5
###### 标题6
####### 标题7

```markdown
# 标题1
## 标题2
### 标题3
#### 标题4
##### 标题5
###### 标题6
####### 标题7

↑最多支持六层，和html的<h[1-6]>标签一样。
```

我也是标题1
===

而我也是标题2
---

```markdown
我也是标题1
===

而我也是标题2
---
```

侧边栏现在应该是一团乱吧哈哈哈。 -->

## 图片

![gayhub icon](https://guides.github.com/favicon.ico)

```markdown
![github icon](https://guides.github.com/favicon.ico)
```

## 删除线

~~awsl~~

```markdown
~~awsl~~
```

## tasks
- [ ] 未完成
- [x] 已完成

```markdown
- [ ] 未完成
- [x] 已完成
```

## table
| 左对齐 | 居中 | 右对齐 |
| :--- | :---: | ---: |
| 几个空格  | 根本 | 不重要|
| 竖线会 | 找到           |自己的位置|

```markdown
| 左对齐 | 居中 | 右对齐 |
| :--- | :---: | ---: |
| 几个空格  | 根本 | 不重要|
| 竖线会 | 找到           |自己的位置|
```

## Docsify支持

!> **Time** is money, my friend!

?> _TODO_ unit test

```markdown
!> **Time** is money, my friend!

?> _TODO_ unit test
```

[Docsify Helpers](https://docsify.now.sh/helpers)