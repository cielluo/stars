# Git

## Windows下 CRLF-LF 报错

### 场景

遇到问题的场景很神奇，是在随手改docsify主题，突发奇想要尝试显示这个repo最后commit的时间。

方案就之(lan)后(de)再(xie)说，总之是在windows环境下，用nodejs修改文件后遇到的。

```
$ git add .
fatal: CRLF would be replaced by LF ...
```

倒是不会拦提交，但是 __fatal__ 看得我害怕啊。

### 问题描述

文本文件所使用的换行符，在不同的系统平台上是不一样的。
- __UNIX/Linux__ 使用的是 `0x0A（LF）`
- __Mac OS__ 早期使用的是 `0x0D（CR）`，后来的 OS X 在更换内核后与 __UNIX__ 保持一致
- __DOS/Windows__ 一直使用 `0x0D0A（CRLF）`

Git 最初只支持 `*nix` 系统，因此推荐只将 _UNIX_ 风格的换行符 `LF` 保存入库。
但它也考虑到了跨平台协作的场景，并且提供了 _换行符自动转换_ 功能。

安装好GitHub的Windows客户端之后，这个功能默认处于 双向转换 模式，就是这样：
> 读取时，`content.replace(/LF/g, /CRLF/)`
>
> 提交时，`content.replace(/CRLF/g, /LF/)`

报错的原因是，git在某个文件中对换行符的转换失败了。
失败的场景有很多，一个比较典型的（Google说的）是：

!> 对于 __包含中文字符的 UTF-8 文件__ ，读取时的转换处理没有问题，在 __提交时__ 会失败。

不过我碰到的情况不太一样，commit事件信息文件就一个自执行函数带个锤子的中文。

猜测是node脚本写入的时候用了 \` + 换行来定义文件内容，导致直接写入了`CRLF`。
又是在pre-commit阶段写入的文件，跳过了某些必要的转换步骤？

神奇的是在vscode里把脚本文件的换行符改成`LF`，看起来写入的字符串不应该带`CRLF`了，但也没有阻止这个情况的发生。
可能还跟node写入的机制有关。

但总之，问题源于跨平台的换行符不统一，以及git自带的转换功能有坑。

### 解决（报错信息的）方案

修改本地git配置。
如题，只能可能解决一部分坑。

```
# 默认配置，双向转换
git config --global core.autocrlf true

# 提交时转换为LF，检出时不转换
git config --global core.autocrlf input

# 双向均不转换
git config --global core.autocrlf false
```

对于带中文字符的文件，关闭检出时的转换功能并在编辑器中强制在本地使用`LF`（设置为input/false），应该可以避免该报错。
但如果选择了false，则有可能出现换行符混合的文件，因此建议同时修改另一选项，并在报错出现时手动查错：
```
# 拒绝提交包含混合换行符的文件
git config --global core.safecrlf true

# 允许提交包含混合换行符的文件
git config --global core.safecrlf false

# 提交包含混合换行符的文件时给出警告
git config --global core.safecrlf warn
```

虽然栗子给了--global标签，但是为单一项目设置也是可以的。