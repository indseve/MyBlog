---
title: 下载工具系列——Aria2 (几乎全能的下载神器)
date: '2018-08-01 08:00:00'
sidebar: 'auto'
categories:
 - aria2
tags:
 - aria
 - 下载
publish: true
---
<!-- # 下载工具系列——Aria2 (几乎全能的下载神器) -->
## 一.介绍
说完了前面一堆BT/PT客户端，现在终于轮到Aria2了，关于这个我就不介绍太多了，自从百度限速以来我觉得这个快变成众所周知的了，我平时也收集了各种和Aria2相关的插件或者是辅助软件之类的，就等着全部丢出来，下面请看我的表演。

## 二.安装
安装Aria2确实是个麻烦事，特别是要安装新的版本，我之前也写过编译安装最新版本的，看的人挺多的，就是还是麻烦了点，这次顺便给出个别人静态编译的地址，作者更新的挺勤的，基本上新版本出了很快就会跟进。

### ①.手动编译安装

略

### ②.静态编译下载

#### GNU/Linux:

32位: https://github.com/q3aql/aria2-static-builds/releases/download/v1.32.0/aria2-1.32.0-linux-gnu-32bit-build1.tar.bz2

64位: https://github.com/q3aql/aria2-static-builds/releases/download/v1.32.0/aria2-1.32.0-linux-gnu-64bit-build1.tar.bz2

ARM树莓派: https://github.com/q3aql/aria2-static-builds/releases/download/v1.32.0/aria2-1.32.0-linux-gnu-arm-rbpi-build1.tar.bz2

#### Windows:

32位: https://github.com/q3aql/aria2-static-builds/releases/download/v1.32.0/aria2-1.32.0-win-32bit-build1.7z

64位: https://github.com/q3aql/aria2-static-builds/releases/download/v1.32.0/aria2-1.32.0-win-64bit-build1.7z

还有个改版的，把并发线程提到了128，暴力下载

GNU/Linux 64位: https://github.com/xzl2021/aria2-static-builds-with-128-threads/releases/download/v1.32.0/aria2-1.32.0-linux-gnu-64bit-build1.tar.bz2

安装方法没啥说的，找地方解决直接用就行，静态编译就是这么牛逼，不需要额外安装库

### ③.集成版下载

因为Aria2很强大，同时因为强大又没那么容易上手，所以有些人就想办法把Aria2集成到其他软件或者封装成图形界面，使得它能够更方便使用。

#### Persepolis Download Manager(Windows/Linux/macOS)

官网: https://persepolisdm.github.io

下载：

Debian/Ubuntu: https://github.com/persepolisdm/persepolis/releases/download/2.4.2/persepolis_2.4.2.1_all.deb

macOS: https://github.com/persepolisdm/persepolis/releases/download/2.4.2/persepolis_2_4_2_mac.dmg

Windows 32位: https://github.com/persepolisdm/persepolis/releases/download/2.4.2/persepolis_2_4_2_windows_32bit.exe

Windows 64位: https://github.com/persepolisdm/persepolis/releases/download/2.4.2/persepolis_2_4_2_windows_64bit.exe

纯粹的套壳之作，开箱即用，虽然目前还有些问题，但是还是挺好的

####  PanDownload(Windows)

下载地址: https://github.com/cherryljr/PanDownload/raw/master/PanDownload.exe

将Aria2用于百度云下载，无需浏览器插件，无需复制粘贴，登录账户一点即下

#### Aria2GUI(macOS)

下载地址: https://github.com/yangshun1029/aria2gui

就是单纯的Yaaw+内置Aria2，但是效果其实挺好，配合自带的浏览器插件还是不错的

#### Maria(macOS)

下载地址: https://github.com/shincurry/Maria

这个集成了Aria2，也能用You-Get来进行部分下载，也是不错的

## 三.客户端(类)
### 安卓:

#### Aria2APP: 这个是远程控制

下载地址: https://www.coolapk.com/apk/com.gianlu.aria2app (请在手机访问，PC会404)

神奇磁力: 这玩意本质上是个搜索资源的，能够Aria2 RPC远程下载

下载地址: https://www.coolapk.com/apk/com.magicmagnet (请在手机访问，PC会404)

### IOS:

曾经有个avee，后来下架了... 不过还是能用各种web来控制的，也凑合

### PC:

#### AriaNG Native: (将AriaNG封装在Web容器中的版本)

下载地址: https://github.com/mayswind/AriaNg-Native/releases/download/0.2.0/AriaNg-0.2.0.exe

### macOS:

#### AriaNG Native: (将AriaNG封装在Web容器中的版本)

下载地址: https://github.com/mayswind/AriaNg-Native/releases/download/0.2.0/AriaNg-0.2.0.dmg

#### AMM: 全称Aria2 Menubar Monitor，在任务栏中管理监控Aria2

下载地址: https://github.com/15cm/AMM/

## 四.浏览器插件
#### Safari2Aria: 在Safari中管理Aria2，并且劫持默认下载方式

下载地址: https://github.com/miniers/safari2aria

#### 115: 使用Aria2下载115资源

下载地址: https://github.com/acgotaku/115/

#### BaiduExporter: 网盘助手, 使用Aria2下载百度网盘资源，这个因为被Chrome商店下架了，所以需要安装说明，请参考我写的文章——>传送门

下载地址: https://github.com/acgotaku/BaiduExporter

#### YAAW for Chrome: 在chrome中直接内置一个YAAW，用于直接管理Aria2

下载地址: https://chrome.google.com/webstore/detail/yaaw-for-chrome/dennnbdlpgjgbcjfgaohdahloollfgoc

## 五.各种WebGUI
#### YAAW:

下载地址: https://github.com/binux/yaaw

#### webgui-aria2:

下载地址: https://github.com/ziahamza/webui-aria2

#### AriaNG:

下载地址: https://github.com/mayswind/AriaNg

#### Glutton:

下载地址: https://github.com/NemoAlex/glutton