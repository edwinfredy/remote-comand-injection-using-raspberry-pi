const textInput = document.getElementById('textInput')
const buttonInput = document.getElementById('buttonInput')
let textOutput = document.getElementById('textOutput')
let backButtonContainer = document.getElementById('backButtonContainer')
let dataDiv = document.getElementById('dataDiv');

let dirDepth = 0

buttonInput.addEventListener('click', async function() {
    textOutput.innerText = ''
    textInput.focus()
    await window.messageKey.rendererToMain(textInput.value)
    textInput.value = ""
})

window.addEventListener('keyup', function(event) {
    if (event.keyCode === 13) {
        buttonInput.click()
    }
})