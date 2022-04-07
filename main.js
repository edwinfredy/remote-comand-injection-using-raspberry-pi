const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const net = require('net')

let window

const createWindow = function() {
     window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
             preload: path.join(__dirname, 'preload.js')
        }
     })

     window.loadFile('index.html')
     window.webContents.on('did-finish-load', function() {
     })
}

app.whenReady().then(function() {
     createWindow()
})

app.on('window-all-closed', () => {
     if (process.platform !== 'darwin') {
          app.quit()
     }
})

ipcMain.on('mainChannel', function(event, message) {
     console.log(message + '\n')
})

var server = net.createServer()
server.on('connection', handleConnection)

server.listen(4444, function() {
    console.log('server listening on ' + server.address().address + ":" + server.address().port)
})

function handleConnection(conn) {
    var remoteAddress = conn.remoteAddress + ':' + conn.remotePort
    console.log('new client connection from' + remoteAddress)

     conn.write('pwd')

    conn.on('data', onConnData)
    conn.on('close', onConnClose)
    conn.on('error', onConnError)

    ipcMain.on('mainChannel', function(event, message) {
          let requestType = message.split(' ')[0]
          console.log('sending message: ' + message)
          console.log('request type: ' + requestType)
          conn.write(message)
     })

    function onConnData(d) {
        console.log('connection data from ', + conn.remoteAddress + ': ' + d)
        window.webContents.send('mainChannel', d)
    }

    function onConnClose() {
        console.log('connection closed from ' + remoteAddress)
    }

    function onConnError(err) {
        console.log('connection error: ' + remoteAddress + ' : ' + err.message)
    }
}