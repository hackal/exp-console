import itemTemplate from '../devtools/timeLineItem.js'
import Log from '../ext/logger.js'
export default class RequestProcessor {
  constructor (updateIdsCallback) {
    this.__updateIdsCallback = updateIdsCallback
    this.__ids = {}
    this.__loggerTag = 'RequestProcessor'
  }

  processRequest (details) {
    let reqInfo = {
      valid: false,
      items: [],
      parsed_body: null
    }
    if (details.body) {
      let body = details.body
      reqInfo.parsed_body = body
      if (/\/bulk$/.test(details.url)) {
        let firstData = body.commands[0].data
        this.updateIds(firstData.customer_ids === undefined ? firstData.ids : firstData.customer_ids)

        for (let i = 0; i < body.commands.length; ++i) {
          let command = body.commands[i]
          let item = this.processBasicCommand(command)
          if (item === -1) {
            Log(this.__loggerTag, 'Could not parsed item. Item has unknown name. Name: ' + command.name)
          } else {
            reqInfo.items.push(item)
            reqInfo.valid = true
          }
        }
      } else {
      }
    } else if (details.method === 'POST') {
      Log(this.__loggerTag, 'Last request did not have a body or was malformed. Request:')
      Log(this.__loggerTag, details)
    }
    return reqInfo
  }

  processBasicCommand (command) {
    let timeLineItem = null
    let data = command.data
    switch (command.name) {
      case 'crm/events':
        timeLineItem = itemTemplate(data.type, 'event', data.properties, data.properties.path ? data.properties.path : '', new URL(data.properties.location).host, {}, data.timestamp ? data.timestamp : (Date.now() / 1000))
        break
      case 'crm/customers':
        timeLineItem = itemTemplate('Update', 'update', data.properties, '', '', {}, Date.now())
        break
      default:
        timeLineItem = -1
    }
    return timeLineItem
  }

  updateIds (newIds) {
    let updatedIds = {}
    let update = false
    for (let key in newIds) {
      if (this.__ids[key] !== newIds[key]) {
        update = true
        updatedIds[key] = newIds[key]
        this.__ids[key] = newIds[key]
      }
    }
    if (update) {
      this.__updateIdsCallback(updatedIds)
    }
  }
}
