<template>
  <div id="root">
    <div class="header">
      <div class="tab active">
        <span>OVERVIEW</span>
      </div>
      <div class="tab">
        <span>WARNINGS</span>
      </div>
      <div class="tab">
        <span>SETTINGS</span>
      </div>
    </div>

    <div class="content">
      <div class="event-table">
        <div class="event-table-header">
          <span>EVENTS</span>
        </div>
        <div class="event-table-body">
          <div class="event" v-for="(request, index) in requests" :key="index">
            <pre>
              {{ request }}
            </pre>
          </div>
        </div>
      </div>
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
        if (data.method === 'POST') {
          this.requests.push(data)
        }
        // if (data.method === 'POST') {
        //   // this.requests.push()
        //   this.requests.push(data)
        // }
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
  @import url('https://fonts.googleapis.com/css?family=Lato:300,400,700,900');
  * {
    font-family: 'Lato', sans-serif;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  #root {
    width: 100%;
    min-height: 100vh;
    background: #EDEEF7;
  }

  .header {
    height: 35px;
    background: #ffffff;
    padding: 0 25px;
    display: flex;

    .tab {
      border-top: 2px solid #ffffff;
      border-bottom: 2px solid #ffffff;
      height: 35px;
      margin-right: 25px;

      span {
        font-weight: bold;
        font-size: 11px;
        color: #636696;
        line-height: 31px;
      }

      &.active {
        border-bottom-color: #ffd500;
        cursor: pointer;
        span {
          color: #1C1733;
        }
      }

      &:hover {
        border-bottom-color: #ffd500;
        cursor: pointer;
        span {
          color: #1C1733;
        }
      }
    }
  }

  .content {
    padding: 25px;
    
    .event-table {
      border-radius: 4px 4px 0 0;
      box-shadow: 0 1px 2px 0 rgba(99,102,150,0.25);

      .event-table-header {
        background-color: #F8F7FD;
        height: 50px;
        padding: 0 20px;

        span {
          font-size: 12px;
          font-weight: bold;
          line-height: 50px;
        }
      }

      .event-table-body {
        .event {
          background: #ffffff;
          // height: 50px;
          // line-height: 50px;
          padding: 0 20px;
          border-bottom: 1px solid #EDEEF7;
        }
      }
    }
    
  }
</style>
