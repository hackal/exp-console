import Log from '../ext/logger.js'
import ItemError from '../ext/error.js'

export default class ErrorCatcher {
  constructor (filters, shouldLog = false) {
    this.filters = filters
    this.__log = shouldLog ? Log : function () {}
  }

  onBulkProcessed (request, items) {
    var commands = request.body.commands
    for (let f = 0; f < this.filters.length; ++f) {
      let filter = this.filters[f]
      if (filter.active) {
        if (filter.wholeBulk) {
          let params = this.__getParamsFromRequest(filter.params, request)
          let passed = filter.test.apply(undefined, params)
          if (!passed) {
            this.__log('ErrorCatcher-filter', filter.message, filter.fatal ? 'error' : 'warn')
            for (let i = 0; i < items.length; ++i) {
              let item = items[i]
              item.errors.push(new ItemError(filter.message, filter.fatal))
            }
          }
        } else {
          for (let c = 0; c < commands.length; ++c) {
            let command = commands[c]
            let params = this.__getParamsFromCommand(filter.params, command)
            let passed = filter.test.apply(undefined, params)
            if (!passed) {
              this.__log('ErrorCatcher-filter', filter.message, filter.fatal ? 'error' : 'warn')
              let found = this.__linkItem(command, items)
              if (found === -1) continue
              found.errors.push(new ItemError(filter.message, filter.fatal))
            }
          }
        }
      }
    }
  }

  __linkItem (command, items) {
    if (!command.id) {
      Log('ErrorCatcher', 'Command does not have id defined')
      return -1
    }
    for (let i = 0; i < items.length; ++i) {
      let item = items[i]
      if (item.getId() === command.id) return item
    }
    Log('ErrorCatcher', 'No item was found during linking')
    return undefined
  }

  __deepFind (object, key) {
    let type = object.constructor.name
    if (type === 'Object') {
      if (object[key] === undefined) {
        for (let id in object) {
          if (typeof object[id] !== 'object' || typeof object[id].constructor === 'undefined') continue
          let retVal = this.__deepFind(object[id], key)
          if (retVal !== undefined) {
            return retVal
          }
        }
      } else {
        return object[key]
      }
    } else if (type === 'Array') {
      for (let i = 0; i < object.length; ++i) {
        let member = object[i]
        if (typeof member === 'object') this.__deepFind(member, key)
      }
    }
    return undefined
  }

  __getParamsFromCommand (params, command) {
    params = typeof params === 'object' ? params : [params]
    let retVal = []

    for (let p = 0; p < params.length; ++p) {
      let param = params[p]
      retVal.push(this.__deepFind(command, param))
    }

    return retVal
  }

  __getParamsFromRequest (params, request) {
    params = typeof params === 'object' ? params : [params]
    let retVal = []
    for (let p = 0; p < params.length; ++p) {
      let param = params[p]
      switch (param) {
        case 'request':
          retVal.push(request)
          break
        default:
          retVal.push(request[param] || request.body[param])
          break
      }
    }
    return retVal
  }
}
