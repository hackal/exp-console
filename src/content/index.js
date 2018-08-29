let globalsLoaded = false

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== 'APP_LOAD') return false
  if (!globalsLoaded) {
    globalsLoaded = true
    var xhr = new XMLHttpRequest()
    xhr.open('GET', message.request.url)
    xhr.onload = function () {
      if (xhr.status === 200) sendResponse(JSON.parse(xhr.responseText))
      else sendResponse(undefined)
    }
    xhr.send()
    return true
  }
  return false
})
