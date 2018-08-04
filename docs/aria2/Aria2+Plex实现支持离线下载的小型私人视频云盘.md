# Aria2+Plex实现支持离线下载的小型私人视频云盘
## 一.介绍
Aria2我就不介绍了，我这写了好几篇了，Plex呢，也是我前阵子刚介绍的。最近在研究新的玩法，终于算是搞定了，来和大家分享一下。

首先，我们必须知道，大部分国家的VPS或是服务器都是会受到DMCA影响的，这个是啥自己搜，简单的来说就是会被版权方或者版权方的授权方警告。这个问题在各家可大可小，小的就是做个保证，然后确保文件已删除啥的，大的就比较蛋疼了，要么是删机封号要么还会威胁你赔钱不然律师信啥的(虽然对于人在国内的来说基本上就是吓唬你)，但是碰上这些事情总归是比较头疼对吧。

那么，怎么办？有些国家的法律不太管这些，或者说不太搭理美国(DMCA是美国的东西)，那么贩卖这些国家的VPS或者服务器的商家就会提供一般被称为抗投诉或者抗DMCA主机(VPS/服务器)的特殊产品。比较常见的是瑞士、瑞典、乌克兰、荷兰、罗马尼亚、立陶宛、俄罗斯等一系列国家，当然不是所有这些国家的都行的，这个还跟商家公司注册国家有关，美国公司卖的这些地方的肯定也是不抗的，所以请在购买前务必看准了商家有没有说明抗投诉或是抗DMCA。

说了这么多废话有什么意义呢？主要还是铺垫，因为我就是要在抗DMCA的VPS上搭建Aria2，然后将下载完成的数据保存到另外一台配置高的Plex服务器上，然后实现离线下载+在线播放功能。是不是感觉和115之类的很像？对了，这就是小型的。

## 二.安装
1. Aria2安装  ——>自行编译   静态编译(现成)  配置  
记得把DHT还有本地节点查找以及种子交换这些功能打开，能提高速度，反正也不会被投诉，所以就不用纠结太多了，这儿的Aria2配置需要修改，下面会提到

2. Plex安装  

## 三.组合
这儿有多种方法，我自己测试了三种

①Aria2服务器(NFS客户端) Plex服务器(NFS服务端)，通过NFS将Plex服务器的某个目录挂载到Aria2服务器上，有两种选择，一是直接挂载成下载目录，二是通过hook实现下载后移动到NFS的目录中，后者更省资源，因为BT下载过程必然会上传，这样NFS会持续消耗资源

优点:比较原生且NFS配置较为简单

缺点:需要支持NFS文件系统(OpenVZ下很多商家都不支持)

这个也是个不错的方案，所以也分享下怎么搞
```bash
vi /etc/aria2/aria2c.conf
#你配置文件不在这个地方不用我说啥了吧
#首先请在Aria2配置文件中加入如下内容，seed-time单位是分钟，不设置这个的话Aria2下载BT不会自动停止做种，然后也就触发不了hook
#手动暂停不视作任务完成,如果觉得30分钟太长可以短点，0是不做种，不太建议，不利于BT良性发展
seed-time=30
on-download-complete=/home/aria2-mv.sh

#下面是hook脚本
cat >/home/aria2-mv.sh<<'EOF'
#!/bin/bash
SRC=$3
if [ "$2" == "0" ]; then
  exit 0
fi
while true; do
  DIR=`dirname "$SRC"`
  if [ `basename "$DIR"` == 'temp' ]; then
    #删掉些BT中没用的辣鸡文件
    find "$SRC" -regextype posix-extended -regex ".*\.(txt|htm|html|url|nfo|jpg|bmp|png|ico)" -exec rm -f {} \;
    mv "$SRC" `dirname "$DIR"`/download/
    exit $?
  else
    SRC=$DIR
  fi
done
EOF

chmod +x /home/aria2-mv.sh

vi /etc/aria2/aria2c.conf
#你配置文件不在这个地方不用我说啥了吧
#首先请在Aria2配置文件中加入如下内容，seed-time单位是分钟，不设置这个的话Aria2下载BT不会自动停止做种，然后也就触发不了hook
#手动暂停不视作任务完成,如果觉得30分钟太长可以短点，0是不做种，不太建议，不利于BT良性发展
seed-time=30
on-download-complete=/home/aria2-mv.sh
 
#下面是hook脚本
cat >/home/aria2-mv.sh<<'EOF'
#!/bin/bash
SRC=$3
if [ "$2" == "0" ]; then
  exit 0
fi
while true; do
  DIR=`dirname "$SRC"`
  if [ `basename "$DIR"` == 'temp' ]; then
    #删掉些BT中没用的辣鸡文件
    find "$SRC" -regextype posix-extended -regex ".*\.(txt|htm|html|url|nfo|jpg|bmp|png|ico)" -exec rm -f {} \;
    mv "$SRC" `dirname "$DIR"`/download/
    exit $?
  else
    SRC=$DIR
  fi
done
EOF
 
chmod +x /home/aria2-mv.sh
```
NFS客户端: 这边需要将Aria2的下载目录(dir参数)指定为temp，然后在同个目录下创建complete目录存放下载完成的，NFS也需要挂载到这个目录

NFS服务端: 在Plex那边添加NFS所使用的目录就行

-----
②抗DMCA服务器(隧道出口)  Plex服务器(Docker) Docker内跑一个容器 容器全局走隧道并且运行Aria2

优点:用了Docker不知道算不算优点...这实在是我当初因为OpenVZ不能挂载NFS想不到办法才尝试的一个方式

缺点:用了Docker，而且很大可能你得自己写Dockerfile，并且你需要配置隧道以及调试一堆路由，还得和iptables作斗争，并且部分OpenVZ商家不提供iptables nat表，这会让隧道无法正常处理NAT(隧道出口和入口都要通过iptables处理nat)

注意点:要使Docker拥有tun设备访问权限以及iptables使用权限需要在docker run时带如下参数
```bash
--cap-add NET_ADMIN --cap-add NET_RAW --device=/dev/net/tun
```
-----
③Aria2服务器下载完成后通过hook实现将文件通过rsync传输到Plex服务器

优点:普适性高，rsync没啥内核级的特殊要求

缺点:需要配置rsync，不过也挺简单

Rsync服务端(Plex):

主要配置Rsync顺便添加下Plex库
```bash
cat >/etc/rsyncd.conf<<'EOF'
#指定传输文件时守护进程具有的用户ID,这里表示默认为nobady
uid=nobady
#指定传输文件时守护进程具有的用户组ID,这里表示默认为nobady
gid=nobody
#禁止切换目录
use chroot=no
#客户端的最大连接数，由于Aria2那边可能同时出现多个任务完成并传输的情况，所以这个不能设成1啥的
max connection=10
#检查口令文件的权限,口令文件的权限用户属组必须是root,权限必须是600
strict modes=yes
#pid文件的位置
pid file=/var/run/rsyncd.pid
#lock文件的位置
lock file=/var/run/rsyncd.lock
#日志文件的位置
log file=/var/log/rsyncd.log

#定义模块名,这玩意就是客户端命令跟在IP后面的
[plex]
#指定这个模块需要同步的路径，你需要在Plex中添加这个目录
path=/home/plex/movie
#这个是注释 可以自己定义
comment=plex library
#忽略一些无关的IO错误
ignore errors
#no代表客户端可以上传文件,yes表示只读取
read only=no
#no表示客户端可以下载文件,yes表示不能下载
write only=no
#表示允许连接的主机地址
hosts allow=1.2.3.4
#表示不允许连接的主机地址
hosts deny=*
#不允许该模块被客户端列出
list=false
#指定传输文件时守护进程具有的用户ID,
uid=root
#指定传输文件时守护进程具有的用户组ID,
gid=root
#用来指定连接该模块的用户名,用户名可以自定义，这个是客户端命令跟在IP前面那个
auth users=plex
#指定密码文件,文件里面记录的是用户名:密码
secrets file=/etc/srs.pass
EOF

echo "plex:密码" >/etc/srs.pass
#权限必须600，不然GG
chmod 600 /etc/srs.pass
#开机启动
echo "rsync --daemon --config=/etc/rsyncd.conf" >>/etc/rc.local
#立即运行服务端
rsync --daemon --config=/etc/rsyncd.conf

cat >/etc/rsyncd.conf<<'EOF'
#指定传输文件时守护进程具有的用户ID,这里表示默认为nobady
uid=nobady
#指定传输文件时守护进程具有的用户组ID,这里表示默认为nobady
gid=nobody
#禁止切换目录
use chroot=no
#客户端的最大连接数，由于Aria2那边可能同时出现多个任务完成并传输的情况，所以这个不能设成1啥的
max connection=10
#检查口令文件的权限,口令文件的权限用户属组必须是root,权限必须是600
strict modes=yes
#pid文件的位置
pid file=/var/run/rsyncd.pid
#lock文件的位置
lock file=/var/run/rsyncd.lock
#日志文件的位置
log file=/var/log/rsyncd.log
 
#定义模块名,这玩意就是客户端命令跟在IP后面的
[plex]
#指定这个模块需要同步的路径，你需要在Plex中添加这个目录
path=/home/plex/movie
#这个是注释 可以自己定义
comment=plex library
#忽略一些无关的IO错误
ignore errors
#no代表客户端可以上传文件,yes表示只读取
read only=no
#no表示客户端可以下载文件,yes表示不能下载
write only=no
#表示允许连接的主机地址
hosts allow=1.2.3.4
#表示不允许连接的主机地址
hosts deny=*
#不允许该模块被客户端列出
list=false
#指定传输文件时守护进程具有的用户ID,
uid=root
#指定传输文件时守护进程具有的用户组ID,
gid=root
#用来指定连接该模块的用户名,用户名可以自定义，这个是客户端命令跟在IP前面那个
auth users=plex
#指定密码文件,文件里面记录的是用户名:密码
secrets file=/etc/srs.pass
EOF
 
echo "plex:密码" >/etc/srs.pass
#权限必须600，不然GG
chmod 600 /etc/srs.pass
#开机启动
echo "rsync --daemon --config=/etc/rsyncd.conf" >>/etc/rc.local
#立即运行服务端
rsync --daemon --config=/etc/rsyncd.conf
```
Rsync客户端(Aria2):

主要配置Aria2
```bash
vi /etc/aria2/aria2c.conf
#你配置文件不在这个地方不用我说啥了吧
#首先请在Aria2配置文件中加入如下内容，seed-time单位是分钟，不设置这个的话Aria2下载BT不会自动停止做种，然后也就触发不了hook
#手动暂停不视作任务完成,如果觉得30分钟太长可以短点，0是不做种，不太建议，不利于BT良性发展
seed-time=30
on-download-complete=/home/aria2-rsync.sh

#下面是hook脚本
cat >/home/aria2-mv.sh<<'EOF'
#!/bin/bash
SRC=$3
if [ "$2" == "0" ]; then
  exit 0
fi
while true; do
  DIR=`dirname "$SRC"`
  if [ `basename "$DIR"` == 'temp' ]; then
    #删掉些BT中没用的辣鸡文件
    find "$SRC" -regextype posix-extended -regex ".*\.(txt|htm|html|url|nfo|jpg|bmp|png|ico)" -exec rm -f {} \;
    #这边的plex@Rsync服务器IP::plex需要看好，前面是上面服务端指定的auth-user，后面的是有两个冒号的，跟着的是模块名
    rsync -avz --compress-level=1 --delete --password-file=/etc/rsyncd.pass "$SRC" plex@Rsync服务器IP::plex
    rm -rf "$SRC"
    exit $?
  else
    SRC=$DIR
  fi
done
EOF

chmod +x /home/aria2-rsync.sh

#添加rsync密码，这边不用像上面服务端一样带用户名
echo "密码" >/etc/rsyncd.pass
chmod 600 /etc/rsyncd.pass

vi /etc/aria2/aria2c.conf
#你配置文件不在这个地方不用我说啥了吧
#首先请在Aria2配置文件中加入如下内容，seed-time单位是分钟，不设置这个的话Aria2下载BT不会自动停止做种，然后也就触发不了hook
#手动暂停不视作任务完成,如果觉得30分钟太长可以短点，0是不做种，不太建议，不利于BT良性发展
seed-time=30
on-download-complete=/home/aria2-rsync.sh
 
#下面是hook脚本
cat >/home/aria2-mv.sh<<'EOF'
#!/bin/bash
SRC=$3
if [ "$2" == "0" ]; then
  exit 0
fi
while true; do
  DIR=`dirname "$SRC"`
  if [ `basename "$DIR"` == 'temp' ]; then
    #删掉些BT中没用的辣鸡文件
    find "$SRC" -regextype posix-extended -regex ".*\.(txt|htm|html|url|nfo|jpg|bmp|png|ico)" -exec rm -f {} \;
    #这边的plex@Rsync服务器IP::plex需要看好，前面是上面服务端指定的auth-user，后面的是有两个冒号的，跟着的是模块名
    rsync -avz --compress-level=1 --delete --password-file=/etc/rsyncd.pass "$SRC" plex@Rsync服务器IP::plex
    rm -rf "$SRC"
    exit $?
  else
    SRC=$DIR
  fi
done
EOF
 
chmod +x /home/aria2-rsync.sh
 
#添加rsync密码，这边不用像上面服务端一样带用户名
echo "密码" >/etc/rsyncd.pass
chmod 600 /etc/rsyncd.pass
```
这边需要将Aria2的下载目录(dir参数)指定为temp

>PS.这边就全OK了，我个人推荐第三种，最方便，如果cpu不行就把rsync的z参数还有后面的compress-level去掉，这样不带压缩模式可能会好点