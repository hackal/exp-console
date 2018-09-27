<template>

<div id='root-end-points'>
  <div class='head'>
    <span class='title'>Exponea Console will automatically detect endpoints. The endpoints are detected by visiting the Exponea App. If you do not see your endpoint add it manually.</span>
  </div>
  <div class='body'>
    <div class="endpoint-wrapper">
      <div v-for="(endpoint, index) in endpoints" :key="index" class="endpoint">
        <span>- {{ endpoint }}</span>
        <span @click="deleteEndpoint(endpoint)"><i class="el-icon-delete"></i></span>
      </div>
    </div>
    <div class="endpoint-adder">
      <el-input size="mini" placeholder="Add new endpoint" v-model="endpoint" @keyup.enter.native="addEndpoint">
        <el-button slot="append" icon="el-icon-plus" type="primary" @click="addEndpoint"></el-button>
      </el-input>
    </div>
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
      endpoints: [],
      endpoint: ''
    }
  },
  mounted () {
    storage.onUpdate(() => {
      this.loadEndpoints()
    })
    this.loadEndpoints()
  },
  methods: {
    loadEndpoints () {
      this.endpoints.splice(0, this.endpoints.length)
      storage.getApiDomains().then((list) => {
        list.forEach(endpoint => {
          this.endpoints.push(endpoint)
        })
      })
    },
    addEndpoint () {
      if (this.endpoint === '') return
      storage.addDomains([this.endpoint])
      this.endpoint = ''
    },
    deleteEndpoint (endpoint) {
      storage.deleteDomains([endpoint])
    },
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
      font-size: 14px;
    }
  }

  .body {
    .hint {
      display: inline-block;
      margin-top: 5px;
      font-size: 14px;
      color: #636696;
    }

    .endpoint {
      padding: 2px 0;
      font-size: 12px;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      &:hover {
        // background

        i {
          display: block;
        }
      }

      i {
        display: none;
        margin-left: 5px;

        &:hover {
          cursor: pointer;
        }
      }
    }

    .endpoint-wrapper {
      margin-bottom: 10px;
    }
  }
  
}
</style>
