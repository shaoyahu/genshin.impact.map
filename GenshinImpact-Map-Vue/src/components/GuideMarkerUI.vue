<script setup lang='ts'>
import { EventManager } from '@/js/event-manager';
import { globalDataInstance } from '@/js/global-data';
import { type GuideUIItem } from '@/js/map-manager'
import { ref } from 'vue';

const guideUIAry = ref<GuideUIItem[]>([])

EventManager.on('RenderMapGuideUI', (data: GuideUIItem[]) => {
  guideUIAry.value = data
})

function calcOffsetStyle(item: GuideUIItem) {
  const { innerWidth, innerHeight } = window
  const screenAngle = Math.atan(innerHeight / innerWidth)
  const { angle } = item
  const marginTopSlope = angle > 0 ? -1 : 1
  const marginLeftSlope = Math.abs(angle) < Math.PI / 2 ? 1 : -1
  // console.log('marginLeftSlope', marginLeftSlope)

  const boundWidth = innerWidth - 100
  const boundHeight = innerHeight - 100

  let marginLeft
  let marginTop

  if (Math.abs(angle) > screenAngle && Math.abs(angle) < (Math.PI - screenAngle)) {
    // console.log('1', 1)
    marginTop = boundHeight * marginTopSlope / 2
    marginLeft = Math.abs(marginTop / Math.tan(angle)) * marginLeftSlope
  } else {
    // console.log('2', 2)
    marginLeft = boundWidth * marginLeftSlope / 2
    marginTop = Math.abs(Math.tan(angle) * marginLeft) * marginTopSlope
  }
  // console.log('margin', {
  //   marginLeft,
  //   marginTop
  // })

  return {
    marginLeft: `${marginLeft}px`,
    marginTop: `${marginTop}px`
  }
}

function calcBgRotation(item: GuideUIItem) {
  const rotate = Math.PI - item.angle
  return `rotate(${rotate}rad)`
}

function onGuideMarkerClick(item: GuideUIItem) {
  // globalDataInstance.mapManager.flyTo([item.lat, item.lng])
  globalDataInstance.mapManager.flyTo(item)
}
</script>

<template>
  <div class="guide-marker-ui">
    <div class="guide-marker-item" v-for="(item, index) in guideUIAry" :key="index" :style='calcOffsetStyle(item)'
      @click="onGuideMarkerClick(item)">
      <div class="marker-bg" :style="{ transform: calcBgRotation(item) }">
        <div class="arrow-icon"></div>
      </div>
      <div class="marker-img-container">
        <img class="item-icon" :src="item.icon" alt="">
      </div>
    </div>
  </div>
</template>

<style lang='less' scoped>
.guide-marker-ui {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 2;
  pointer-events: none;

  .guide-marker-item {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    pointer-events: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 53px;
    height: 53px;
    cursor: pointer;

    .marker-bg {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #00000080;
      border: 1px solid #ffffff4d;

      .arrow-icon {
        position: absolute;
        left: -19px;
        top: 15px;
        width: 19px;
        height: 26px;
        background-image: url('/images/map-icon/guide-arrow.png');
        background-size: cover;
      }
    }

    .marker-img-container {
      position: relative;
      z-index: 2;
      width: 48px;
      height: 48px;

      .item-icon {
        width: 100%;
      }
    }
  }
}
</style>
