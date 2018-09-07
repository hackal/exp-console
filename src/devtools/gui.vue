<template>
  <div id='root-gui' @mouseover='expanded = true; toggleClass(expanded)' @mouseleave='expanded = false; toggleClass(expanded)'>
    <div class='gui-expanded'>
      <input type="text" id='copy-to-clip'>
      <div v-for='(key, index) in ids' :key='index' class='gui-row'>
      <div class='gui-key'>
        <span>
          {{ index }}
        </span>
      </div>
      <div class='gui-id' @click='copy(key)'>
        <span>
          {{ key }}
        </span>
      </div>
      <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" @click='copy(key)'><path d="M22 6v16h-16v-16h16zm2-2h-20v20h20v-20zm-24 17v-21h21v2h-19v19h-2z"/></svg>
    </div>
    <div class="separator"></div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      expanded: false,
      rootEl: null,
      contractedHeight: 0,
      expandedHeight: 0,
      copyEl: null
    }
  },
  methods: {
    toggleClass (expanded) {
      expanded ? this.rootEl.classList.add('expanded') : this.rootEl.classList.remove('expanded')
    },
    copy (text) {
      this.copyEl.value = text
      this.copyEl.select()
      document.execCommand('copy')
    }
  },
  mounted () {
    this.rootEl = document.getElementById('root-gui')
    this.expandedHeight = document.getElementsByClassName('gui-row')
    this.copyEl = document.getElementById('copy-to-clip')
  },
  props: ['ids']
}
</script>
<style lang="scss" scoped>
#root-gui {
  width: 100%;
  position: relative;
  overflow: hidden;
  transition: height 0.4s;
  background-color: #ffffff;
}
#copy-to-clip {
  position: absolute;
  z-index: -1;
}

.copy-icon {
  opacity: 0;
  width: 15px;
  height: 15px;
  position: absolute;
  margin-left: 10px;
}

.copy-icon:hover {
  width: 16px;
  cursor: pointer;
  height: 16px;
}

.gui-row:hover .copy-icon {
  opacity: 0.9;
}

.gui-row {
  min-width: 350px;
  width: 350px;
  margin: 5px 0 5px 25px;
  font-size: 14px;
  div {
    display: inline-block;
  }
  .gui-key {
    float: left;
    span {
      height: 17px;
      color: #636696;
      font-family: Lato;
      font-size: 12px;
      font-weight: bold;
      line-height: 15px;
    }
  }
  .gui-id {
    margin-left: 10px;
    span {
      height: 17px;
      color: #1C1733;
      font-family: Lato;
      font-size: 14px;
      line-height: 17px;
    }
  }
  .gui-id:hover {
    cursor: pointer;
  }
}

.gui-contracted-id {
  margin-left: 15px;
  color: #1C1733;
  font-family: Lato;
  font-size: 14px;
  line-height: 17px;
}

.separator {
  height: 1px;
  width: 100%;
  background-color: #EDEEF7;
  box-shadow: inset 0 1px 3px 0 rgba(0,0,0,0.1);
}
</style>

