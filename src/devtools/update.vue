<template>
    <div class='update eventBody'>
        <div @click='expand' class='clickZone' ref='zone'>
          <span class='circle' :style='circleStyle'></span>
          <span class='name'>{{ name }}</span>
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
      rolledOut: false,
      identify: false,
      name: 'update'
    }
  },
  components: {
    'exp-property': property
  },
  computed: {
    circleStyle () {
      var col = this.identify ? 'Grey' : 'Aqua'
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
      if (this.identify) return
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
  },
  mounted () {
    this.identify = Object.keys(this.data.value).length === 0
    if (this.identify) {
      this.name = 'identify'
      this.$refs.zone.style.cursor = 'default'
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./eventBox.scss";

</style>
