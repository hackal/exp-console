<template>
  <div id="root-events">
    <div class="content">
      <div class="event-table"> 
        <div class="event-table-header">
          <input type="text" class='filter' v-model='filters.byName' placeholder='Event filter ..'>
        </div>

        <div class="event-table-body">
          <div class="eventPage">
            <div class="events-wrap">
              <div class='events'>
                <component :is=' "exp-" + e.type' :key='index' v-for='(e,index) in items' :data='e' :size='items.length' v-if='shouldShow(e)'></component>
              </div>
            </div>
            <div class="event-table-header">
              <exp-toggle @onSwitch='updateSessionFilter' ref='sessionSwitch' :position='{left: -2, top: 3}'></exp-toggle>
              <span> Show session events</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import event from './event.vue'
  import update from './update.vue'
  import divider from './divider.vue'
  import toggle from './switch.vue'
  import Names from './settings/names.js'

  export default {
    data: () => ({
      events: [],
      isUpdate: false,
      filters: {
        byName: '',
        showSessions: false
      },
      sessionEventsNames: ['session_ping']
    }),
    props: [
      'items',
      'settings'
    ],
    computed: { },
    created () { },
    components: {
      'exp-event': event,
      'exp-update': update,
      'exp-divider': divider,
      'exp-toggle': toggle
    },
    mounted () {
      this.settings.then((settings) => {
        this.$refs.sessionSwitch.set(settings[Names.show_session_events()])
      })
    },
    methods: {
      updateSessionFilter (value) {
        this.filters.showSessions = value
      },
      shouldShow (e) {
        if (!this.filters.showSessions && this.sessionEventsNames.includes(e.name)) {
          return false
        }
        if (this.filters.byName && e.type !== 'divider') {
          if (e.name.indexOf(this.filters.byName) === -1 || e.type === 'update') {
            return false
          }
        }
        return true
      }
    }
  }
</script>

<style lang="scss" scoped>
  $eventsWidth: 90%;
  $marginCenter: 5%;
  $eventGuiHeight: 45px;

  #root-events {
    width: 100%;
    height: 100%;
    background: #EDEEF7;
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

        * {
          font-size: 12px;
          font-weight: bold;
          line-height: 50px;
          display: inline-block;
        }

        .filter {
          height: 24px;
          font-size: 14px;
          width: 110px;
          border-color: transparent;
          padding-left: 8px;
          position: relative;
          top: 50%;
          margin-top: -15px;
          outline: none;
          background-color: transparent;
        }
        ::placeholder {
          color: #636696;
        }

      }
      }
    }

  input {
    display: inline-block;
  }
  .events-wrap {
    height: 75vh;
    background-color: white;
  }
  .events {
    overflow-y: auto;
    background-color: white;
    height: 100%;
  }
  .events::-webkit-scrollbar {
    width: 0px; 
    background-color: rgba(0,0,0,0);
  }
</style>