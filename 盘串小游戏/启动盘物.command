#!/bin/zsh
cd "${0:A:h}"
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
if [[ -d "dist/盘物-darwin-arm64/盘物.app" ]]; then
  open "dist/盘物-darwin-arm64/盘物.app"
elif [[ -d "dist/盘物-darwin-x64/盘物.app" ]]; then
  open "dist/盘物-darwin-x64/盘物.app"
elif [[ -x "node_modules/.bin/electron" ]]; then
  npm start
else
  print "请先在项目目录运行 npm install，然后重新打开此文件。"
  read "?按回车退出"
fi
