export default class Bus {
  constructor (incoming = false) {
    this.prefix = 'exp_'
    this.incoming = incoming
    this.connections = {}
    this.history = {}
    this.provider = undefined

    if (this.incoming) { // handle disconnects
      chrome.runtime.onConnect.addListener((port) => {
        this.connections[port.name] = port
        if (this.history.hasOwnProperty(port.name) && this.history[port.name].length > 0) {
          this.history[port.name].forEach(({ id, message }) => {
            this.$emit(id, message, port.name.split('_')[1], true)
          })
        }
      })
    }
  }

  connect (tabId) {
    this.provider = chrome.runtime.connect({ name: `${this.prefix}${tabId}` })
  }

  addToHistory (hash, message) {
    if (this.history.hasOwnProperty(hash)) {
      this.history[hash].push(message)
    } else {
      this.history[hash] = [message]
    }
  }

  $emit (id, message, tabId, save = false) {
    if (this.incoming && tabId !== undefined) {
      const hash = `${this.prefix}${tabId}`
      if (this.connections.hasOwnProperty(hash)) {
        this.connections[hash].postMessage({ id, message })
      }
      if (!save) this.addToHistory(hash, { id, message })
    } else {
      this.provider.postMessage({ id, message })
    }
  }

  $on (id, callback, tabId) {
    if (this.incoming && tabId !== undefined) {
      if (this.connections.hasOwnProperty(`${this.prefix}${tabId}`)) {
        this.connections[`${this.prefix}${tabId}`].onMessage.addListener((message) => {
          if (message.id === id) callback(message.message)
        })
      }
    } else {
      this.provider.onMessage.addListener((message) => {
        if (message.id === id) callback(message.message)
      })
    }
  }
}
