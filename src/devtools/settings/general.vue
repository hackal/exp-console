<template>
<div id='root-general'>
  <div v-for='(setting, index) in settings' :key='index'>
    <div class='description'>
      <span>{{ setting.text }}</span>
    </div>
    <div class='value'>
      <exp-toggle @onSwitch='(value) => { updateSetting(setting.key, value) }' ref='showSessionDefault' :position='{left:0, top:4}'></exp-toggle>
    </div>
  </div>
</div>
</template>
<script>
import Switch from '../switch'
import Names from '../settings/names.js'
export default {
  data () {
    return {
      settings: [
        {
          text: 'Show session events by default',
          key: Names.show_session_events(),
          init: false
        }
      ],
      data: {}
    }
  },
  props: [
    'promise'
  ],
  created () {
    for (let i = 0; i < this.settings.length; ++i) {
      let setting = this.settings[i]
      this.$set(this.data, setting.key, setting.init)
    }
    this.promise.then((settings) => {
      this.data = Object.assign(this.data, settings)
      this.$refs.showSessionDefault[0].set(this.data[Names.show_session_events()])
    })
  },
  components: {
    'exp-toggle': Switch
  },
  methods: {
    updateSetting (key, value) {
      this.data[key] = value
      this.$emit('saveSettings', this.data)
    }
  }
}
</script>
<style lang="scss" scoped>
#root-general {
  padding: 10px;
}
.value {
  float: right;
}
.description {
  display: inline-block;
  span {
    font-weight: bold;
    font-size: 16px;
  }
}
</style>

