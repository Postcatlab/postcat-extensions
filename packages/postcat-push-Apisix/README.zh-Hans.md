## Push to Apinto
将 Postcat API 数据一键推送到开源Apinto 网关；
## 1. Apinto简介
Apinto是一款高性能、可扩展、易维护的云原生API网关。
Apinto网关基于GO语言模块化开发，5分钟极速部署，配置简单、易于维护，支持集群与动态扩容，并且提供几十款网关插件和实用的企业级插件，让用户开箱即用。
## 2. 配置
### 2.1 部署Apinto和Apinto控制台

[Apinto开源仓库](https://github.com/eolinker/apinto)

[Apinto Dashboard开源仓库](https://github.com/eolinker/apinto-dashboard)
### 2.2 控制台相关配置
在浏览器输入地址：`http://{ip或域名}:{端口号}，访问控制台页面`

![](http://data.eolinker.com/course/hA87gFs093ed5f3ffb14c8d65d57704b9e968287f775cce.png)
#### 第一步：获取上游名称
点击上游服务菜单，展开后再点击上游管理进入上游管理列表页面，若没有上游可新建一个，选中想要的上游名称，复制即可，如下图所示：

![](http://data.eolinker.com/course/p98sgww86d4c5f67849c7ec59ddb8d4297dc7337b524177.png)
#### 第二步：获取API 分组ID
![](http://data.eolinker.com/course/676MnzK6b8c6f4bb9c62f1f2bfc19f476c7da4d18a2a5ac.jpeg)
#### 第三步：获取调用Apinto的OpenAPI的鉴权Token

![](http://data.eolinker.com/course/jTDRMGta7cc217885627c273be2c1a3e7f2008506e308f8.png)

### 2.3 插件配置

![](http://data.eolinker.com/course/y7RiZzwd7d3116b3b265a53d6c8a5bd5ff91587f6048a85.jpeg)

## 3. 使用

进入到主页面的设置，可以看到推送功能，点击该区域打开相应弹窗，即可看到推送类插件的名称。请选择想要的推送平台，点击【确定】按钮即可完成推送。

![](http://data.eolinker.com/course/S2LyR6Y9c78e885d3b3526165663e6bc8f3389a4980a99f.jpeg)

![](http://data.eolinker.com/course/DTvpaYp5975c49b291a5131300582629d82d0e5fd218e79.jpeg)

## 4. 推送结果

推送成功后可以看到提示成功到信息，表示推送过程无异常。如果推送失败，会弹出失败消息，有可能是网络错误，或推送的数据不合法，可以联系拓展开发者协助排查。