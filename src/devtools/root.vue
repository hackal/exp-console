<template>
  <div id="root">
    <div v-for="(domain, index) in domains" :key="index">
      <span>{{ domain }}</span> - <span @click="deleteDomain(domain)">X</span>
    </div>
    <input type="text" v-model="domain">
    <button @click="addDomain">Add</button>
  </div>
</template>
<script>
  import Storage from '../helpers/storage.js'
  const storage = new Storage()
  export default {
    data: () => ({
      domains: [],
      domain: ''
    }),
    computed: { },
    created () {
      console.log('devtools')
    },
    mounted () {
      this.refreshDomains()
      storage.onUpdate(this.refreshDomains)
    },
    methods: {
      deleteDomain (domain) {
        storage.deleteDomains(domain)
      },
      refreshDomains () {
        this.domains.splice(0)
        storage.getApiDomains().then(domains => {
          domains.forEach(domain => this.domains.push(domain))
        })
      },
      addDomain () {
        if (this.domain === '') return
        storage.addDomains(this.domain)
      }
    }
  }
</script>
<style lang="scss">
  div {
    color: blue
  }
</style>
