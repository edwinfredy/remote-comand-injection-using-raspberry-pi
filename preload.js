const {contextBridge, ipcRenderer} = require('electron')
window.ipcRenderer = require('electron').ipcRenderer
let dataDiv = document.getElementById('dataDiv')

document.addEventListener('DOMContentLoaded', function() {

    ipcRenderer.on('mainChannel', function(event, message, requestType) {
        console.log('incoming message, requstType is ' + requestType)
        decodedText = new TextDecoder().decode(message)
        if (message.length < 1) {
            return
        }

        textOutput.innerText = decodedText
    })

    contextBridge.exposeInMainWorld('messageKey', {
        rendererToMain: function(message) {
            ipcRenderer.send('mainChannel', message)
        }
    })
})