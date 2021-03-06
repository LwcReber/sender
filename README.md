# Sender
在移动端调试的时候经常遇到几个问题
1. 安装了vconsole只能看看数据，但是想把数据发给后端时,往往要登录微信之类的IM工具再发送
2. 对于app的内嵌h5页面，要通过一列的操作，将手机连接到电脑后，再打开h5页面然后查看log信息非常耗时，或许你仅仅只是想要复制一下接口数据查查bug罢了
3. 如果是测试手机，自己也不太想登录微信，但是每次测试给你看现象的时候，想要查看接口数据是否正常，想要把那部分数据拷贝到本地进行调试，但是也没有什么快捷的途径能够把数据发送到自己的电脑
4. 想要把一些数据发送到手机上，拿数据进行测试，却要一个个手打，可能仅仅是想打开个链接那么简单，虽然现在谷歌浏览器也自带的了二维码扫码查看。但是ios的safari并没有扫二维码这个功能，如果是其他的数据就更加困难发送到手机上了

由此 **Sender** 诞生了

Sender 一个可以将数据发送到电脑，电脑的数据也可以发到手机上的移动端调试辅助工具

## 特性
1. 手机电脑互相传递数据
2. 电脑端显示二维码，手机可以直接扫码打开网址
3. 发送的数据都在命令窗口上进行打印
4. 复制区的内容支持在电脑通过命令方式增删改查


## 上手
安装 `npm i -g connect-sender`

启动 `connect-sender start`

修改server端端口 `connect-sender start 9000`



## 复制区操作

添加列表数据 `connect-sender add xxxxx` 返回该条数据id

移除某条数据 `connect-sender remove xxxxx`
可以传入**数据内容**或者数据的**id**进行删除

移除所有数据 `connect-sender removeAll`

查看复制区列表所有数据 `connect-sender list`

## 其他
对于命令式无法满足的情况，可以选择clone代码到本地
1. 一键启动服务端web端
 
    在根目录执行命令 `node inde.js dev`
    如果报错提示端口被占用，添加一个自定义的端口即可
   比如 `node inde.js dev 8100`
 
2. web端修改

    在开发环境下,可以直接修改前端的代码,来达到目的

    复制区的内容只需要修改 'src/components/index.vue' 里面 data中的list即可
    开发环境下复制区的数据不会从服务端拉取，只需要在本地写好保存一下，web端就自动更新了

## 集成到vconsole

在代码中引入 `VConsoleSenderPlugin` 插件

安装 `npm i vconsole-sender-plugin -D`

```
import VConsole from 'vconsole'
import VConsoleSenderPlugin from 'vconsole-sender-plugin'
const vConsole = new VConsole()
const plugin = new VConsoleSenderPlugin(vConsole, 'http://192.168.x.xxx:8989/') // 传入connect-sender的网址即可

```

在vconsole上即可看到Sender模块

## 操作流程

1. `connect-sender start`生成的url 比如 `http://192.168.XX.XX:8989`
2. 然后在浏览器上打开，在手机打开也可以
3. 浏览器上打开支持手机扫码直接访问
4. 在手机上，输入框中输入内容，然后点击发送，输入的内容将在电脑的命令面板上展示出来

## 常见问题

启动 `connect-sender start`报错提示没有权限，执行`sodu connect-sender start`即可

