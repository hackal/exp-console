<template>
  <div id="root">
    <exp-gui :ids='ids'></exp-gui>
    <div class="header">
      <router-link to="/events" class="tab active">
        <span>EVENTS</span>
      </router-link>
      <router-link to="/settings"  class="tab">
        <span>SETTINGS</span>
      </router-link>
    </div>

    <router-view :items='items'></router-view>
  </div>
</template>
<script>
  import Item from '../ext/timeLineItem.js'
  import RequestProcessor from '../helpers/requestProcessor.js'
  import Gui from './gui.vue'
  import ErrorCatcher from '../helpers/errorCatcher.js'
  import ErrorList from '../ext/filters.js'

  export default {
    data: () => ({
      ids: {},
      domain: '',
      requests: [],
      items: [],
      activeTab: null
    }),
    computed: { },
    created () {
      this.$router.push('/events')
      this.requestProcessor = new RequestProcessor(this.updateIds)
      this.requestProcessor.catchErrors(new ErrorCatcher(ErrorList.get()))
    },
    mounted () {
      this.$bus.$on('request', (data) => {
        let request = this.requestProcessor.processRequest(data)
        if (request.valid) {
          this.addItems(request.items)
        }
      })

      this.$bus.$on('navigate', (data) => {
        let url = new URL(data)
        this.addItems([new Item('divider', 'divider', {}, url.pathname, url.host, [], Date.now())])
      })
      this.activeTab = document.querySelector('.tab.active')
      let tabs = document.querySelectorAll('.tab')
      for (let i = 0; i < tabs.length; ++i) {
        let tab = tabs[i]
        var vueContext = this
        tab.onclick = function (e) {
          vueContext.activate(e)
        }
      }
    },
    methods: {
      updateIds (ids) {
        this.ids = ids
      },
      addItems (items) {
        for (let i = 0; i < items.length; ++i) {
          this.items.splice(0, 0, items[items.length - 1 - i])
        }
      },
      activate (event) {
        let element = event.currentTarget
        this.activeTab.classList.remove('active')
        element.classList.add('active')
        this.activeTab = element
      }
    },
    components: {
      'exp-gui': Gui
    }
  }
</script>
<style lang="scss" scoped>
  @import url('https://fonts.googleapis.com/css?family=Lato:300,400,700,900');
  * {
    font-family: 'Lato', sans-serif;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  body {
    margin: 0;
  }

  #root {
    width: 100%;
    max-height: 100vh;
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
      text-decoration: none;
      display: block;

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
</style>
