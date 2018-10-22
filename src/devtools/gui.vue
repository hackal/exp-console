<template>
  <div id='root-gui' @mouseover='expanded = true;' @mouseleave='expanded = false;' :style='rootStyle'>
    <div class='gui-hidden' v-if='showGui'>
      <div class='ids'>
        <div v-for='(key, index) in ids' :key='index' class='gui-row'>
          <div class='gui-key'>
            <span>
              {{ index }}
            </span>
          </div>
          <div class='gui-id' @click='copy(key)'>
            <span>
              {{ key }}
            </span>
          </div>
          <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" @click='copy(key)'><path d="M22 6v16h-16v-16h16zm2-2h-20v20h20v-20zm-24 17v-21h21v2h-19v19h-2z"/></svg>
        </div>
        <span v-if='!expanded' class='arrow'>«</span>
      </div>
      <input type="text" id='copy-to-clip'>
    </div>
    <div class='gui-expanded' v-if='showGui'>
      <div class='button customer-button' @click='takeToApp()'>
        <span>customer</span>
      </div>
      <span v-if='responseMsg'>{{ responseMsg }}</span>
      <div class='button refresh-ids' @click='trueAnonymize()'>
        <span>delete site cookies</span>
      </div>

      <div v-if='false' class='conjoin-btn'>
        <div class='button refresh-ids' @click='trueAnonymize()'>
          <span>delete cookies</span>
        </div>
        <div class='button restore-ids' @click='restoreCookies()'>
          <span>restore cookies</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Storage from '../helpers/storage.js'
const storage = new Storage()

export default {
  data () {
    return {
      expanded: false,
      rootEl: null,
      contractedHeight: 0,
      expandedOffset: 40,
      copyEl: null,
      responseMsg: null,
      idHeight: 18.5,
      restore: []
    }
  },
  computed: {
    showGui () {
      let length = 0
      for (let key in this.ids) { if (this.ids.hasOwnProperty(key)) length++ }
      return length > 0
    },
    rootStyle () {
      let contractedHeight = Object.keys(this.ids).length * this.idHeight + 15
      if (this.expanded) {
        return { height: (contractedHeight + this.expandedOffset) + 'px' }
      } else {
        return { height: contractedHeight + 'px' }
      }
    }
  },
  methods: {
    copy (text) {
      this.copyEl.value = text
      this.copyEl.select()
      document.execCommand('copy')
    },
    takeToApp () {
      storage.getCompanies().then((companies) => {
        this.responseMsg = ''
        if (!this.info.token) {
          this.responseMsg = 'No project token, try to reload the page'
          return
        }
        let project = this.linkProjectToken(this.info.token, companies)
        if (!project) {
          this.responseMsg = 'You dont have access'
          return
        }
        let query = this.ids.cookie || this.ids[Object.keys(this.info.ids)[0]]
        if (!query) {
          this.responseMsg = 'You are not identified'
        }
        let appUrl = 'https://' + project.APP_DOMAIN + '/p/' + project.SLUG + '/crm/customers/pages/1?query=' + query
        chrome.tabs.create({ active: true, url: appUrl })
      })
    },
    linkProjectToken (token, companies) {
      for (let key in companies) {
        if (key === token) {
          return companies[key]
        }
      }
      return undefined
    },
    restoreCookies () {
      for (let i = 0; i < this.restore.length; ++i) {
        chrome.cookies.set(this.restore[i])
      }
      this.restore = []
    },
    trueAnonymize () {
      var cookies = []
      chrome.webNavigation.getAllFrames({ tabId: this.$tabId }, details => {
        var urls = details.reduce((urls, frame) => {
          if (urls.indexOf(frame.url) === -1) urls.push(frame.url)
          return urls
        }, [])
        var index = 0
        urls.forEach(url => {
          chrome.cookies.getAll({ url: url }, additionalCookies => {
            cookies = cookies.concat(additionalCookies)
            if (++index === urls.length) {
              console.log(cookies)
              cookies.forEach(cookie => {
                let prefix = cookie.httpOnly ? 'http://' : 'https://'
                let url = prefix + cookie.domain.replace('www', '').replace('.', '')
                this.restore.push({ url: url, value: cookie.value })
                chrome.cookies.remove({ url: url, name: cookie.name })
              })
            }
          })
        })
      })
      // let hostFormat = this.info.host.replace('www', '')
      // chrome.cookies.getAll({ domain: hostFormat }, cookies => {
      //   for (let i = 0; i < cookies.length; ++i) {
      //     let cookie = cookies[i]
      //     let prefix = cookie.httpOnly ? 'http://' : 'https://'
      //     let url = prefix + cookie.domain.replace('www', '').replace('.', '')
      //     this.restore.push({ url: url, value: cookie.value })
      //     chrome.cookies.remove({ url: url, name: cookie.name })
      //   }
      // })
    }
  },
  mounted () {
    this.rootEl = document.getElementById('root-gui')
    this.copyEl = document.getElementById('copy-to-clip')
  },
  props: ['ids', 'info']
}
</script>
<style lang="scss" scoped>
#root-gui {
  width: 100%;
  position: relative;
  overflow: hidden;
  transition: height 0.4s;
  background-color: #ffffff;
}
#copy-to-clip {
  position: absolute;
  z-index: -1;
}

.gui-hidden {
  position: relative;
}
.ids {
  width: 60%;
  display: inline-block;
}

.button {
  color: #fff;
  border: 1px solid #00a4c5;
  box-sizing: border-box;
  background-color: #00b7db;
  text-align: center;
  display: inline-block;
  font-size: 16px;
  padding: 2px 10px 2px 10px;
}

.gui-expanded {
  display: block;
  position: relative;
  padding: 10px 15%;
  
  .customer-button {
    margin-bottom: 5px;
    width: 190px;
  }
  .refresh-ids {
    background-color: rgb(197, 9, 9);
    border: 1px solid rgb(161, 10, 10);
    float: right;
    width: 190px;
  }
  .refresh-ids:hover {
    cursor: pointer;
    background-color:  rgb(167, 15, 15);
  }
  .customer-button:hover {
    cursor: pointer;
    background-color: #0096b4;
  }
  .conjoin-btn {
    float: right;
    display: inline-block;
    
    .restore-ids {
      background-color: rgb(33, 151, 9);
      border: 1px solid rgb(23, 88, 10);
      width: max-content;
    }

    .restore-ids:hover {
      cursor: pointer;
      background-color: rgb(27, 124, 7);
    }

    .refresh-ids {
      background-color: rgb(197, 9, 9);
      border: 1px solid rgb(141, 14, 14);
      position: relative;
      left: 5px;
      float: initial;
      width: max-content;
    }

    .refresh-ids:hover {
      cursor: pointer;
      background-color:  rgb(167, 15, 15);
    }
  }
}

.copy-icon {
  opacity: 0;
  width: 15px;
  height: 15px;
  position: absolute;
  margin-left: 10px;
}

.copy-icon:hover {
  width: 16px;
  cursor: pointer;
  height: 16px;
}

.gui-row:hover .copy-icon {
  opacity: 0.9;
}

.gui-row {
  min-width: 350px;
  width: 350px;
  margin: 5px 0 5px 25px;
  font-size: 14px;
  div {
    display: inline-block;
  }
  .gui-key {
    float: left;
    span {
      height: 17px;
      color: #636696;
      font-family: Lato;
      font-size: 12px;
      font-weight: bold;
      line-height: 15px;
    }
  }
  .gui-id {
    margin-left: 10px;
    span {
      height: 17px;
      color: #1C1733;
      font-family: Lato;
      font-size: 14px;
      line-height: 17px;
    }
  }
  .gui-id:hover {
    cursor: pointer;
  }
}

.gui-contracted-id {
  margin-left: 15px;
  color: #1C1733;
  font-family: Lato;
  font-size: 14px;
  line-height: 17px;
}

.arrow {
  font-size: 20px;
  color:#636696;
  float: right;
  transform: rotate(-90deg);
  position: absolute;
  right: 25px;
  bottom: 3px;
  user-select: none;
}

</style>

