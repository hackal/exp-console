export default class Request {
  constructor (filters) {
    this.filters = filters
    this.provider = chrome.webRequest
    this.beforeRequestCB = undefined
    this.completedCB = undefined
    this.errorCB = undefined
  }

  updateFilters (filters) {
    this.filters = filters
    if (this.beforeRequestCB !== undefined) {
      this.provider.onBeforeRequest.removeListener(this.beforeRequestCB)
      this.provider.onBeforeRequest.addListener(this.beforeRequestCB, { urls: this.filters }, ['requestBody'])
    }
    if (this.completedCB !== undefined) {
      this.provider.onCompleted.removeListener(this.completedCB)
      this.provider.onCompleted.addListener(this.completedCB, { urls: this.filters }, ['responseHeaders'])
    }
    if (this.errorCB !== undefined) {
      this.provider.onErrorOccurred.removeListener(this.errorCB)
      this.provider.onErrorOccurred.addListener(this.errorCB, { urls: this.filters })
    }
  }

  beforeRequest (callback) {
    this.beforeRequestCB = callback
    this.provider.onBeforeRequest.addListener(this.beforeRequestCB, { urls: this.filters }, ['requestBody'])
  }

  completed (callback) {
    this.completedCB = callback
    this.provider.onCompleted.addListener(this.completedCB, { urls: this.filters }, ['responseHeaders'])
  }

  error (callback) {
    this.errorCB = callback
    this.provider.onErrorOccurred.addListener(this.errorCB, { urls: this.filters })
  }
}
