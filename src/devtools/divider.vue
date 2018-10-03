<template>
  <div class='divider' @click='expand'>
    <div class='divider-body'>
      <p>
        <span class='name'>Navigated to:</span>
        <span class='url'> {{ display }}</span>
      </p>
      <span v-if='!rolledOut && hasParams' class='arrow'>«</span>
    </div>
    <div class="properties" v-if='rolledOut && hasParams'>
      <exp-property :key='index' v-for='(p,index) in params' :name='index' :value='p' ></exp-property>
    </div>
  </div>
</template>
<script>
import Property from './property.vue'

export default {
  data () {
    return {
      lettersTreshold: 60,
      params: {},
      rolledOut: false
    }
  },
  props: ['data'],
  computed: {
    display () {
      let path = this.data.path
      let start = path.indexOf('www.')
      let offset = start === -1 ? 'https://'.length : 'www.'.length
      start = start === -1 ? path.indexOf('https://') : start
      if (start === -1) {
        start = 0
        offset = 0
      }
      path = path.substring(start + offset)
      let end = path.indexOf('?')
      end = end === -1 ? path.length : end
      path = path.substring(0, end)
      return path
    },
    hasParams () {
      return Object.keys(this.params).length > 0
    }
  },
  mounted () {
    this.params = this.getUrlParams(this.data.path)
  },
  methods: {
    expand () {
      this.rolledOut = !this.rolledOut
    },
    getUrlParams (url) {
      let regex = /[?&]([^=#]+)=([^&#]*)/g
      let params = {}
      let match
      while ((match = regex.exec(url))) {
        params[match[1]] = match[2]
      }
      return params
    }
  },
  components: {
    'exp-property': Property
  }
}
</script>
<style lang="scss" scoped>
// TODO add url params as attributes
.divider {
  border-bottom: 1px solid #ebeef7;
  background: #F8F7FD;
  align-items: center;
  padding: 12px 0 5px 15px;

  .properties {
    padding: 3px 0 3px 15px;
    font-weight: normal;
  }
  .divider-body {
    box-sizing: border-box;
    position: relative;
    height: 18px;
  }
  .arrow {
    font-size: 20px;
    color:#636696;
    position: absolute;
    left: 49%;
    bottom: 0;
    transform: rotate(-90deg);
    user-select: none;
  }
  p {
    margin: 0;
  }
  p .name {
    font-weight: normal;
    color:#636696;
  }
  p .url {
    float: right;
    margin-right: 10px;
    font-weight: bold;
  }
}
</style>

