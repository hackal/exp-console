import Log from '../ext/logger.js'
export default {
  __list: [
    {
      active: true,
      message: 'Request did not have a timestamp',
      params: 'timestamp',
      fatal: false,
      wholeBulk: false,
      test (timestamp) {
        return !!timestamp
      }
    }
  ],
  get () {
    var list = Array.from(this.__list)
    let correct = true
    for (let f = 0; f < list.length; ++f) {
      let filter = list[f]
      if (!filter.active) {
        list.splice(f, 1)
        continue
      }
      for (let k = 0; k < this.__required.length; ++k) {
        let key = this.__required[k]
        if (!filter.hasOwnProperty(key)) {
          filter.active = false
          correct = false
          break
        }
      }
    }
    if (!correct) Log('ErrorList', 'One or more filters are not correct ... turning off those filter(s)')
    return list
  },
  __required: ['active', 'message', 'params', 'fatal', 'wholeBulk', 'test']
}
