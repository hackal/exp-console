<template>
    <div class='update eventBody'>
        <div @click='expand' class='clickZone'>
          <span class='circle' :style='circleStyle'></span>
          <span class='name'>update</span>
          <span class='timestamp'>{{ date }}</span>
          <div class='icon-errors' :style='warningStyle' v-if='data.errors.length > 0'>
          </div>
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
  data: function () {
    return {
      rolledOut: false
    }
  },
  components: {
    'exp-property': property
  },
  computed: {
    circleStyle () {
      var col = 'Aqua'
      var ret = { 'background-color': col }
      return ret
    },
    warningStyle () {
      let errors = this.data.errors
      for (let i = 0; i < errors.length; ++i) {
        let error = errors[i]
        if (error.fatal) {
          return { backgroundColor: 'red' }
        }
      }
      return { backgroundColor: 'yellow' }
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
