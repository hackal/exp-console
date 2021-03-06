export default class Storage {
  constructor () {
    this.provider = chrome.storage.local
  }

  onUpdate (callback) {
    chrome.storage.onChanged.addListener(callback)
  }

  getCompanies () {
    return new Promise((resolve, reject) => {
      this.provider.get(['COMPANIES'], ({ COMPANIES }) => {
        if (COMPANIES === undefined) resolve({})
        else resolve(COMPANIES)
      })
    })
  }

  getApiDomains () {
    return new Promise((resolve, reject) => {
      this.provider.get(['API_DOMAINS'], ({ API_DOMAINS }) => {
        if (API_DOMAINS === undefined) resolve([])
        else resolve(API_DOMAINS)
      })
    })
  }

  setDomains (list) {
    const domainSet = new Set()

    if (Array.isArray(list)) {
      list.forEach(domain => {
        domainSet.add(domain)
      })
    } else {
      domainSet.add(list)
    }

    this.provider.set({ API_DOMAINS: Array.from(domainSet) }, () => {
      // this.updateCB()
    })
  }

  addDomains (list) {
    this.getApiDomains().then(domains => {
      if (domains === undefined) domains = []
      const domainSet = new Set(domains)

      if (Array.isArray(list)) {
        list.forEach(domain => {
          domainSet.add(domain)
        })
      } else {
        domainSet.add(list)
      }

      this.provider.set({ API_DOMAINS: Array.from(domainSet) }, () => {
        // this.updateCB()
      })
    })
  }

  deleteDomains (list) {
    this.getApiDomains().then(domains => {
      if (domains === undefined) domains = []
      const domainSet = new Set(domains)

      if (Array.isArray(list)) {
        list.forEach(domain => {
          domainSet.delete(domain)
        })
      } else {
        domainSet.delete(list)
      }

      this.provider.set({ API_DOMAINS: Array.from(domainSet) }, () => {
        // this.updateCB()
      })
    })
  }

  updateApiDomains () {
    this.getApiDomains().then(domains => {
      if (domains === undefined) domains = []
      const domainSet = new Set(domains)

      this.getCompanies().then(companies => {
        if (companies === undefined) companies = {}
        Object.keys(companies).forEach(id => {
          domainSet.add(companies[id].API_DOMAIN)
        })

        this.provider.set({ API_DOMAINS: Array.from(domainSet) }, () => {
          // this.updateCB()
        })
      })
    })
  }

  getCompanyById (id) {
    return new Promise((resolve, reject) => {
      this.getCompanies().then(companies => {
        resolve(companies[id])
      })
    })
  }

  updateCompanies (data) {
    this.getCompanies().then((companies) => {
      if (companies === undefined) companies = {}
      data.forEach(company => {
        if (!companies.hasOwnProperty(company._id)) {
          companies[company._id] = {
            TOKEN: company._id,
            API_DOMAIN: company.domain_mapping.api_domain,
            APP_DOMAIN: company.domain_mapping.app_domain,
            SLUG: company.slug,
            NAME: company.company_name
          }
        }
      })

      this.provider.set({ COMPANIES: companies }, () => {
        this.updateApiDomains()
      })
    })
  }

  getSettings () {
    return new Promise((resolve, reject) => {
      this.provider.get(['SETTINGS'], ({SETTINGS}) => {
        if (!SETTINGS) resolve({})
        else resolve(SETTINGS)
      })
    })
  }

  updateSettings (settings, callback = function () {}) {
    this.getSettings().then((oldSettings) => {
      let newSettings = Object.assign(oldSettings, settings)
      this.provider.set({SETTINGS: newSettings}, () => {
        callback()
      })
    })
  }

  getCookie () {
    return new Promise((resolve, reject) => {
      this.provider.get(['COOKIE'], ({COOKIE}) => {
        if (!COOKIE) resolve('')
        else resolve(COOKIE)
      })
    })
  }

  setCookie (cookie, callback = function () {}) {
    this.provider.set({COOKIE: cookie}, () => {
      callback()
    })
  }
}
