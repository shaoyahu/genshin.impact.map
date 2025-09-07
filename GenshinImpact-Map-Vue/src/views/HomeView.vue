<script setup lang="ts">
import MapManager from '../js/map-manager'
import FilterHeader from '@/components/FilterHeader.vue'
import LocationBtn from '@/components/LocationBtn.vue';
import SelectedArea from '@/components/SelectedArea.vue';
import FilterMain from '@/components/FilterMain.vue';
import GuideMarkerUI from '@/components/GuideMarkerUI.vue';
import { onMounted } from 'vue';
import { getMapAnchorList } from '@/js/api';
import { useHomeStore } from '@/stores/home';
import { globalDataInstance } from '@/js/global-data';

const store = useHomeStore()
const { setMapAnchorList } = store

async function initMapAnchorList() {
  const res = await getMapAnchorList()
  setMapAnchorList(res.data)
}

onMounted(() => {
  console.log('原神！启动！',)
  init()
})
async function init() {
  globalDataInstance.mapManager = new MapManager('map')

  globalDataInstance.mapManager.enableClickDebug()
  await initMapAnchorList()
  globalDataInstance.mapManager.setMapAnchorList(store.mapAnchorList)
  globalDataInstance.mapManager.renderAreaNames()

}
</script>

<template>
  <div class="home-view">
    <div class="map-layer" id='map'></div>
    <div class="ui-layer">
      <div class="filter-container">
        <div class="filter-content">
          <div class="close-btn">
            <div class="close-icon"></div>
          </div>
          <LocationBtn />
          <SelectedArea />
          <FilterHeader />
          <div class="function-body">
            <div class="search-container">
              <div class="search-icon"></div>
              <div class="search-tip">搜索当前区域下的标点分类</div>
            </div>
            <div class="my-bag">我的背包</div>
          </div>
          <FilterMain />
        </div>
      </div>
      <GuideMarkerUI />
    </div>
  </div>
</template>

<style lang="less" scoped>
.home-view {
  position: relative;
  width: 100vw;
  height: 100vh;

  .map-layer {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  .ui-layer {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    z-index: 2;

    .filter-container {
      position: absolute;
      left: 0;
      top: 0;
      width: 415px;
      height: 100%;
      padding: 20px;
      box-sizing: border-box;
      z-index: 3;

      .filter-content {
        display: flex;
        flex-direction: column;
        background-color: #3b4354;
        width: 100%;
        height: 100%;
        border-radius: 12px;
        overflow: hidden;
        visibility: visible;


        .close-btn {
          position: absolute;
          right: -44px;
          top: 32px;
          width: 64px;
          height: 40px;
          background-image: url('/images/map-icon/close-bg.png');
          background-size: cover;
          display: flex;
          align-items: center;
          box-sizing: border-box;
          padding-left: 18px;

          .close-icon {
            width: 24px;
            height: 24px;
            background-image: url('/images/map-icon/close-icon.png');
            background-size: cover;
          }
        }

        .function-body {
          display: flex;
          justify-content: space-between;
          padding: 10px;

          .search-container {
            width: 210px;
            height: 32px;
            display: flex;
            align-items: center;
            background-color: #363e4d;
            border-radius: 22px;
            // margin: 10px auto;
            border: 1px solid #4f5563;
            color: #9b9c9f;
            font-size: 12px;

            .search-icon {
              width: 16px;
              height: 16px;
              background-image: url('/images/map-icon/search-icon.png');
              background-size: cover;
              margin: 0 5px 0 10px;
            }

          }

          .my-bag {
            position: relative;
            color: #d3bc8e;
            background-color: #4a5366;
            padding: 6px 10px;
            font-size: 14px;
            border-radius: 16px;
          }

        }

      }
    }
  }
}
</style>
