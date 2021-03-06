const electron = require('electron')
// Module to control application life.

const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')


const Promise = require('promise');
const fs = require('fs')

var temp1stDic
var tempDic
// const tempDic = "/tmp/pngm"

function deleteFolderRecursive(path) {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach(function(file, index){
        var curPath = path + "/" + file;
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
          deleteFolderRecursive(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
};

const { Menu } = require('electron')
const template = [
  {
    label: 'Edit',
    submenu: [
      {role: 'undo'},
      {role: 'redo'},
      {type: 'separator'},
      {role: 'cut'},
      {role: 'copy'},
      {role: 'paste'},
      {role: 'pasteandmatchstyle'},
      {role: 'delete'},
      {role: 'selectall'}
    ]
  },
  {
    label: 'View',
    submenu: [
      {role: 'reload'},
      {role: 'forcereload'},
      {role: 'toggledevtools'},
      {type: 'separator'},
      {role: 'resetzoom'},
      {role: 'zoomin'},
      {role: 'zoomout'},
      {type: 'separator'},
      {role: 'togglefullscreen'}
    ]
  },
  {
    role: 'window',
    submenu: [
      {role: 'minimize'},
      {role: 'close'}
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click () { require('electron').shell.openExternal('https://github.com/MartinRGB/upng_tools_for_colleague') }
      }
    ]
  }

]

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function addMenu(){

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        {role: 'about'},
        {type: 'separator'},
        // {role: 'services', submenu: []},
        {label: 'Update',
          click () 
          { 
          require('electron').shell.openExternal('https://github.com/MartinRGB/upng_tools_for_colleague/releases') 
          }
        },
        {type: 'separator'},
        {role: 'hide'},
        {role: 'hideothers'},
        {role: 'unhide'},
        {type: 'separator'},
        {role: 'quit'}
      ]
    })
  
    // Edit menu
    // template[1].submenu.push(
    //   {type: 'separator'},
    //   {
    //     label: 'Speech',
    //     submenu: [
    //       {role: 'startspeaking'},
    //       {role: 'stopspeaking'}
    //     ]
    //   }
    // )
  
    // Window menu
    template[3].submenu = [
      {role: 'close'},
      {role: 'minimize'},
      {role: 'zoom'},
      {type: 'separator'},
      {role: 'front'}
    ]
  }

  const menu = Menu.buildFromTemplate(template)
  app.setApplicationMenu(menu)
}

function createWindow () {
  // Create the browser window.
  var titleHeight = 24;

  if(process.platform == 'darwin'){
    temp1stDic = "/tmp"
}
  else if(process.platform == 'win32'){
      temp1stDic = "/Temp"
  }


  tempDic = temp1stDic + '/pngm'
  console.log(tempDic)

  mainWindow = new BrowserWindow({
    width: 1200, 
    height: 720+titleHeight,
    minHeight: 720+titleHeight,
    minWidth: 1200,
    // maxHeight:720,
    // maxWidth:1600
  })

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '../index.html'),
    protocol: 'file:',
    slashes: true
  }))

  addMenu();

  // An indian coder's solution
  // mainWindow.loadURL("file://" + __dirname + "/index.html");

  // mainWindow.webContents.executeJavaScript(`
  //   var path = require('path');
  //   module.paths.push(path.resolve('node_modules'));
  //   module.paths.push(path.resolve('../node_modules'));
  //   module.paths.push(path.resolve(__dirname, '..', '..', 'electron', 'node_modules'));
  //   module.paths.push(path.resolve(__dirname, '..', '..', 'electron.asar', 'node_modules'));
  //   module.paths.push(path.resolve(__dirname, '..', '..', 'app', 'node_modules'));
  //   module.paths.push(path.resolve(__dirname, '..', '..', 'app.asar', 'node_modules'));
  //   path = undefined;
  // `);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.

    var myFirstPromise = new Promise(function(resolve, reject){
      if(fs.existsSync(tempDic)){
        deleteFolderRecursive(tempDic);
      }
      resolve()
    });
    myFirstPromise.then(function(){
      mainWindow = null;
    })
  })


}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
    
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
