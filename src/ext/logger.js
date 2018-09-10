export default function Log (prefix, msg, type = 'log') {
  let backPage = chrome.extension.getBackgroundPage()
  backPage.console[type](prefix)
  backPage.console[type](msg)
  if (backPage !== window) {
    console[type](msg)
  }
}
