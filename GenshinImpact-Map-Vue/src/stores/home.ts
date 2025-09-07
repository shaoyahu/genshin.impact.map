import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { globalDataInstance } from '@/js/global-data'
import type { AnchorListItem, PointItemDetail, TreeDataItem } from '@/types/api/map.types'

type SelectedPointList = PointItemDetail & {
  icon: string
  name: string
}

export const useHomeStore = defineStore('home', () => {
  // 选择筛选数据
  const filterTree = ref<TreeDataItem[]>([])
  const selectedFilterItems = ref<TreeDataItem[]>([])

  // 地图锚点标点数据
  const mapAnchorList = ref<AnchorListItem[]>([])

  watch(
    filterTree,
    () => {
      calcSelectedFilterItems()
    },
    { deep: true },
  )

  function setFilterTree(data: TreeDataItem[]) {
    filterTree.value = data
  }

  function calcSelectedFilterItems() {
    // 选中的所有二级点位
    let res: TreeDataItem[] = []
    // 选中的二级点位的所有位置的坐标信息
    let pointList: SelectedPointList[] = []

    filterTree.value.forEach((item: TreeDataItem) => {
      const activeItems = item.children.filter((child) => {
        return (child as TreeDataItem).active
      }) as TreeDataItem[]
      activeItems.forEach((item) => {
        const points = (item.children as PointItemDetail[]).map((it) => {
          return { ...it, icon: item.icon, name: item.name }
        })
        pointList = [...pointList, ...points]
      })
      res = [...res, ...activeItems]
    })

    if (globalDataInstance.mapManager) {
      globalDataInstance.mapManager.renderPoints(pointList)
    }

    selectedFilterItems.value = res
  }

  function setMapAnchorList(data: AnchorListItem[]) {
    mapAnchorList.value = data
  }
  return { setFilterTree, filterTree, selectedFilterItems, mapAnchorList, setMapAnchorList }
})
