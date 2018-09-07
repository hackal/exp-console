<template>
  <div id="root">
    <exp-gui :ids='ids'></exp-gui>
    <div class="header">
      <div class="tab active">
        <router-link to="/events" class="span">EVENTS</router-link>
      </div>
      <div class="tab">
        <span class="span">WARNINGS</span>
      </div>
      <div class="tab">
        <span class="span">SETTINGS</span>
      </div>
    </div>

    <router-view></router-view>
  </div>
</template>
<script>
  import itemTemplate from './timeLineItem.js'
  import RequestProcessor from '../helpers/requestProcessor.js'
  import Gui from './gui.vue'

  export default {
    data: () => ({
      ids: {},
      domain: '',
      requests: [],
      items: null
    }),
    computed: { },
    created () {
      this.$router.push('/events')
    },
    mounted () {
      this.requestProcessor = new RequestProcessor(this.updateIds)
      this.$bus.$on('request', (data) => {
        let request = this.requestProcessor.processRequest(data)
        if (request.valid) {
          this.addItems(request.items)
        }
      })

      this.$bus.$on('navigate', (data) => {
        let url = new URL(data)
        this.addItems([itemTemplate('divider', 'divider', {}, url.pathname, url.host, {}, Date.now())])
      })
    },
    methods: {
      updateIds (ids) {
        this.ids = ids
      },
      addItems (items) {
        for (let i = 0; i < items.length; ++i) {
          this.$eventsProps.items.splice(0, 0, items[items.length - 1 - i])
        }
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

      .span {
        font-weight: bold;
        font-size: 11px;
        color: #636696;
        line-height: 31px;
        text-decoration: none;
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
