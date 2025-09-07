import type { AnchorListItem, PointDetail, TreeDataItem } from '@/types/api/map.types'
import { mainRequest } from './base-request'

export function getMapFilterTree() {
  return mainRequest.sendRequest<TreeDataItem[]>('GET', '/label/tree')
}

export function getMapAnchorList() {
  return mainRequest.sendRequest<AnchorListItem[]>('GET', '/map_anchor/list')
}

export function getMapPointDetail(pointId: number) {
  return mainRequest.sendRequest<PointDetail>('GET', `/map/point/detail/${pointId}`)
}
