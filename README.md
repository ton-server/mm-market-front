## 配置

修改`.env`文件

1. VITE_API_URL：后端接口地址
2. VITE_VIP_RECEIVER = VIP充值接收地址
3. VITE_VIP_AMOUNT = VIP充值金额
4. VITE_TON_API_KEY = TonCenter服务API密钥（如果没有，前端将可能会有访问限制）

## 命令

1. 安装依赖： `yarn`
2. 本地启动： `yarn dev`
3. 项目构建： `yarn build`

## 部署

1. github page托管，执行`yarn deploy`, 自动将构建的dist目录上传部署
2. 将构建的dist目录上传到自己的服务器后，使用nginx等web服务器部署

## 访问

1. 创建电报小程序，将之前部署好的网站链接与之绑定
2. 启动小程序，连接钱包即可后使用

*部署好的网站并不能直接在浏览器里面访问，需要通过电报小程序使用，因为它使用了电报小程序的基础服务，而浏览器没有电报小程序的环境*