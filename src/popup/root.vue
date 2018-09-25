<template>
<div id='root-popup'>
  <div class='header'>
    <span>Exponea console</span>
  </div>
  <div class='body'>
    <div class='pointers'>
      <i class='line'></i>
      <i class="arrow"></i>
      <i class="arrow"></i>
      <i class="arrow"></i>
    </div>
    <span>is located in devtools.</span>
  </div>
</div>

</template>
<script>
  export default {
    data: () => ({
    }),
    computed: { },
    created () { },
    mounted () { },
    methods: {
      tab () {
        chrome.tabs.create({ url: 'pages/app.html' })
      }
    }
  }
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 1px 0 0 1px;
}

#root-popup {
  padding: 20px;
  width: max-content;
  
  * {
    font-family: 'Lato', sans-serif;
  }
  .header {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    
  }

  .body {
    margin-top: 10px;
    
    .arrow {
      border: solid black;
      border-width: 0 3px 3px 0;
      display: inline-block;
      padding: 3px;
      z-index: 2;
      transform: rotate(-45deg);
    }
    .line {
      height: 2px;
      width: 10px;
      border: solid black;
      border-width: 0 0px 1px;
      display: inline-block;
      position: relative;
      bottom: 3px;
      animation: slash 2s infinite;
    }
    .pointers {
      padding: 0 40px 0 50px;
    }

    span {
      display: inline-block;
      font-size: 13px;
      font-weight: bold;
      margin-top: 10px;
    }
  }
}

@keyframes slash {
  0% {
    opacity: 0;
    left: -20px;
  }
  20% {
    opacity: 1;
  }
  30% {
    opacity: 1;
  }
  50% {
    left: 60px;
    opacity: 0;
  }
  100% {
    left: 0px;
    opacity: 0;
  }
}


</style>

