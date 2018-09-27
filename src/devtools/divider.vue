<template>
  <div class='divider'>
    <div class="divider-body">
      <p><span>Navigated to:</span> {{ data.host }}</p>
    </div>
  </div>
</template>
<script>
export default {
  props: ['data']
}
</script>
<style lang="scss" scoped>
// TODO add url params as attributes
.divider {
  border-bottom: 1px solid #ebeef7;
  padding: 0 0 0 15px;
  background: #F8F7FD;
  height: 40px;
  font-weight: bold;
  display: flex;
  align-items: center;

  p span {
    font-weight: normal;
    color:#636696;
  }
}
</style>

