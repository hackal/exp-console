export default class Hooks {
  onInstall (callback) {
    chrome.runtime.onInstalled.addListener((details) => {
      if (details.reason === 'install') callback()
    })
  }

  onUpdate (callback) {
    chrome.runtime.onInstalled.addListener((details) => {
      if (details.reason === 'update') callback()
    })
  }
}
