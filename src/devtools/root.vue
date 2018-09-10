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
          <div class="dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div class="event-table-body">
          <div class="event" v-for="(item, index) in list" :key="index">
            <div :class="`type-${item.type}`" class="name">
              <strong>{{ item.name }}</strong>
            </div>
            <div class="attributes" v-if="item.attributes.length > 0">
              <p><strong>Attributes</strong></p>
              <table border="0" cellspacing="0" cellpadding="0">
                <tr  v-for="(attr, i) in item.attributes" :key="i" class="attribute">
                  <td class="attr-name">{{ attr.name }}</td>
                  <td class="attr-value">{{ attr.value }}</td>
                  <td class="attr-type">{{ attr.type }}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Storage from '../helpers/storage.js'
  // import queryString from 'query-string'
  const storage = new Storage()

  function escapeRegExp (string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }
  
  export default {
    data: () => ({
      domains: [],
      domain: '',
      requests: [],
      logLevel: 'basic',
      basicEvents: ['session_ping']
    }),
    computed: {
      bulkFilter () {
        return new RegExp(this.domains.map((domain) => `((http|https)${escapeRegExp(`://${domain}/bulk`)})`).join('|'), 'g')
      },
      warnings () { },
      list () {
        const list = []
        this.requests.forEach((req) => {
          const item = {
            attributes: []
          }
          if (req.type === 'command' && req.data.name === 'crm/events') {
            if (this.logLevel === 'basic') {
              if (this.basicEvents.indexOf(req.data.data.type) !== -1) return
              item.type = 'event'
              item.name = req.data.data.type
              if (req.data.data.properties) {
                Object.keys(req.data.data.properties).forEach((key) => {
                  item.attributes.push({ name: key, value: req.data.data.properties[key], type: typeof req.data.data.properties[key] })
                })
              }
              list.push(item)
            }
          }
        })

        return list
      }
    },
    created () { },
    mounted () {
      this.$bus.$on('request', (data) => {
        if (data.method === 'POST') {
          if (data.url.match(this.bulkFilter)) {
            // validate body

            data.body.commands.forEach((command) => {
              this.requests.unshift({ type: 'command', data: command })
            })
          }
        }
        // if (data.method === 'POST') {
        //   // this.requests.push()
        //   this.requests.push(data)
        // }
      })

      this.$bus.$on('navigate', (data) => {
        this.requests.unshift({ type: 'navigation', data })
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
        display: flex;
        align-items: center;
        justify-content: space-between;

        span {
          font-size: 12px;
          font-weight: bold;
          // line-height: 50px;
        }

        .dots {
          display: flex;
          span {
            height: 4px;
            width: 4px;
            border-radius: 50%;
            margin: 0 1px;
            background-color: #9799C4;
          }
        }
      }

      .event-table-body {
        .event {
          background: #ffffff;
          border-bottom: 1px solid #EDEEF7;
          font-size: 14px;

          .name {
            padding: 0 20px 0 18px;
            height: 50px;
            line-height: 50px;

            &.type-event {
              border-left: 2px solid #ffd500;
            }
          }

          .attributes {
            font-size: 12px;
            padding: 20px;
            background: #F8F7FD;
            
            table {
              width: 100%;
              .attribute {
                display: flex;
                // justify-content: space-between;
                td {
                  padding: 5px 0;
                }
              }
              .attr-name {
                color: #1C1733;
                // padding-right: 20px;
                width: 130px;
              }
              .attr-value {
                color: #636696;
              }
              .attr-type {
                padding: 0;
                text-align: right;
                flex: 1 1 auto;
                color: #636696;
              }
            }
          }

          .navigation {
            font-size: 14px;
            line-height: 50px;
            color: #636696;
            background: #F8F7FD;
          }
        }
      }
    }
    
  }
</style>
