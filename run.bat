@echo off
if exist .git ( git pull || git add . && git stash && git pull )
if not exist node_modules ( npm install && npm start ) else ( npm start )