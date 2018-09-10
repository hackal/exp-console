<template>
    <div class='event eventBody'>
        <div @click='expand' class='clickZone'>
          <span class='circle' :style='circleStyle'></span>
          <span class='name'>{{ data.name }}</span>
          <span class='timestamp'>{{ date }}</span>
        </div>
        <div class='properties' v-if='rolledOut'>
           <exp-property v-if='rolledOut' :key='index' v-for='(p,index) in data.value' :name='index' :value='p' ></exp-property>
        </div>
    </div>
</template>

<script>
import property from './property.vue'
import dateFormat from 'dateformat'
export default {
  props: ['data', 'size'],
  data () {
    return {
      colors: ['yellow', 'red', 'blue', 'limegreen', 'black', 'fuchsia', 'orange'],
      rolledOut: false
    }
  },
  components: {
    'exp-property': property
  },
  computed: {
    circleStyle () {
      var sum = 0
      for (var i = 0; i < this.data.name.length; ++i) {
        sum += this.data.name.charCodeAt(i)
      }
      var col = this.colors[sum % this.colors.length]
      var ret = { 'background-color': col }
      return ret
    },
    date () {
      return dateFormat(this.data.timeStamp * 1000, 'mmm d,yyyy HH:MM:ss')
    }
  },
  methods: {
    expand () {
      this.rolledOut = !this.rolledOut
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./eventBox.scss";

</style>
