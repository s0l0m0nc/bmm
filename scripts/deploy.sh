#!/bin/bash

pm2_process_name="bmm"
# 获取当前脚本所在目录
workdir=$(cd $(dirname $0); pwd)

cd $workdir
echo "当前目录pwd: $(pwd)"

echo "🔄 开始更新代码"
git reset --hard
git pull
git reset --hard

echo "📦 安装依赖："
bun i

echo "🔨 构建应用："
bun run build

echo "文件夹大小："
du -hd 1

echo "🚀 启动服务："
pm2 delete $pm2_process_name
pm2 start "bun run start" --name $pm2_process_name
