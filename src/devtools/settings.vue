<template>
  <div id='root-settings'>
    <div class='content'>
      <div v-for='(setting, index) in registeredSettings' :key='index'>
        <div class='settings-divider'>
          <span>{{ setting.displayName }}</span>
        </div>
        <div class='setting'>
          <component :is='setting.name' :data='settingsLoaded[setting.storageKey]' @saveSettings='(data) => { saveSettings(data, setting.storageKey) }'></component>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Log from '../ext/logger.js'
import General from './settings/general.vue'
export default {
  data () {
    return {
      registeredSettings: [],
      settingsLoaded: {}
    }
  },
  components: {
    'general-setting': General
  },
  created () {
    this.registerComponentProperties('general-setting', 'General', 'general_settings')
  },
  methods: {
    registerComponentProperties (componentName, displayName, storageKey) {
      if (!Object.keys(this.$options.components).includes(componentName)) {
        Log('root-settings', 'Component "' + componentName + '" could not been found. Dont forget to also include it in components section', 'warn')
        return
      }
      // to-do set setting from storage
      this.settingsLoaded[storageKey] = {}

      this.registeredSettings.push({ name: componentName, displayName: displayName, storageKey: storageKey })
    },
    saveSettings (settings, key) {
      // to-do implement storage
    }
  }
}
</script>
<style lang="scss" scoped>
$zIndex: 1;

#root-settings {
  width: 100%;
  height: 100%;
  background: #ffffff;

  .content {
    padding: 25px;
  }
}

.settings-divider {
    height: 4px;
    margin: 10px auto 10px;
    background-color: black;
    z-index: $zIndex;

    span {
      position: relative;
      z-index: $zIndex + 1;
      background-color: #ffffff;
      font-size: 22px;
      left: 40px;
      bottom: 14px;
      padding: 0 8px 0 8px;
    }
  }

.setting {
  background-color: #EDEEF7;
  border-radius: 8px;
  padding: 12px 4px 12px 4px;
}
</style>

