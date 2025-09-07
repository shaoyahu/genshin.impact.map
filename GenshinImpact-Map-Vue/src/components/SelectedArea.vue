<script setup lang="ts">
import { useHomeStore } from '@/stores/home';
import type { TreeDataItem } from '@/types/api/map.types';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const expanded = ref(false)

const store = useHomeStore()
const { selectedFilterItems } = storeToRefs(store)


function onSelectedDelete(item: TreeDataItem) {
  // Reflect.set(item, 'active', !item.active)
  item.active = !item.active
}

</script>

<template>
  <div class="selected-area" v-if="selectedFilterItems.length > 0">
    <div class="selected-count" v-if="!expanded">
      <span>{{ selectedFilterItems.length }}</span>
    </div>
    <div class="selected-icon" v-if="!expanded" @click="() => expanded = !expanded"></div>

    <div class="list-container" v-else>
      <div class="up-container" @click="() => expanded = !expanded">
        <div class="up-icon"></div>
      </div>
      <div class="selected-item-box">
        <div class="selected-item" v-for="item in selectedFilterItems" :key="item.id">
          <div class="item-container">
            <div class="item-icon" :style="{ backgroundImage: `url(${item.icon})` }">
            </div>
          </div>
          <div class="icon-delete" @click="onSelectedDelete(item)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.selected-area {
  position: absolute;
  top: 136px;
  right: -32px;
  width: 40px;
  background-color: rgba(50, 57, 71, .8);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 0;

  .selected-count {
    position: absolute;
    top: -4px;
    right: -6px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: #ff5e41;
    display: flex;
    justify-content: center;
    align-items: center;

    &>span {
      font-size: 12px;
      color: #fff;
      text-align: center;
    }
  }

  .selected-icon {
    width: 24px;
    height: 24px;
    background-image: url('/images/map-icon/cart-icon.png');
    background-size: cover;
  }

  .list-container {
    padding: 4px 0 8px;

    .up-container {
      margin-bottom: 12px;
      display: flex;
      justify-content: center;

      .up-icon {
        width: 12px;
        height: 12px;
        background-image: url('/images/map-icon/arrow-top.png');
        background-size: cover;
      }
    }

    .selected-item-box {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .selected-item {
        cursor: pointer;
        position: relative;

        &:hover {
          .item-container {
            border-color: #d3bc8e;
          }

          .icon-delete {
            display: block;
          }
        }

        .item-container {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: #3b4252;
          border: 1px solid hsla(0, 0%, 100%, 0.16);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;

          .item-icon {
            width: 100%;
            height: 100%;
            background-size: cover;
          }

        }

        .icon-delete {
          display: none;
          position: absolute;
          top: -4px;
          right: -2px;
          width: 12px;
          height: 12px;
          background-image: url('/images/map-icon/delete-icon.svg');
          background-repeat: no-repeat;
          background-position: 50%;
          background-size: cover;
        }
      }
    }
  }
}
</style>
