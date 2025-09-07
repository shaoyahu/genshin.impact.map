<script setup lang='ts'>
import { getMapFilterTree } from '@/js/api'
import { useHomeStore } from '@/stores/home'
import type { TreeDataItem } from '@/types/api/map.types'
import { storeToRefs } from 'pinia'
import { onMounted, ref, computed } from 'vue'

const store = useHomeStore()

const activeTypeIndex = ref(0)
const { filterTree } = storeToRefs(store)

function onTypeItemClick(item: TreeDataItem) {
  activeTypeIndex.value = item.id
  document.querySelector(`#filterContentItem${item.id}`)?.scrollIntoView()
}

async function init() {
  const res = await getMapFilterTree()
  store.setFilterTree(res.data)
}

// 切换选中
function onFilterItemClick(item: TreeDataItem) {
  // console.log('onFilterItemClick', )
  // Reflect.set(item, 'active', !item.active)
  item.active = !item.active
}
// 获取左边列表角标数字
function getActiveCount(item: TreeDataItem) {
  let res = 0;
  (item.children as TreeDataItem[]).forEach((it: TreeDataItem) => res += it.active ? 1 : 0)
  return res
}

const hasValueFilterTree = computed(() => {
  return filterTree.value.map((parent) => ({
    ...parent,
    children: (parent.children as TreeDataItem[]).filter((child) => child.point_count)
  }))
})

onMounted(() => {
  init()
})
</script>

<template>
  <div class="filter-main">
    <div class="filter-main-left">
      <div class="filter-type-item" :class="{ active: item.id === activeTypeIndex }" v-for="item in filterTree"
        :key="item.id" @click="onTypeItemClick(item)">
        <div class="item-name">{{ item.name }}</div>
        <div class="item-count" v-if="getActiveCount(item) !== 0">{{ getActiveCount(item) }}</div>
      </div>
    </div>
    <div class="filter-main-right">
      <div class="filter-content-item" v-for="item in hasValueFilterTree" :key='item.id'
        :id="`filterContentItem${item.id}`">
        <div class="content-head">
          <div class="head-title">{{ item.name }}</div>
        </div>
        <div class="content-body">
          <div class="content-item" :class="{ active: it.active }" v-for="it in item.children" :key='it.id'
            @click="onFilterItemClick(it)">
            <div class="item-icon-container">
              <div class="icon-pic" :style="{ backgroundImage: `url(${it.icon})` }"></div>
              <div class="icon-count">{{ it.point_count }}</div>
              <div class="item-selected-icon"></div>
            </div>
            <div class="content-item-name">{{ it.name }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='less' scoped>
.filter-main {
  flex: 1;
  display: flex;
  overflow: hidden;

  .filter-main-left {
    width: 97px;
    background-color: #323947;
    height: 100%;
    overflow-y: scroll;
    padding-bottom: 56px;

    &::-webkit-scrollbar {
      display: none;
    }

    .filter-type-item {
      display: flex;
      flex-direction: column;
      padding: 16px 6px;
      position: relative;
      color: #ece6d9bf;

      &.active {
        background-image: url('/images/map-icon/filter-item-dec.png'), url('/images/map-icon/filter-item-dec2.png');
        background-size: 5px 100%, 24px 100%;
        background-position: 0 0, 5px 0;
        background-repeat: no-repeat;
        background-color: #3b4354;
        padding: 16px 10px;
        color: #d3bc8e;

        &:hover {
          color: #d3bc8e;
        }
      }

      &:hover {
        cursor: pointer;
        color: #ece5d8;
      }

      .item-name {
        font-size: 12px;
        font-weight: 400;
      }

      .item-count {
        position: absolute;
        top: 5px;
        right: 4px;
        border-radius: 6px;
        background-color: #3b4354;
        padding: 0 3px;
        line-height: 12px;
        font-size: 9px;
        color: #d3bc8e;
      }
    }
  }

  .filter-main-right {
    flex: 1;
    padding: 0 10px;
    overflow-y: auto;

    &::-webkit-scrollbar {
      display: none;
    }

    .filter-content-item {
      border-bottom: 1px solid #4a536680;

      .content-head {
        padding: 16px 0 0 2px;

        .head-title {
          color: #d3bc8e;
          font-size: 14px;
        }
      }

      .content-body {
        display: flex;
        flex-wrap: wrap;
        margin-top: 14px;

        .content-item {
          position: relative;
          margin-bottom: 15px;
          margin-right: 10px;
          cursor: pointer;

          &:nth-of-type(4n) {
            margin-right: 0;
          }

          &.active {
            .item-icon-container {

              &::after {
                position: absolute;
                display: block;
                content: "";
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border: 1px solid #d3bc8e;
                border-radius: 6px;
              }

              .item-selected-icon {
                position: absolute;
                top: 0;
                right: -1px;
                width: 24px;
                height: 14px;
                background-image: url('/images/map-icon/select-icon.png');
                background-size: cover;
              }
            }

            .content-item-name {
              color: #d3bc8e;
            }
          }

          .item-icon-container {
            position: relative;
            width: 57px;
            height: 57px;
            border-radius: 6px;
            background-color: #323947;

            .icon-pic {
              width: 100%;
              height: 100%;
              background-image: url('/images/map-icon/normal_box.png');
              background-size: cover;
            }

            .icon-count {
              position: absolute;
              font-size: 10px;
              right: 0;
              bottom: 0;
              line-height: 13px;
              color: #9b9c9f;
              background-color: #323947;
              padding: 0 4px;
              border-radius: 6px 0 6px 0;
            }
          }

          .content-item-name {
            font-size: 12px;
            margin-top: 5px;
            color: rgba(236, 230, 217, 0.75);
            max-width: 57px;
            overflow: hidden;
            white-space: nowrap;
            -o-text-overflow: ellipsis;
            text-overflow: ellipsis;
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
