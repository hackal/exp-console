<template>
    <div class='event eventBody'>
        <div @click='expand' class='clickZone'>
          <span class='circle' :style='circleStyle'></span>
          <span class='name'>{{ data.name }}</span>
          <span class='timestamp'>{{ date }}</span>
          <div class='icon-errors' :style='warningStyle' v-if='data.errors.length > 0' @mouseover='calculatePosition($event.currentTarget)' @mouseout='cancelTooltip($event.currentTarget)'>
            <div class='tooltip'>
              <div class='tooltip-row' v-for='(e,index) in data.errors' :key='index'>
                <span>{{ e.msg }}</span>
              </div>
              <br>
            </div>
          </div>
        </div>
        <div class='properties' v-if='isRolledOut'>
           <exp-property v-if='isRolledOut' :key='index' v-for='(p,index) in data.value' :name='index' :value='p' ></exp-property>
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
      rolledOut: false,
      calculated: false
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
    },
    isRolledOut () {
      return this.rolledOut
    }
  },
  methods: {
    expand () {
      this.rolledOut = !this.rolledOut
    },
    calculatePosition (rootEl) {
      if (this.calculated) return
      let tooltip = rootEl.querySelector('.tooltip')
      tooltip.style.position = 'absolute'
      tooltip.style.display = 'block'
      tooltip.style.right = (tooltip.offsetWidth / 10) + 'px'
      tooltip.style.top = (tooltip.offsetHeight / 10) + 'px'
      this.calculated = true
    },
    cancelTooltip (rootEl) {
      this.calculated = false
      let tooltip = rootEl.querySelector('.tooltip')
      tooltip.style.display = 'none'
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./eventBox.scss";



</style>
