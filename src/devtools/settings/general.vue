<template>
<div id='root-general'>
  <div v-for='(setting, index) in settings' :key='index'>
    <div class='description'>
      <span>{{ setting.text }}</span>
    </div>
    <div class='value'>
      <exp-toggle @onSwitch='(value) => { updateSetting(setting.key, value) }' :default='data[setting.key] ? data[setting.key] : setting.init' :position='{left:0, top:4}'></exp-toggle>
    </div>
  </div>
</div>
</template>
<script>
import Switch from '../switch'
export default {
  data () {
    return {
      settings: [
        {
          text: 'Show session events by default',
          key: 'show_session_events',
          init: false
        }
      ]
    }
  },
  props: [
    'data'
  ],
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

