@echo off
if exist .git ( git pull || git add . && git stash && git pull )
if not exist node_modules ( npm install && goto start ) else ( goto start )
:start
npm start && goto restart
:restart
goto start
