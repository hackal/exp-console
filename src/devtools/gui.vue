<template>
  <div id='root-gui' @mouseover='expanded = true; toggleClass(expanded)' @mouseleave='expanded = false; toggleClass(expanded)'>
    <div class='gui-expanded'>
      <input type="text" id='copy-to-clip'>
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
      </div>
      <div class='ids-left'>
        <div class='customer-button' v-if='showGui' @click='takeToApp()'>
          <span>customer</span>
        </div>
        <span v-if='responseMsg'>{{ responseMsg }}</span>
      </div>
    <div class="separator"></div>
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
      expandedHeight: 0,
      copyEl: null,
      responseMsg: null
    }
  },
  computed: {
    showGui () {
      let length = 0
      for (let key in this.ids) { if (this.ids.hasOwnProperty(key)) length++ }
      return length > 0
    }
  },
  methods: {
    toggleClass (expanded) {
      expanded ? this.rootEl.classList.add('expanded') : this.rootEl.classList.remove('expanded')
    },
    copy (text) {
      this.copyEl.value = text
      this.copyEl.select()
      document.execCommand('copy')
    },
    takeToApp () {
      storage.getCompanies().then((companies) => {
        if (!this.info.token) {
          this.responseMsg = 'None project token, try to reload the page'
          return
        }
        let slug = this.linkProjectToken(this.info.token, companies)
        if (!slug) {
          this.responseMsg = 'You dont have access'
          return
        }
        let query = this.ids.cookie || this.ids[Object.keys(this.info.ids)[0]]
        if (!query) {
          this.responseMsg = 'You are not identified'
        }
        let appUrl = 'https://' + 'app.exponea' + '.com/p/' + slug + '/crm/customers/pages/1?query=' + query
        chrome.tabs.create({ active: true, url: appUrl })
      })
    },
    linkProjectToken (token, companies) {
      for (let key in companies) {
        if (key === token) return companies[key].SLUG
      }
      return undefined
    }
  },
  mounted () {
    this.rootEl = document.getElementById('root-gui')
    this.expandedHeight = document.getElementsByClassName('gui-row')
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

.ids {
  width: 60%;
  display: inline-block;
}

.ids-left {
  display: inline-block;

  .customer-button {
    position: relative;
    top: 50%;
    height: 10px;
    margin-top: -10px;
    margin-bottom: 5px;
    color: #fff;
    border: 1px solid #00a4c5;
    background-color: #00b7db;
    text-align: center;
    display: inline-block;
    font-size: 16px;
    padding: 2px 10px 12px 10px;
  }
  .customer-button:hover {
    cursor: pointer;
    background-color: #0096b4;
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

.separator {
  height: 1px;
  width: 100%;
  background-color: #EDEEF7;
  box-shadow: inset 0 1px 3px 0 rgba(0,0,0,0.1);
}
</style>

