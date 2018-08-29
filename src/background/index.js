import Storage from '../helpers/storage.js'
import Request from '../helpers/webrequest.js'
// import ArrayBufferConverter from '../helpers/arrayBufferConverter.js'
import Hooks from '../helpers/hooks.js'
import Bus from '../helpers/bus.js'

const storage = new Storage()
const appRequest = new Request(['*://*/api/globals.json*'])
const apiRequest = new Request([])
// const arrayBufferConverter = new ArrayBufferConverter()
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
  bus.$emit('request', details, tabId)
})
