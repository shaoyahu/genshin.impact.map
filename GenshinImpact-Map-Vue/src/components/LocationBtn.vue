<script setup lang="ts">
import { globalDataInstance } from '../js/global-data'
import { useHomeStore } from '@/stores/home';
import type { AnchorListItem } from '@/types/api/map.types';
import { storeToRefs } from 'pinia';

const store = useHomeStore()
const { mapAnchorList } = storeToRefs(store)

function onAreaNameClick(item: AnchorListItem, zoom: number) {
  globalDataInstance.mapManager.flyTo([-120, 145], zoom)
}

</script>

<template>
  <div class="location-btn">
    <div class="location-icon"></div>
    <div class="location-content">
      <div class="location-content-title">快速定位</div>
      <div class="content-areas">
        <div class="area-item" v-for="item in mapAnchorList" :key="item.id">
          <div class="area-parent" @click="onAreaNameClick(item, 5)">
            <div class="parent-icon"></div>
            <div class="parent-name">{{ item.name }}</div>
          </div>
          <div class="area-child" @click="onAreaNameClick(it, 6)" v-for="it in item.children" :key="it.id"> {{ it.name
            }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.location-btn {
  position: absolute;
  top: 84px;
  right: -32px;
  width: 40px;
  height: 40px;
  background-color: rgba(50, 57, 71, .8);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    .location-content {
      visibility: visible;
    }
  }

  .location-icon {
    width: 24px;
    height: 24px;
    background-image: url('/images/map-icon/location-btn.png');
    background-size: cover;
  }

  .location-content {
    position: absolute;
    background: #3b4354;
    border-radius: 12px;
    top: 0;
    left: 52px;
    width: 230px;
    visibility: hidden;
    transition: all .5s;

    .location-content-title {
      font-size: 16px;
      color: #d3bc8e;
      padding: 12px;
      border-bottom: 1px solid rgba(86, 97, 120, .2);
      font-weight: bold;
    }

    .content-areas {
      height: 500px;
      overflow-y: auto;

      &::-webkit-scrollbar {
        display: none;
      }

      .area-item {
        .area-parent {
          display: flex;
          align-items: center;
          height: 48px;
          padding-left: 15px;

          &:hover {
            .parent-icon {
              background-image: url('/images/map-icon/location-icon-h.png');
            }

            .parent-name {
              color: #ece5d8;
            }
          }

          .parent-icon {
            width: 12px;
            height: 12px;
            background-image: url('/images/map-icon/location-icon-n.png');
            background-size: cover;
            margin-right: 5px;
          }

          .parent-name {
            color: #d3bc8e;
            font-size: 14px;
            font-weight: 400;
          }
        }

        .area-child {
          display: flex;
          align-items: center;
          height: 48px;
          font-weight: 400;
          color: hsla(39, 34%, 89%, .75);
          padding-left: 32px;

          &:hover {
            color: #ece5d8;
          }
        }
      }
    }
  }
}
</style>
