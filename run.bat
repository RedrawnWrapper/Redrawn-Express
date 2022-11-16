@echo off
if exist .git ( git pull || git add . && git stash && git pull )
start oldrun.bat
start anirun.bat
if not exist node_modules ( npm install && npm start ) else ( npm start )