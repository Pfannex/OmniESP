@echo off
CLS

REM ----------------------------------------------------------------------------
REM MENU load or archive
REM ----------------------------------------------------------------------------

:start
  ECHO.
  ECHO what to do?
  ECHO -------------------------------------------------------------
  ECHO   [1] load device from archive into framework
  ECHO   [2] save device from framework to archive   (overwriting!)
  ECHO   [3] copy new clean OmniESP.json             (overwriting!)
  ECHO   [4] create NEW Device and load
  ECHO   [5] create NEW Module
  ECHO -------------------------------------------------------------
  ECHO   [6] build bin-files and tarball
  ECHO   [7] save build to archive                   (overwriting!)
  ECHO -------------------------------------------------------------
  ECHO   [8] EXIT
  SET /P toDo=

  IF %toDo% == 1 GOTO loadDevice
  IF %toDo% == 2 GOTO archiveDevice
  IF %toDo% == 3 GOTO copyOmniesp
  IF %toDo% == 4 GOTO newDevice
  IF %toDo% == 5 GOTO newModule
  IF %toDo% == 6 GOTO buildTarball
  IF %toDo% == 7 GOTO archiveBuild
  IF %toDo% == 8 GOTO end

  CLS
  ECHO Invalid Selection! Try again
  PAUSE
  CLS
  GOTO start

REM ----------------------------------------------------------------------------
REM [1] load device from archive
REM ----------------------------------------------------------------------------

:loadDevice
  CLS
  ECHO load device into framework
  ECHO -------------------------------------------
  ECHO.

  REM -----------------------------------------
  REM clean framework
  REM -----------------------------------------
      ECHO clean framework files....
      DEL data\customDevice\*.json
      DEL src\customDevice\customDevice*.*
      ECHO done
      ECHO.

  REM -----------------------------------------
  REM read directory and show
  REM -----------------------------------------
  :readDir
    setlocal EnableDelayedExpansion
    CD _customDevices
    SET /a i = 0
    FOR /D %%G in ("*") DO (
      SET /a i+=1
      SET "deviceDir[!i!]=%%~nxG"
      ECHO   [!i!] %%~nxG
    )
    SET /a i+=1
    ECHO [!i!] EXIT
    CD ..
    ECHO.

    ECHO select Device.....

REM -----------------------------------------
REM choose device
REM -----------------------------------------

  SET /P dirCounter=
  IF %dirCounter% == !i! GOTO end

  CLS
  ECHO load Device: !deviceDir[%dirCounter%]!
  ECHO -------------------------------------------
  ECHO.

  REM -----------------------------------------
  REM copy Files
  REM -----------------------------------------

  ECHO copy files...
  xcopy _customDevices\!deviceDir[%dirCounter%]!\data\customDevice\*.json data\customDevice /Y
  xcopy _customDevices\!deviceDir[%dirCounter%]!\src\customDevice\customDevice*.* src\customDevice /Y
  xcopy _customDevices\!deviceDir[%dirCounter%]!\firmware\version.json data /Y
  ECHO done
  ECHO.
  GOTO end

REM ----------------------------------------------------------------------------
REM [2] save device to archive
REM ----------------------------------------------------------------------------

:archiveDevice
  CLS
  ECHO archive Device
  ECHO -------------------------------------------
  ECHO.

  REM -----------------------------------------
  REM read directory and show
  REM -----------------------------------------

  setlocal EnableDelayedExpansion
  CD _customDevices
  SET /a i = 0
  FOR /D %%G in ("*") DO (
    SET /a i+=1
    SET "deviceDir[!i!]=%%~nxG"
    ECHO   [!i!] %%~nxG
  )
  SET /a i+=1
  ECHO [!i!] EXIT
  CD ..
  ECHO.
  ECHO select Device.....

  REM -----------------------------------------
  REM choose device
  REM -----------------------------------------

  SET /P dirCounter=
  IF %dirCounter% == !i! GOTO end

  CLS
  ECHO archive Device: !deviceDir[%dirCounter%]!
  ECHO -------------------------------------------
  ECHO.

  REM -----------------------------------------
  REM clean archive
  REM -----------------------------------------
  ECHO clean archive files !deviceDir[%dirCounter%]!....
  DEL _customDevices\!deviceDir[%dirCounter%]!\data\customDevice\*.json
  DEL _customDevices\!deviceDir[%dirCounter%]!\firmware\*.bin
  DEL _customDevices\!deviceDir[%dirCounter%]!\firmware\*.tar
  DEL _customDevices\!deviceDir[%dirCounter%]!\src\customDevice\customDevice*.*
  ECHO done
  ECHO.

  REM -----------------------------------------
  REM copy Files
  REM -----------------------------------------

  ECHO archive files to !deviceDir[%dirCounter%]!
  xcopy data\customDevice\*.json _customDevices\!deviceDir[%dirCounter%]!\data\customDevice /Y
  xcopy update\*.* _customDevices\!deviceDir[%dirCounter%]!\firmware /Y
  xcopy src\customDevice\customDevice*.* _customDevices\!deviceDir[%dirCounter%]!\src\customDevice /Y
  ECHO done
  ECHO.
  GOTO end

REM ----------------------------------------------------------------------------
REM copy new clean OmniESP.json
REM ----------------------------------------------------------------------------

:copyOmniesp
  CLS
  ECHO copy OmniESP to data DIR
  ECHO -------------------------------------------
  ECHO.
  ECHO copy files...
  xcopy _customDevices\OmniESP.json data /Y
  ECHO done
  ECHO.

REM ----------------------------------------------------------------------------
REM create NEW Device
REM ----------------------------------------------------------------------------

:newDevice
  CLS
  ECHO create NEW Device
  ECHO -------------------------------------------
  ECHO.
  ECHO please enter name of new device.....
  SET /P deviceName=

  ECHO creating directorys for %deviceName%
  mkdir _customDevices\%deviceName%
  mkdir _customDevices\%deviceName%\firmware
  mkdir _customDevices\%deviceName%\doc

  ECHO copy template to _customDevices\%deviceName%
  xcopy _customDevices\_template\*.* _customDevices\%deviceName%\*.* /S

  ECHO load %deviceName% into framework
  copy %~d0%~p0_customDevices\%deviceName%\data\customDevice\*.json data\customDevice
  copy %~d0%~p0_customDevices\%deviceName%\src\customDevice\customDevice*.* src\customDevice
  ECHO done

  ECHO.
  GOTO end

REM ----------------------------------------------------------------------------
REM create NEW Module
REM ----------------------------------------------------------------------------

:newModule
  CLS
  ECHO create NEW Module
  ECHO -------------------------------------------
  ECHO.
  ECHO in process...
  ECHO.
  GOTO end

REM ----------------------------------------------------------------------------
REM build tarball
REM ----------------------------------------------------------------------------

:buildTarball
  CLS
  ECHO build bin-files and tarball
  ECHO -------------------------------------------
  ECHO.
  
  pio run -t clean
  pio run
  pio run -t buildfs
  gulp tarball

  ECHO.
  GOTO end

REM ----------------------------------------------------------------------------
REM archive build
REM ----------------------------------------------------------------------------

:archiveBuild
  CLS
  ECHO archive build
  ECHO -------------------------------------------

  REM -----------------------------------------
  REM read directory and show
  REM -----------------------------------------

  setlocal EnableDelayedExpansion
  CD _customDevices
  SET /a i = 0
  FOR /D %%G in ("*") DO (
    SET /a i+=1
    SET "deviceDir[!i!]=%%~nxG"
    ECHO   [!i!] %%~nxG
  )
  SET /a i+=1
  ECHO [!i!] EXIT
  CD ..
  ECHO.
  ECHO select Device.....

  REM -----------------------------------------
  REM choose device
  REM -----------------------------------------

  SET /P dirCounter=
  IF %dirCounter% == !i! GOTO end

  CLS
  ECHO archive build for Device: !deviceDir[%dirCounter%]!
  ECHO -------------------------------------------
  ECHO.

  REM -----------------------------------------
  REM save build
  REM -----------------------------------------

  xcopy update\*.bin _customDevices\!deviceDir[%dirCounter%]!\firmware /Y
  xcopy update\*.tar _customDevices\!deviceDir[%dirCounter%]!\firmware /Y
  xcopy data\version.json _customDevices\!deviceDir[%dirCounter%]!\firmware /Y

  ECHO.
  GOTO end


:end
