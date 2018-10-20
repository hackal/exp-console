<template>
  <div id="root">
    <exp-gui :ids='ids' :info='guiExtraInfo'></exp-gui>
    <div class="header">
      <router-link to="/events" class="tab">
        <span>EVENTS</span>
      </router-link>
      <router-link to="/settings"  class="tab">
        <span>SETTINGS</span>
      </router-link>
      <a @click="feedbackDialog = true" class="tab">
        <span>FEEDBACK</span>
      </a>
    </div>

    <router-view :settings='settings'></router-view>

    <el-dialog
      title="Feedback and Suggestions"
      :visible.sync="feedbackDialog"
      width="70%">
      <el-input
        type="textarea"
        :rows="5"
        placeholder="Your message"
        v-model="feedbackMessage">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="feedbackDialog = false">Cancel</el-button>
        <el-button size="small" type="primary" @click="submitFeedback">Submit Feedback</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import Item from '../ext/timeLineItem.js'
  import RequestProcessor from '../helpers/requestProcessor.js'
  import Gui from './gui.vue'
  import ErrorCatcher from '../helpers/errorCatcher.js'
  import ErrorList from '../ext/filters.js'
  import Storage from '../helpers/storage.js'
  import { VueBus } from '../helpers/vueBus.js'
  import Exponea from '../helpers/exponea-sdk.js'

  const storage = new Storage()
  export default {
    data: () => ({
      ids: {},
      requests: [],
      activeTab: null,
      lastHost: '',
      guiExtraInfo: {
        token: '',
        apiDomain: ''
      },
      settings: {},
      feedbackDialog: false,
      feedbackMessage: '',
      exponea: new Exponea()
    }),
    computed: { },
    created () {
      this.$router.push('/events')
      this.requestProcessor = new RequestProcessor(this.updateIds)
      this.requestProcessor.catchErrors(new ErrorCatcher(ErrorList.get()))

      this.settings = storage.getSettings()
      VueBus.$on('refreshSettings', () => {
        this.settings = storage.getSettings()
      })
    },
    mounted () {
      this.exponea.trackEvent('open_devtools')
      this.$bus.$on('request', (data) => {
        let request = this.requestProcessor.processRequest(data)
        if (request.valid) {
          this.guiExtraInfo.token = request.projectToken
          this.addItems(request.items)
        }
      })

      this.$bus.$on('error', code => {
        console.log(code)
      })

      this.$bus.$on('navigate', (data) => {
        this.addItems([new Item('divider', 'divider', {}, data, data, [], Date.now() / 1000)])
      })
    },
    methods: {
      submitFeedback () {
        this.exponea.trackEvent('feedback', { feedback: this.feedbackMessage })
        this.feedbackDialog = false
        this.$message({
          message: 'Thank you for your feedback. 😍😍😍',
          type: 'success'
        })
      },
      updateIds (updatedIds, completeIds) {
        this.ids = completeIds
        this.addItems([new Item('identify', 'update', updatedIds, '', '', [], Date.now() / 1000)])
      },
      addItems (items) {
        VueBus.$emit('items_add', items)
      }
    },
    components: {
      'exp-gui': Gui
    }
  }
</script>
<style>
body {
  margin: 0;
  padding: 0;
}
</style>

<style lang="scss" scoped>
  @import url('https://fonts.googleapis.com/css?family=Lato:300,400,700,900');
  * {
    font-family: 'Lato', sans-serif;
    // padding: 0;
    // margin: 0;
    box-sizing: border-box;
  }

  body {
    margin: 0;
  }

  ::-webkit-scrollbar {
    display: none !important;
  }
 
  #root {
    width: 100%;
    height: 100vh;
    background: #EDEEF7;
    overflow-y: hidden;
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

      &.router-link-active {
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
