import L from 'leaflet'
import { getMapPointDetail } from './api'
import { EventManager } from './event-manager'
import type { PointDetail } from '@/types/api/map.types'

interface AreaNameConfig {
  lat: number
  lng: number
  name: string
  children: AreaNameConfig[]
}

interface PointConfig {
  lat: number
  lng: number
  icon: string
  pointId: number
  name: string
}

export interface GuideUIItem {
  lat: number
  lng: number
  icon: string
  angle: number
}

interface Vector {
  x: number
  y: number
}

export default class MapManager {
  private map: L.Map
  private areaNameLayerGroup: L.LayerGroup | undefined
  private pointLayerGroup: L.LayerGroup | undefined
  private mapAnchorList: AreaNameConfig[] = []
  private lastActivePointId = -1
  private pointList: PointConfig[] = []

  constructor(domId: string) {
    // 设置地图边界，函数 latLngBounds 接受左上角坐标和右下角坐标确定地图边界
    const maxBounds = L.latLngBounds(L.latLng(-77, 56), L.latLng(-180, 202))
    this.map = L.map(domId, {
      center: [-84, 148],
      zoom: 5,
      crs: L.CRS.Simple,
      maxBounds,
      zoomControl: false,
      attributionControl: false,
      minZoom: 1,
      maxZoom: 7,
    })

    L.tileLayer('/images/map/{z}/{x}/{y}.png', {
      maxZoom: 7,
      bounds: maxBounds,
    }).addTo(this.map)

    this.map.addControl(
      // @ts-expect-error 11231
      new L.Control.Zoomslider({ position: 'bottomright', stepHeight: 30, knowHeight: 25 }),
    )

    this.map.on('zoom', () => {
      const curZoom = this.map.getZoom()
      console.log('当前 zoom 层级', curZoom)
      if (curZoom > 5) {
        alert('演示网站未配置层级5以上地图瓦片，请降低层级！')
      }
      this.renderAreaNames()
    })

    this.map.on('click', this.onMapClick.bind(this))

    this.map.on('moveend', this.calcOutScreenPoints.bind(this))
  }

  onMapClick() {
    const lastActivePoint = document.getElementById(`mapPointItem${this.lastActivePointId}`)
    lastActivePoint?.classList.remove('active')
    this.lastActivePointId = -1
  }

  renderAreaNames() {
    // console.log('this.mapAnchorList', this.mapAnchorList)
    this.areaNameLayerGroup?.clearLayers()
    const zoom = this.map.getZoom()
    let markers: L.Marker[] = []
    if (zoom === 5) {
      markers = this.getAreaNameMakerItem(this.mapAnchorList)
    }
    if (zoom === 6) {
      this.mapAnchorList.forEach((item) => {
        const v = this.getAreaNameMakerItem(item.children)
        markers = [...markers, ...v]
      })
    }

    this.areaNameLayerGroup = L.layerGroup(markers)
    this.areaNameLayerGroup.addTo(this.map)
  }
  renderPoints(pointList: PointConfig[]) {
    this.pointList = pointList
    this.pointLayerGroup?.clearLayers()

    const pointMarkers = pointList.map((point) => {
      const marker = L.marker(L.latLng(point.lat || 0, point.lng || 0), {
        icon: L.divIcon({
          className: 'map-point-item',
          html: `<div class='point-item-container' id='mapPointItem${point.pointId}'>
            <div class='point-pic' style='background-image: url(${point.icon})'></div>
            <div class='arrow-icon lt'></div>
            <div class='arrow-icon lb'></div>
            <div class='arrow-icon rt'></div>
            <div class='arrow-icon rb'></div>
          </div>`,
          iconSize: [37, 40],
          iconAnchor: [19, 20],
        }),
      })

      marker.bindPopup(
        L.popup({
          content: ``,
        }),
      )

      marker.on('popupopen', async () => {
        const res = await getMapPointDetail(point.pointId)
        marker.setPopupContent(this.calcPopupContent({ ...res.data, name: point.name }))
      })

      marker.on('click', () => {
        if (this.lastActivePointId === point.pointId) return

        const lastActivePoint = document.getElementById(`mapPointItem${this.lastActivePointId}`)
        lastActivePoint?.classList.remove('active')

        this.lastActivePointId = point.pointId

        const curPoint = document.getElementById(`mapPointItem${point.pointId}`)
        curPoint?.classList.add('active')
      })

      return marker
    })
    this.pointLayerGroup = L.layerGroup(pointMarkers)
    this.pointLayerGroup.addTo(this.map)

    this.calcOutScreenPoints()
  }

  // 计算超过屏幕范围之外的点位
  calcOutScreenPoints() {
    const guideUIArr: GuideUIItem[] = []

    const calcPointMap: Record<string, Record<string, number | boolean | string | PointConfig>> = {}
    const center = this.map.getCenter()

    for (let i = 0; i < this.pointList.length; i++) {
      const pointItem = this.pointList[i]
      const { name } = pointItem
      if (!calcPointMap[name]) {
        calcPointMap[name] = {}
      }

      if (calcPointMap[name].inScreen) {
        continue
      }

      const isContain = this.map.getBounds().contains(pointItem)
      if (!isContain) {
        const distance = center.distanceTo(pointItem)
        if (!calcPointMap[name].pointItem) {
          calcPointMap[name] = { distance, pointItem, inScreen: false }
        } else {
          const curDistance = calcPointMap[name].distance as number
          if (distance < curDistance) {
            calcPointMap[name] = { distance, pointItem, inScreen: false }
          }
        }
      } else {
        calcPointMap[name] = { inScreen: true }
      }
    }

    for (const key in calcPointMap) {
      const { inScreen, pointItem } = calcPointMap[key]
      if (!inScreen) {
        const { lat, lng, icon } = pointItem as PointConfig
        const directionVector = { x: lng - center.lng, y: lat - center.lat }
        const xVector = { x: 1, y: 0 }
        const angle = calcVectorAngle(xVector, directionVector)
        guideUIArr.push({ angle, icon, lat, lng })
      }
    }

    EventManager.emit('RenderMapGuideUI', guideUIArr)
  }

  setMapAnchorList(configList: AreaNameConfig[]) {
    this.mapAnchorList = configList
  }
  getAreaNameMakerItem(config: AreaNameConfig[]) {
    return config.map((marker) => {
      return L.marker(L.latLng(marker.lat || 0, marker.lng || 0), {
        icon: L.divIcon({
          className: 'map-marker-item',
          html: `<div class='area-mark-item'>${marker.name}</div>`,
        }),
      })
    })
  }
  enableClickDebug() {
    this.map.on('click', function (e) {
      const cordinate = e.latlng
      console.log('cordinate', cordinate)
    })
  }

  flyTo(latlng: L.LatLngExpression, zoom?: number) {
    this.map.flyTo(latlng, zoom)
  }

  calcPopupContent(data: PointDetail & { name: string }) {
    const avatarElStr = data.correct_user_list.map((val) => {
      return `<div class='avatar-item' title='${val.name}' style='background-image: url("${val.img}")'></div>`
    })

    return `<div class='point-popup-container'>
      <div class='popup-title'>${data.name}</div>
      <div class='popup-pic' style='background-image: url("${data.info.img}")'></div>
      <div class='point-name'>${data.info.content}</div>
      <div class='contributor-container'>
        <div class='contributor-label'>贡献者: </div>
        <div class='avatar-container'>
          ${avatarElStr}
        </div>
      </div>
      <div class='point-time'>更新时间: ${data.last_update_time}</div>
    </div>`
  }
}

function calcVectorAngle(vectorA: Vector, vectorB: Vector) {
  // 向量点乘 a · b = a1b1 + a2b2
  const dotProduct = vectorA.x * vectorB.x + vectorA.y * vectorB.y
  // 模的计算 各项平方和的开根号
  const magnitudeA = Math.sqrt(vectorA.x ** 2 + vectorA.y ** 2)
  const magnitudeB = Math.sqrt(vectorB.x ** 2 + vectorB.y ** 2)
  // a · b = |a||b| * cos角
  const cosTheta = dotProduct / (magnitudeA * magnitudeB)
  const theta = Math.acos(cosTheta)
  // 叉乘中，得到的是垂直于原向量的新向量
  const crossProduct = vectorA.x * vectorB.y - vectorA.y * vectorB.x
  const direction = crossProduct > 0 ? 1 : -1

  return theta * direction
}
