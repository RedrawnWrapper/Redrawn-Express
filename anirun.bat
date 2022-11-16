@echo off
cd oldapi
if not exist node_modules ( npm install && npm start ) else ( npm start )