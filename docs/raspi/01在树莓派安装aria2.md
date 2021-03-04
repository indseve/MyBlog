---
title: 在树莓派安装Aria2
date: '2020-07-03 08:00:00'
sidebar: 'auto'
categories:
 - 树莓派
 - aria2
tags:
 - 树莓派
 - aria
 - 下载
 - linux
publish: true
---
<!-- # 在树莓派安装Aria2 -->
## 安装并配置 Aria2
首先，安装：
```bash
apt-get install aria2
```
创建 Aria2 的配置文件夹：
```bash
mkdir /etc/aria2
```
创建 session 和配置文件：
```bash
touch /etc/aria2/aria2.session
touch /etc/aria2/aria2.conf
```
编辑 /etc/aria2/aria2.conf：
```bash
nano /etc/aria2/aria2.conf
```
```bash
## 文件保存相关 ##

# 文件保存目录 此处文件保存目录自行设定
dir=/srv/dev-disk-by-label-Kingston/Kingston/
# 启用磁盘缓存, 0为禁用缓存, 需1.16以上版本, 默认:16M
disk-cache=32M
# 断点续传
continue=true

# 文件预分配方式, 能有效降低磁盘碎片, 默认:prealloc
# 预分配所需时间: none < falloc ? trunc < prealloc
# falloc和trunc则需要文件系统和内核支持
# NTFS建议使用falloc, EXT3/4建议trunc, MAC 下需要注释此项
#file-allocation=falloc

## 下载连接相关 ##

# 最大同时下载任务数, 运行时可修改, 默认:5
#max-concurrent-downloads=5
# 同一服务器连接数, 添加时可指定, 默认:1
max-connection-per-server=15
# 整体下载速度限制, 运行时可修改, 默认:0（不限制）
#max-overall-download-limit=0
# 单个任务下载速度限制, 默认:0（不限制）
#max-download-limit=0
# 整体上传速度限制, 运行时可修改, 默认:0（不限制）
#max-overall-upload-limit=0
# 单个任务上传速度限制, 默认:0（不限制）
#max-upload-limit=0
# 禁用IPv6, 默认:false
disable-ipv6=true

# 最小文件分片大小, 添加时可指定, 取值范围1M -1024M, 默认:20M
# 假定size=10M, 文件为20MiB 则使用两个来源下载; 文件为15MiB 则使用一个来源下载
min-split-size=10M
# 单个任务最大线程数, 添加时可指定, 默认:5
split=10

## 进度保存相关 ##

# 从会话文件中读取下载任务
input-file=/etc/aria2/aria2.session
# 在Aria2退出时保存错误的、未完成的下载任务到会话文件
save-session=/etc/aria2/aria2.session
# 定时保存会话, 0为退出时才保存, 需1.16.1以上版本, 默认:0
save-session-interval=60

## RPC相关设置 ##

# 启用RPC, 默认:false
enable-rpc=true
# 允许所有来源, 默认:false
rpc-allow-origin-all=true
# 允许外部访问, 默认:false
rpc-listen-all=true
# RPC端口, 仅当默认端口被占用时修改
# rpc-listen-port=6800
# 设置的RPC授权令牌, v1.18.4新增功能, 取代 --rpc-user 和 --rpc-passwd 选项
#rpc-secret=<TOKEN>

## BT/PT下载相关 ##

# 当下载的是一个种子(以.torrent结尾)时, 自动开始BT任务, 默认:true
#follow-torrent=true
# 客户端伪装, PT需要
peer-id-prefix=-TR2770-
user-agent=Transmission/2.77
# 强制保存会话, 即使任务已经完成, 默认:false
# 较新的版本开启后会在任务完成后依然保留.aria2文件
#force-save=false
# 继续之前的BT任务时, 无需再次校验, 默认:false
bt-seed-unverified=true
# 保存磁力链接元数据为种子文件(.torrent文件), 默认:false
bt-save-metadata=true
```
然后执行：
```bash
aria2c --conf-path=/etc/aria2/aria2.conf -D
```
没有任何提示则表示成功。接下来添加开机自启：
```bash
touch /etc/init.d/aria2c
nano /etc/init.d/aria2c
```
添加：
```bash
#!/bin/sh
### BEGIN INIT INFO
# Provides:          aria2
# Required-Start:    remotefsnetwork
# Required-Stop:     remotefsnetwork
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Aria2 Downloader
### END INIT INFO
 
case "$1" in
start)
    echo -n "Starting aria2c"
    sudo aria2c --conf-path=/etc/aria2/aria2.conf -D

;;
stop)
    echo -n "Shutting down aria2c "
    killall aria2c
;;
restart)
    # killall aria2c
    sudo aria2c --conf-path=/etc/aria2/aria2.conf -D

;;
esac
exit
```
执行：
```bash
chmod +x /etc/init.d/aria2c
```
## 安装aria2的web管理界面（AriaNg）

这里需要用到一个第三方的工具，这个是通过rpc接口来管理aria2下载的工具。

### 安装git和nginx
```bash
sudo apt install -y git nginx
```
下载aira-ng
```bash
wget https://github.com/mayswind/AriaNg/releases/download/1.1.4/aria-ng-1.1.4.zip -O aira-ng.zip
```
解压
```bash
unzip aira-ng.zip -d aira-ng
```
将aira-ng放到nginx的/var/www/html/目录下，然后设置开机启动nginx
```bash
sudo mv aira-ng /var/www/html/
sudo systemctl enable nginx
```
用浏览器访问树莓派IP下的aira-ng，即：http://ip/aira-ng

然后在系统设置点击AriaNg设置 –> 全局 –> 设置语言为中文 –> 点击RPC–>修改为 rpc 密钥：secret
