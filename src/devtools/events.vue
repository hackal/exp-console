<template>
  <div id="root">
    <div class="content">
      <div class="event-table"> 
        <div class="event-table-header">
          <input type="text" class='filter' v-model='filters.byName' placeholder='Event filter ..'>
        </div>

        <div class="event-table-body">
          <div class="eventPage">
            <div class="events-wrap">
              <div class='events'>
                <component :is=' "exp-" + e.type' :key='index' v-for='(e,index) in eventsProps.items' :data='e' :size='eventsProps.length'></component>
              </div>
            </div>
            <!-- v-if='!((filters.showSessions === false && sessionEventsNames.includes(e.name)) || (!!filters.byName && (e.name.indexOf(filters.byName) === -1 || e.type === "exp-update")))' -->
            <div class="event-table-header">
              <exp-toggle class="switch" @onSwitch='updateSessionFilter'></exp-toggle>
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
      'eventsProps'
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
      this.eventsProps.items.push('lol')
      console.log(this.eventsProps)
    },
    methods: {
      updateSessionFilter (value) {
        this.filters.showSessions = value
      }
    }
  }
</script>
<style lang="scss">
  .switch {
    top: 3px;
    left: -2px
  }
</style>

<style lang="scss" scoped>
  $eventsWidth: 90%;
  $marginCenter: 5%;
  $eventGuiHeight: 45px;

  #root {
    width: 100%;
    min-height: 90vh;
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

      }
      }
    }

  input {
    display: inline-block;
  }
  .eventGui {
    // width: $eventsWidth;
    // margin-left: $marginCenter;
    // height: $eventGuiHeight;
    background-color: white;
  }
  .eventGui.top .filter {
    height: 24px;
    width: 110px;
    border-color: transparent;
    position: relative;
    top: 50%;
    margin-top: -15px;
    outline: none;
    background-color: transparent;
  }
  .eventGui.top input:active {
    border: none;
  }
  // .eventPage {
  //   max-width: 100vw;
  //   width: 100vw;
  //   height: 100vh;
  //   max-height: 100vh;
  //   background-color: #EBEEF7;
  // }
  .events-wrap {
    height: 80vh;
    background-color: white;
  }
  .events {
    // width: $eventsWidth;
    // margin-left: $marginCenter;
    overflow-y: auto;
    background-color: white;
    padding-top: 3px;
  }
  .events::-webkit-scrollbar {
    width: 0px; 
    background-color: rgba(0,0,0,0);
  }
  .eventGui.bottom {
    font-size: 15px;
    height: 28px;
    font-family: Lato,sans-serif;
    font-weight: 700;
    vertical-align: middle;
  }
  .eventGui.bottom * {
    position: relative;
    top: 4px;
  }
</style>