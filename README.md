这个是使用ionic框架编写的android端小游戏


## 目录介绍

src目录下是项目的代码实现，
    app是项目的入口
    lib目录是js代码，实现的canvas上的动画逻辑
    pages下面是程序的几个界面
        tabs主要是界面的分发逻辑
        components包含了通用的组件
        game是程序的主界面
        login是登陆界面，主要是给玩家起个名字
        rank可以看到当前的玩家排名
        setting设置页面（设置难度、道具等），功能没有实现
    services主要是维护当前用户信息和用户信息持久化



### 如何运行
可以参考http://www.jianshu.com/p/1baf40713c1c

安卓环境
$ ionic platform add android
$ ionic cordova build android
$ ionic cordova emulate android 或 $ ionic cordova run android

或者在本机浏览器运行，可以使用chrome进行模拟调试
ionic serve



