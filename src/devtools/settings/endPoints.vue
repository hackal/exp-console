<template>

<div id='root-end-points'>
  <div class='head'>
    <span class='title'>Here you can update from which api-end-points we will track data<br>Sometimes you will need to restart chrome in order to save changes</span>
  </div>
  <div class='body'>
    <textarea spellcheck="false" name="" id="" rows="4" class="end-points" @focusout='updateDomains()' v-model='inputText'></textarea>
    <span class='hint'>seperate domains with ";"</span>
  </div>
</div>  

</template>
<script>
import Names from './names.js'
import Storage from '../../helpers/storage.js'

const storage = new Storage()
export default {
  data () {
    return {
      settings: {},
      inputSettingName: Names.api_end_points(),
      inputText: ''
    }
  },
  created () {
    storage.getApiDomains().then((list) => {
      this.inputText = list.toString().replace(',', ';') + ';'
    })
    this.promise.then((settings) => {
      this.settings = settings
    })
  },
  methods: {
    saveSettings (value, key) {
      this.settings[key] = value
      this.$emit('saveSettings', this.settings)
    },
    updateDomains () {
      let list = this.inputText.replace(' ', '').replace(/\n/g, '').split(';')
      list.forEach((domain, index) => {
        if (domain.length === 0) {
          list.splice(index, 1)
        }
      })
      storage.setDomains(list)
    }
  },
  components: { },
  props: [
    'promise'
  ]
}
</script>
<style lang="scss" scoped>
#root-end-points {
  padding: 0 15px 15px 15px;

  .head {
    margin: 5px 0px 10px 0px;
    .title {
      font-size: 16px;
      font-weight: bold;
    }
  }

  .body {
    .hint {
      display: inline-block;
      margin-top: 5px;
      font-size: 14px;
      color: #636696;
    }

    .end-points {
      display: block;
      resize: none;
      width: 100%;
      font-size: 14px;
    }
  }
  
}
</style>
