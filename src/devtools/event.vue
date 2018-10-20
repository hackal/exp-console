<template>
    <div class="event">
      <div class="event-header" @click="expand()">
        <span class='circle' :style='circleStyle'></span>
        <span class='name'>{{ data.name }}</span>
        <span class='timestamp'>{{ date }}</span>
      </div>
      <div class="event-body" v-if="rolledOut">
        <div class="properties">
           <exp-property v-if='rolledOut' :key='index' v-for='(p,index) in data.value' :name='index' :value='p' ></exp-property>
        </div>
      </div>
    </div>
</template>

<script>
import property from './property.vue'
import dateFormat from 'dateformat'
export default {
  props: ['data', 'size', 'test'],
  data () {
    return {
      colors: ['#FFEB3B', '#f44336', '#2196F3', '#CDDC39', '#4CAF50', '#9C27B0', '#FF9800'],
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
