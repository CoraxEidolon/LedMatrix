@echo off
chcp 1251
del %CD%\.FontList.js
for %%f in (*.json) do type "%%f" >> .FontList.js