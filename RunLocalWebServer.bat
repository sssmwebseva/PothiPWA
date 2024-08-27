set PYTHONPATH="C:\Python310"
set PATH=%PATH%;%PYTHONPATH%;%PYTHONPATH%\Scripts;
echo %PATH%
cd "D:\Tanmay\Seva\Javascript\Samagra\PothiPWA"

%PYTHONPATH%\python -m http.server --bind 192.168.29.230
REM %PYTHONPATH%\python -m http.server --bind 192.168.249.245