@echo off
cd quickvideo-api
if not exist node_modules ( npm install && npm start ) else ( npm start )