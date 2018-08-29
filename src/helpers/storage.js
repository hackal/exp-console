export default class Storage {
  constructor () {
    this.provider = chrome.storage.local
    this.cache = [] // todo implement local caching?
    // this.updateCB = undefined
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
            SLUG: company.slug
          }
        }
      })

      this.provider.set({ COMPANIES: companies }, () => {
        this.updateApiDomains()
      })
    })
  }
}
