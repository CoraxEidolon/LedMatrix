@echo off
chcp 1251
del %CD%\.FontList.js
(call echo var FontList=[
for /f delims^= %%i in ('dir %CD%\*.js/b /d') do (
set "file=%%i"
call echo "%%file:%cd%=%%",
)) > .FontList.txt
Echo ];>>".FontList.txt"
rename .FontList.txt .FontList.js