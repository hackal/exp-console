<template>

<div id='root-end-points'>
  <div class='head'>
    <span class='title'>Here you can update from which api-end-points we will track data. Some domains will be added here automatically</span>
    <span class='hint'>seperate domains with ";"</span>
  </div>
  <div class='body'>
    <textarea name="" id="" cols="30" rows="10"></textarea>
  </div>
</div>  

</template>
<script>
import Names from './names.js'
import Storage from '../../helpers/storage.js'

export default {
  data () {
    return {
      settings: {},
      inputSettingName: Names.api_end_points()
    }
  },
  created () {
    this.promise.then((settings) => {
      this.settings = settings
    })
  },
  methods: {
    saveSettings (value, key) {
      this.settings[key] = value
      this.$emit('saveSettings', this.settings)
    }
  },
  components: {
    'exp-toggle': Toggle
  },
  props: [
    'promise'
  ]
}
</script>
<style lang="scss" scoped>


</style>
