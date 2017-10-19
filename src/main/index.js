'use strict'

import { app, BrowserWindow, dialog, ipcMain, Tray, Menu } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
var path = require('path')
var iconpath = path.join(__dirname, 'user.png') // path of y
let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    icon: iconpath
  })

  mainWindow.loadURL(winURL)

  var appIcon = new Tray(iconpath)
  var contextMenu = Menu.buildFromTemplate([
    {
      label: 'Mostrar MaqApp',
      click: function () {
        mainWindow.show()
      }
    },
    {
      label: 'Cerrar',
      click: function () {
        app.isQuiting = true
        app.quit()
        if (appIcon) appIcon.destroy()
      }
    }
  ])

  appIcon.setToolTip('Aplicación de maquetación Telco 3.0')
  appIcon.setContextMenu(contextMenu)

  appIcon.on('click', (a, b) => {
    mainWindow.show()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
    if (appIcon) appIcon.destroy()
  })
  mainWindow.on('minimize', function (event) {
    event.preventDefault()
    mainWindow.hide()
  })
  mainWindow.on('show', function () {
    appIcon.setHighlightMode('always')
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('open-file-dialog', function (event) {
  dialog.showOpenDialog({
    properties: ['openFile', 'openDirectory']
  }, function (files) {
    if (files) event.sender.send('selected-directory', files)
  })
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
