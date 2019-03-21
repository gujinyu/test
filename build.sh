#!/bin/sh
# 使用node v6
export PATH=/home/fis/node/v6/bin:/home/fis/v6/npm/bin:$PATH
export MAC=64

node --version

# 安装项目所需依赖
#npm install --registry=http://cp01-fis-build-02.epc.baidu.com:8995
#npm install --registry=http://registry.npm.baidu.com
npm install --registry=https://registry.npm.taobao.org

echo "build start"

# 使用 gulp 构建
npm run build

echo "build end"

# 放入output文件夹
PRODUCT_NAME="intelligent-map"
APP_NAME="daqian-pmp-web"
mkdir -p output/$PRODUCT_NAME/$APP_NAME
cp -r dist output/$PRODUCT_NAME/$APP_NAME
cd output
tar cvzf daqian-pmp-web.tar.gz $PRODUCT_NAME
rm -rf $PRODUCT_NAME
