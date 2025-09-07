<script setup lang="ts">


</script>

<template>
  <div class="filter-header">
    <div class="header-container">
      <div class="header-icon"></div>
      <div class="header-name">须弥</div>
      <div class="switch-btn">
        <div class="switch-icon"></div>
        <div class="switch-text">切换</div>
      </div>
    </div>

  </div>
</template>

<style lang="less" scoped>
.filter-header {
  display: flex;
  align-items: center;
  padding: 12px 7px 7px 10px;
  color: #d3bc8e;

  .header-container {
    display: flex;
    align-items: center;
    cursor: pointer;


    .header-icon {
      width: 40px;
      height: 40px;
      background-image: url('/images/map-icon/xumi-icon.png');
      margin-right: 8px;
      background-size: cover;
    }

    .header-name {
      display: flex;
      justify-content: center;
      line-height: 24px;
      font-size: 16px;
      font-weight: 400;
      margin-bottom: 3px;
    }

    .switch-btn {
      display: flex;
      align-items: center;
      margin-left: 8px;
      padding: 2px 8px 2px 4px;
      font-size: 12px;
      border-radius: 12px;
      height: 20px;
      background-color: #4a5366;

      .switch-icon {
        width: 16px;
        height: 16px;
        background-image: url('/images/map-icon/switch-btn.png');
        background-size: cover;
      }

      .switch-text {
        height: 16px;
        margin-bottom: 4px;
      }
    }
  }
}
</style>
