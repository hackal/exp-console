export default class TimeLineItem {
  constructor (name = '', type = '', value = {}, path = '', host = '', errors = [], timeStamp = Date.now()) {
    this.__id = -1
    if (name === true) { // insted of function overloading (pre-filled template)
      this.name = name
      this.type = 'event'
      this.value = {'seconds': 22, 'brutal': 323.22323232323, 'name': 'daadad', 'tester': true, 'canihandleit': { 'dad': 5, 'string': 'hopi', 'stdaring': 'hopi', 'staaring': 'hopi', 'saatring': 'hopi', 'sntring': 'hopi' }}
      this.path = '/lol.jpg'
      this.host = 'exponea.com'
      this.errors = []
      this.timeStamp = Date.now()
      return
    }
    this.name = name
    this.type = type
    this.value = value
    this.path = path
    this.host = host
    this.errors = errors
    this.timeStamp = timeStamp
  }

  getId () {
    if (this.__id === -1) this.__id = '_' + Math.random().toString(36).substr(2, 9)
    return this.__id
  }
}
