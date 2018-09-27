<template>
  <div id='root-settings'>
    <div class='content'>
      <div v-for='(setting, index) in registeredSettings' :key='index'>
        <div class='settings-divider'>
          <span>{{ setting.displayName }}</span>
        </div>
        <div class='setting'>
          <component :is='setting.name' :promise='settings' @saveSettings='saveSettings'></component>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Log from '../ext/logger.js'
import General from './settings/general.vue'
import ApiEndPoints from './settings/endPoints'
import Storage from '../helpers/storage.js'
import { SettingBus } from '../helpers/settingBus.js'

const storage = new Storage()
export default {
  data () {
    return {
      registeredSettings: []
    }
  },
  components: {
    'general-setting': General,
    'api-end-points-setting': ApiEndPoints
  },
  created () {
    this.registerComponentProperties('general-setting', 'General')
    this.registerComponentProperties('api-end-points-setting', 'API end points')
  },
  methods: {
    registerComponentProperties (componentName, displayName, storageKey) {
      if (!Object.keys(this.$options.components).includes(componentName)) {
        Log('root-settings', 'Component "' + componentName + '" could not been found. Dont forget to also include it in components section', 'warn')
        return
      }
      this.registeredSettings.push({ name: componentName, displayName: displayName })
    },
    saveSettings (settings) {
      storage.updateSettings(settings, () => {
        SettingBus.$emit('refreshSettings')
      })
    }
  },
  props: ['settings']
}
</script>
<style lang="scss" scoped>
$zIndex: 1;

#root-settings {
  width: 100%;
  height: 100vh;
  background: #ffffff;

  .content {
    padding: 5px 25px 25px 25px;
  }
}

.settings-divider {
    height: 4px;
    margin: 25px auto 10px;
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

