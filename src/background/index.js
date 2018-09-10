import Storage from '../helpers/storage.js'
import Request from '../helpers/webrequest.js'
import Hooks from '../helpers/hooks.js'
import Bus from '../helpers/bus.js'
import ArrayBufferConverter from '../helpers/arrayBufferConverter.js'

const arrayBufferConverter = new ArrayBufferConverter()
const storage = new Storage()
const appRequest = new Request(['*://*/api/globals.json*'])
const apiRequest = new Request([])
const extension = new Hooks()
const companiesCache = {}
const bus = new Bus(true)

extension.onInstall(() => {
  storage.addDomains(['api.exponea.com', 'api.infinario.com'])
})

appRequest.completed((details) => {
  const tabId = details.tabId
  chrome.tabs.sendMessage(tabId, { type: 'APP_LOAD', request: details }, (response) => {
    if (response === undefined) return false
    const companies = response.companies
    if (companies !== undefined) storage.updateCompanies(companies)
  })
})

storage.getApiDomains().then(domains => {
  const filters = domains.map(domain => `*://${domain}/*`)
  apiRequest.updateFilters(filters)
})

storage.getCompanies().then(companies => {
  Object.assign(companiesCache, companies)
})

storage.onUpdate(() => {
  storage.getApiDomains().then(domains => {
    const filters = domains.map(domain => `*://${domain}/*`)
    apiRequest.updateFilters(filters)
  })

  Object.assign({}, companiesCache)
  storage.getCompanies().then(companies => {
    Object.assign(companiesCache, companies)
  })
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading') {
    bus.$emit('navigate', tab.url, tabId)
  }
})

apiRequest.beforeRequest((details) => {
  const tabId = details.tabId
  const data = {
    method: details.method,
    requestId: details.requestId,
    tabId: details.tabId,
    timeStamp: details.timeStamp,
    type: details.type,
    url: details.url,
    initiator: details.initiator
  }

  if (data.method === 'POST') {
    data.body = arrayBufferConverter.toJSON(details.requestBody.raw[0].bytes)
  }

  bus.$emit('request', data, tabId)
})

apiRequest.completed((details) => {
  const tabId = details.tabId
  const data = {
    requestId: details.requestId,
    fromCache: details.fromCache,
    responseHeaders: details.details,
    statusCode: details.statusCode,
    statusLine: details.statusLine,
    timeStamp: details.timeStamp
  }

  bus.$emit('ack', data, tabId)
})

apiRequest.error((details) => {
  const tabId = details.tabId
  const data = {
    error: details.error,
    fromCache: details.fromCache,
    initiator: details.initiator,
    method: details.method,
    requestId: details.requestId,
    tabId: details.tabId,
    timeStamp: details.timeStamp,
    url: details.url
  }

  bus.$emit('error', data, tabId)
})
