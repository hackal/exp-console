import axios from 'axios'
import Storage from './storage.js'
import uuidv1 from 'uuid/v1'

export default class Exponea {
  constructor (
    username = 'x58umhl9p2ta8pa7o4n59gffo42i4mtxw4rlvqppokefr3rhpj9yoe04yii4hrfd',
    password = 'ymrmoish0zaft3ci20d7lop4mlv3uh8da021o63b2vg2x9ne89gpzsnwirfiqncv',
    token = 'e34f3d84-bfd4-11e8-960d-0a580a20226a',
    endpoint = 'https://api.exponea.com'
  ) {
    this.url = `${endpoint}/track/v2/projects/${token}/batch`
    this.transport = axios.create({
      baseURL: this.url,
      auth: {
        username,
        password
      }
    })
    this.storage = new Storage()
    this.cookie = this.getCookie()
    this.initQueue = []
    this.init = false
  }

  initialize () {
    this.init = true
    if (this.initQueue.length > 0) {
      this.sendCommands(this.initQueue)
    }
  }

  getCookie () {
    return this.storage.getCookie().then(cookie => {
      console.log(cookie)
      if (cookie === '') {
        const newCookie = uuidv1()
        this.cookie = newCookie
        this.storage.setCookie(newCookie, () => {
          this.initialize()
        })
      } else {
        this.cookie = cookie
        this.initialize()
      }
    })
  }

  trackEvent (type, properties = {}, timestamp = Math.round((+new Date()) / 1000)) {
    const command = {
      name: 'customers/events',
      data: {
        customer_ids: {
          cookie: this.cookie
        },
        event_type: type,
        timestamp,
        properties
      }
    }

    this.sendCommands([command])
  }

  updateCustomer (properties) {
    const command = {
      name: 'customers',
      data: {
        customer_ids: {
          cookie: this.cookie
        },
        properties
      }
    }

    this.sendCommands([command])
  }

  sendCommands (commands) {
    if (this.init) {
      commands.forEach(command => {
        command.data.customer_ids.cookie = this.cookie
      })
      this.transport.post(this.url, {
        commands
      })
    } else {
      commands.forEach(command => {
        command.data.customer_ids.cookie = this.cookie
        this.initQueue.push(command)
      })
    }
  }
}
