
注意`config.js`需要你自己从`config.sample.js`拷贝并且填写你自己的相关配置。

### redis

##### centos 安装

更新安装源来安装最新得包

```
sudo yum install epel-release
sudo yum update
```

安装 redis

```
sudo yum install redis
```

后台启动 redis

```
sudo systemctl start redis
```

设置开机启动 redis

```
sudo systemctl enable redis
```
