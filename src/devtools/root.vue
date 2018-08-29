<template>
  <div id="root">
    {{ $tabId }}
    <div v-for="(domain, index) in domains" :key="index">
      <span>{{ domain }}</span> - <span @click="deleteDomain(domain)">X</span>
    </div>
    <input type="text" v-model="domain">
    <button @click="addDomain">Add</button>
    <table>
      <tr v-for="(request, index) in requests" :key="index">
        <td>{{ request }}</td>
      </tr>
    </table>
    <div >
    </div>
  </div>
</template>
<script>
  import Storage from '../helpers/storage.js'
  const storage = new Storage()
  export default {
    data: () => ({
      domains: [],
      domain: '',
      requests: []
    }),
    computed: { },
    created () { },
    mounted () {
      this.$bus.$on('request', (data) => {
        this.requests.push(data)
      })

      this.$bus.$on('navigate', (data) => {
        this.requests.push(data)
      })

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
