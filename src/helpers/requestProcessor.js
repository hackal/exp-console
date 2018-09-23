import Item from '../ext/timeLineItem.js'
import Log from '../ext/logger.js'
export default class RequestProcessor {
  constructor (updateIdsCallback) {
    this.__updateIdsCallback = updateIdsCallback
    this.__ids = {}
    this.__loggerTag = 'RequestProcessor'
    this.__onBulkProcessed = function () {}
  }

  processRequest (details) {
    let reqInfo = {
      valid: false,
      items: [],
      projectToken: null
    }
    let body = details.body
    if (body) {
      let firstData = body.commands ? body.commands[0].data : {}
      reqInfo.projectToken = body.company_id || firstData.company_id || body.project_id
      this.updateIds(firstData.ids || firstData.customer_ids || body.customer_ids)
      if (/\/bulk$/.test(details.url)) {
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
        this.__onBulkProcessed.call(this.__errorCatcher, details, reqInfo.items)
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
        timeLineItem = new Item(data.type, 'event', data.properties, data.properties.path ? data.properties.path : '', new URL(data.properties.location).host, [], data.timestamp ? data.timestamp : (Date.now() / 1000))
        break
      case 'crm/customers':
        timeLineItem = new Item('Update', 'update', data.properties, '', '', [], Date.now() / 1000)
        break
      default:
        return -1
    }
    command.id = timeLineItem.getId()
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

  catchErrors (errorCatcher) {
    this.__errorCatcher = errorCatcher
    this.__onBulkProcessed = errorCatcher.onBulkProcessed
  }
}
